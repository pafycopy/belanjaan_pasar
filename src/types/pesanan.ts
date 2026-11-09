import { TagihanTransfer } from "@/types/pembayaran";

export type StatusPesanan = "disiapkan" | "dikirim" | "selesai";

// Pesanan = tagihan yang sudah dibayar + perkembangan statusnya.
// Nanti status, estimasi, dan foto bukti datang dari server / kurir.
export type Pesanan = Omit<TagihanTransfer, "batasBayar" | "dibayarPada"> & {
  dibayarPada: number;     // ms
  status: StatusPesanan;
  titikAntar?: string;     // tempat pesanan ditinggalkan, mis. "Cantolan Pagar Depan" (hanya diantar)
  estimasiTiba?: string;   // mis. "06.15 WIB", terisi saat dikirim
  diterimaPada?: number;   // ms, terisi saat selesai
};
