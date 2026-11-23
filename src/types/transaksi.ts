import { TagihanTransfer } from "@/types/pembayaran";

export type StatusTransaksi = "menunggu" | "berhasil" | "gagal" | "kedaluwarsa" | "dibatalkan";

/** Snapshot pembayaran yang disimpan sebagai log, terpisah dari siklus hidup pesanan. */
export type Transaksi = TagihanTransfer & {
  statusTransaksi: StatusTransaksi;
  jenisTransaksi: "pesanan" | "ngebelanjain";
  deskripsi?: string;
  metodeLabel?: string;
  dibuatLogPada: number;
  diperbaruiPada: number;
  dibatalkanPada?: number;
  gagalPada?: number;
  alasanGagal?: string;
};
