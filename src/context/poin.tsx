import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { STATUS_POIN_AWAL } from "@/data/poin";
import { poinRepository as repo } from "@/services/poinrepository";
import { StatusPoin } from "@/types/poin";
import { ringkasKlaim, terapkanKlaim } from "@/utils/poin";

export type HasilKlaim = { poin: number; hari: number };

type PoinContextValue = {
  status: StatusPoin;
  total: number;
  memuat: boolean;
  // null = klaim ditolak (sudah diklaim / di luar jam klaim). Melempar error kalau gagal menyimpan.
  klaim: () => Promise<HasilKlaim | null>;
  // Mengurangi poin (mis. tukar voucher). false = poin tidak cukup. Melempar error kalau gagal menyimpan.
  gunakan: (jumlah: number) => Promise<boolean>;
};

const PoinContext = createContext<PoinContextValue | null>(null);

export function PoinProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<StatusPoin>(STATUS_POIN_AWAL);
  const [memuat, setMemuat] = useState(true);

  useEffect(() => {
    let aktif = true;
    (async () => {
      try {
        const tersimpan = await repo.ambil();
        if (aktif) setStatus(tersimpan);
      } finally {
        if (aktif) setMemuat(false);
      }
    })();
    return () => {
      aktif = false;
    };
  }, []);

  const klaim = async () => {
    const sekarang = Date.now();
    const ringkasan = ringkasKlaim(status, sekarang);
    if (ringkasan.fase !== "bisa") return null;

    const hasil = terapkanKlaim(status, ringkasan, sekarang);
    await repo.simpan(hasil.status);
    setStatus(hasil.status);
    return { poin: hasil.poin, hari: hasil.hari };
  };

  const gunakan = async (jumlah: number) => {
    if (jumlah <= 0 || status.total < jumlah) return false;
    const baru: StatusPoin = { ...status, total: status.total - jumlah };
    await repo.simpan(baru);
    setStatus(baru);
    return true;
  };

  return (
    <PoinContext.Provider value={{ status, total: status.total, memuat, klaim, gunakan }}>
      {children}
    </PoinContext.Provider>
  );
}

export function usePoin() {
  const ctx = useContext(PoinContext);
  if (!ctx) throw new Error("usePoin harus dipakai di dalam PoinProvider");
  return ctx;
}
