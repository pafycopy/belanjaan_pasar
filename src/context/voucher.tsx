import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { KATALOG_VOUCHER } from "@/data/voucher";
import { usePoin } from "@/context/poin";
import { voucherRepository as repo } from "@/services/voucherrepository";
import { HasilTukar, VoucherMilik } from "@/types/voucher";
import { sudahKedaluwarsa } from "@/utils/voucher";

type VoucherContextValue = {
  milik: VoucherMilik[];     // terbaru di atas
  memuat: boolean;
  // Menukar poin dengan voucher. Melempar error kalau gagal menyimpan.
  tukar: (voucherId: string) => Promise<HasilTukar>;
};

const VoucherContext = createContext<VoucherContextValue | null>(null);

function buatUid(): string {
  return `v-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export function VoucherProvider({ children }: { children: ReactNode }) {
  const poin = usePoin();
  const [milik, setMilik] = useState<VoucherMilik[]>([]);
  const [memuat, setMemuat] = useState(true);

  useEffect(() => {
    let aktif = true;
    (async () => {
      try {
        const tersimpan = await repo.ambil();
        if (aktif) setMilik(tersimpan);
      } finally {
        if (aktif) setMemuat(false);
      }
    })();
    return () => {
      aktif = false;
    };
  }, []);

  const tukar = async (voucherId: string): Promise<HasilTukar> => {
    const voucher = KATALOG_VOUCHER.find((v) => v.id === voucherId);
    if (!voucher) return "tidakAda";
    if (sudahKedaluwarsa(voucher)) return "kedaluwarsa";
    if (poin.total < voucher.biaya) return "poinKurang";

    const baru: VoucherMilik = {
      uid: buatUid(),
      voucherId,
      ditukarPada: new Date().toISOString(),
    };
    const daftarBaru = [baru, ...milik];

    // Simpan voucher dulu, baru kurangi poin. Kalau poin gagal dikurangi, voucher dibatalkan.
    await repo.simpan(daftarBaru);
    try {
      const ok = await poin.gunakan(voucher.biaya);
      if (!ok) throw new Error("poin tidak cukup");
    } catch (e) {
      await repo.simpan(milik).catch(() => {});
      throw e;
    }
    setMilik(daftarBaru);
    return "berhasil";
  };

  return <VoucherContext.Provider value={{ milik, memuat, tukar }}>{children}</VoucherContext.Provider>;
}

export function useVoucher() {
  const ctx = useContext(VoucherContext);
  if (!ctx) throw new Error("useVoucher harus dipakai di dalam VoucherProvider");
  return ctx;
}
