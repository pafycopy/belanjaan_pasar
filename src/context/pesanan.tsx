import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { pesananRepository as repo } from "@/services/pesananrepository";
import { Pesanan } from "@/types/pesanan";
import { majukanStatus } from "@/utils/pesanan";

type PesananContextValue = {
  pesanan: Pesanan[];
  memuat: boolean;
  tambah: (pesanan: Pesanan) => Promise<void>;
  majukan: (invoice: string) => Promise<void>; // simulasi tahap berikutnya (mode pengembangan)
};

const PesananContext = createContext<PesananContextValue | null>(null);

export function PesananProvider({ children }: { children: ReactNode }) {
  const [pesanan, setPesanan] = useState<Pesanan[]>([]);
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

  const tambah = async (baru: Pesanan) => {
    setPesanan(await repo.tambah(baru));
  };

  const majukan = async (invoice: string) => {
    setPesanan(await repo.perbarui(invoice, (p) => majukanStatus(p)));
  };

  return (
    <PesananContext.Provider value={{ pesanan, memuat, tambah, majukan }}>{children}</PesananContext.Provider>
  );
}

export function usePesanan() {
  const ctx = useContext(PesananContext);
  if (!ctx) throw new Error("usePesanan harus dipakai di dalam PesananProvider");
  return ctx;
}
