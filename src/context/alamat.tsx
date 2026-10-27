import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Alamat, AlamatInput } from "@/types/alamat";
import { alamatRepository as repo } from "@/services/alamatrepository";

// Tipe tetap bisa diimpor dari sini seperti sebelumnya
export type { Alamat, AlamatInput } from "@/types/alamat";

type AlamatContextValue = {
  daftar: Alamat[];
  terpilihId: string | null;
  terpilih: Alamat | null;
  memuat: boolean;
  pilih: (id: string) => void;
  hapus: (id: string) => void;
  // Tanpa id = tambah baru (otomatis jadi alamat terpilih). Dengan id = perbarui.
  simpan: (data: AlamatInput, id?: string) => Promise<Alamat>;
};

const AlamatContext = createContext<AlamatContextValue | null>(null);

export function AlamatProvider({ children }: { children: ReactNode }) {
  const [daftar, setDaftar] = useState<Alamat[]>([]);
  const [terpilihId, setTerpilihId] = useState<string | null>(null);
  const [memuat, setMemuat] = useState(true);

  // Muat data dari penyimpanan saat app dibuka
  useEffect(() => {
    let aktif = true;
    (async () => {
      try {
        const [semua, idTersimpan] = await Promise.all([repo.ambilSemua(), repo.ambilIdTerpilih()]);
        if (!aktif) return;
        const idValid = idTersimpan && semua.some((a) => a.id === idTersimpan) ? idTersimpan : null;
        const idAkhir = idValid ?? semua[0]?.id ?? null;
        setDaftar(semua);
        setTerpilihId(idAkhir);
        if (idAkhir !== idTersimpan) await repo.simpanIdTerpilih(idAkhir);
      } finally {
        if (aktif) setMemuat(false);
      }
    })();
    return () => {
      aktif = false;
    };
  }, []);

  const pilih = (id: string) => {
    setTerpilihId(id);
    void repo.simpanIdTerpilih(id).catch(() => {});
  };

  const hapus = (id: string) => {
    const sisa = daftar.filter((a) => a.id !== id);
    setDaftar(sisa);
    void repo.hapus(id).catch(() => {});
    // Kalau yang dihapus sedang terpilih, pindah ke alamat pertama yang tersisa
    if (terpilihId === id) {
      const berikutnya = sisa[0]?.id ?? null;
      setTerpilihId(berikutnya);
      void repo.simpanIdTerpilih(berikutnya).catch(() => {});
    }
  };

  const simpan = async (data: AlamatInput, id?: string) => {
    if (id) {
      const baru = await repo.perbarui(id, data);
      setDaftar((list) => list.map((a) => (a.id === id ? baru : a)));
      return baru;
    }
    const baru = await repo.buat(data);
    setDaftar((list) => [...list, baru]);
    setTerpilihId(baru.id);
    await repo.simpanIdTerpilih(baru.id);
    return baru;
  };

  const terpilih = daftar.find((a) => a.id === terpilihId) ?? null;

  return (
    <AlamatContext.Provider value={{ daftar, terpilihId, terpilih, memuat, pilih, hapus, simpan }}>
      {children}
    </AlamatContext.Provider>
  );
}

export function useAlamat() {
  const ctx = useContext(AlamatContext);
  if (!ctx) throw new Error("useAlamat harus dipakai di dalam AlamatProvider");
  return ctx;
}
