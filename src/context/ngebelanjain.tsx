import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { ngebelanjainRepository as repo } from "@/services/ngebelanjainrepository";
import { PesananNgebelanjain } from "@/types/ngebelanjain";

type NgebelanjainContextValue = {
  pesanan: PesananNgebelanjain[];
  memuat: boolean;
  tambah: (pesanan: PesananNgebelanjain) => Promise<void>;
  perbarui: (nomor: string, ubah: (p: PesananNgebelanjain) => PesananNgebelanjain) => Promise<void>;
};

const NgebelanjainContext = createContext<NgebelanjainContextValue | null>(null);

export function NgebelanjainProvider({ children }: { children: ReactNode }) {
  const [pesanan, setPesanan] = useState<PesananNgebelanjain[]>([]);
  const [memuat, setMemuat] = useState(true);

  useEffect(() => {
    let aktif = true;
    repo
      .ambilSemua()
      .then((daftar) => {
        if (aktif) setPesanan(daftar);
      })
      .finally(() => {
        if (aktif) setMemuat(false);
      });
    return () => {
      aktif = false;
    };
  }, []);

  const tambah = async (baru: PesananNgebelanjain) => {
    setPesanan(await repo.tambah(baru));
  };

  const perbarui = async (nomor: string, ubah: (p: PesananNgebelanjain) => PesananNgebelanjain) => {
    setPesanan(await repo.perbarui(nomor, ubah));
  };

  return (
    <NgebelanjainContext.Provider value={{ pesanan, memuat, tambah, perbarui }}>{children}</NgebelanjainContext.Provider>
  );
}

export function useNgebelanjain() {
  const ctx = useContext(NgebelanjainContext);
  if (!ctx) throw new Error("useNgebelanjain harus dipakai di dalam NgebelanjainProvider");
  return ctx;
}
