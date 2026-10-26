import { createContext, useContext, useState, ReactNode } from "react";

export type Alamat = {
  id: string;
  kategori: string;       // contoh: "Warung / Usaha"
  namaPenerima: string;
  jalan: string;          // alamat lengkap dan nomor
  wilayah: string;        // kecamatan dan kelurahan
  kodePos?: string;
  patokan?: string;
  latitude: number;
  longitude: number;
  jarakKm?: number;
};

// Data contoh (koordinat perkiraan, hanya untuk uji tampilan)
const contoh: Alamat[] = [
  {
    id: "1",
    kategori: "Warung / Usaha",
    namaPenerima: "Dapur Warung Soto Bu Ratna",
    jalan: "Jl. Musyawarah No. 44, Joglo",
    wilayah: "Kembangan, Joglo",
    latitude: -6.2186,
    longitude: 106.7409,
    jarakKm: 1.8,
  },
  {
    id: "2",
    kategori: "Dapur Katering",
    namaPenerima: "Dapur Katering Kembangan Baru",
    jalan: "Komplek BPPT Blok C1 No. 8",
    wilayah: "Kembangan, Meruya",
    latitude: -6.1887,
    longitude: 106.739,
    jarakKm: 3.2,
  },
];

type AlamatContextValue = {
  daftar: Alamat[];
  terpilihId: string | null;
  pilih: (id: string) => void;
  hapus: (id: string) => void;
  simpan: (alamat: Alamat) => void; // tambah baru, atau perbarui jika id sudah ada
};

const AlamatContext = createContext<AlamatContextValue | null>(null);

export function AlamatProvider({ children }: { children: ReactNode }) {
  const [daftar, setDaftar] = useState<Alamat[]>(contoh);
  const [terpilihId, setTerpilihId] = useState<string | null>(contoh[0]?.id ?? null);

  const pilih = (id: string) => setTerpilihId(id);

  const hapus = (id: string) => {
    setDaftar((list) => list.filter((a) => a.id !== id));
    setTerpilihId((current) => (current === id ? null : current));
  };

  const simpan = (alamat: Alamat) => {
    setDaftar((list) =>
      list.some((a) => a.id === alamat.id)
        ? list.map((a) => (a.id === alamat.id ? alamat : a))
        : [...list, alamat]
    );
  };

  return (
    <AlamatContext.Provider value={{ daftar, terpilihId, pilih, hapus, simpan }}>
      {children}
    </AlamatContext.Provider>
  );
}

export function useAlamat() {
  const ctx = useContext(AlamatContext);
  if (!ctx) throw new Error("useAlamat harus dipakai di dalam AlamatProvider");
  return ctx;
}