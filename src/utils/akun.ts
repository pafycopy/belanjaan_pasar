import { KATALOG_VOUCHER } from "@/data/voucher";
import { VoucherMilik } from "@/types/voucher";
import { statusMilik } from "@/utils/voucher";

// Jumlah voucher milik pengguna yang masih aktif (belum dipakai, belum kedaluwarsa)
export function hitungVoucherAktif(milik: readonly VoucherMilik[], sekarang: number = Date.now()): number {
  return milik.filter((m) => {
    const v = KATALOG_VOUCHER.find((x) => x.id === m.voucherId);
    return !!v && statusMilik(m, v, sekarang) === "aktif";
  }).length;
}
