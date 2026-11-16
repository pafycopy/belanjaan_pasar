import { colors } from "@/theme";
import { StatusPesanan } from "@/types/pesanan";

// Status pesanan yang masuk ke Riwayat Transaksi. Tambah status di sini bila riwayat perlu memuat lebih banyak.
export const STATUS_RIWAYAT: readonly StatusPesanan[] = ["selesai"];

// Warna lencana status di kartu riwayat (bg = latar, fg = teks)
export const GAYA_STATUS_RIWAYAT: Record<StatusPesanan, { bg: string; fg: string }> = {
  selesai: { bg: colors.mintFade, fg: colors.dark },
  dikirim: { bg: colors.primarySoft, fg: colors.dark },
  disiapkan: { bg: colors.peachSoft, fg: colors.orange },
};
