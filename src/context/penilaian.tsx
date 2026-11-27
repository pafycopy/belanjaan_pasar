import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from "react";
import { penilaianRepository } from "@/services/penilaianrepository";
import { PenilaianProduk, RingkasanPenilaian } from "@/types/penilaian";

type PenilaianBaru = Omit<PenilaianProduk, "id" | "dibuatPada">;
type PenilaianContextValue = {
  penilaian: PenilaianProduk[];
  memuat: boolean;
  simpan: (data: PenilaianBaru[]) => Promise<void>;
  ringkasan: (produkId: string) => RingkasanPenilaian | null;
};

const PenilaianContext = createContext<PenilaianContextValue | null>(null);

export function PenilaianProvider({ children }: { children: ReactNode }) {
  const [penilaian, setPenilaian] = useState<PenilaianProduk[]>([]);
  const [memuat, setMemuat] = useState(true);

  useEffect(() => {
    let aktif = true;
    penilaianRepository.ambilSemua()
      .then((data) => { if (aktif) setPenilaian(data); })
      .finally(() => { if (aktif) setMemuat(false); });
    return () => { aktif = false; };
  }, []);

  const simpan = useCallback(async (data: PenilaianBaru[]) => {
    const berikutnya = [...penilaian];
    const sekarang = new Date().toISOString();

    data.forEach((item) => {
      const indeks = berikutnya.findIndex(
        (lama) => lama.pesananId === item.pesananId && lama.produkId === item.produkId
      );
      const baru: PenilaianProduk = {
        ...item,
        id: indeks >= 0 ? berikutnya[indeks].id : `${item.pesananId}-${item.produkId}`,
        dibuatPada: sekarang,
      };
      if (indeks >= 0) berikutnya[indeks] = baru;
      else berikutnya.push(baru);
    });

    await penilaianRepository.simpanSemua(berikutnya);
    setPenilaian(berikutnya);
  }, [penilaian]);

  const ringkasan = useCallback((produkId: string): RingkasanPenilaian | null => {
    const daftar = penilaian.filter((item) => item.produkId === produkId);
    if (daftar.length === 0) return null;
    const total = daftar.reduce((jumlah, item) => jumlah + item.rating, 0);
    return { rating: total / daftar.length, jumlahUlasan: daftar.length };
  }, [penilaian]);

  return (
    <PenilaianContext.Provider value={{ penilaian, memuat, simpan, ringkasan }}>
      {children}
    </PenilaianContext.Provider>
  );
}

export function usePenilaian() {
  const ctx = useContext(PenilaianContext);
  if (!ctx) throw new Error("usePenilaian harus dipakai di dalam PenilaianProvider");
  return ctx;
}
