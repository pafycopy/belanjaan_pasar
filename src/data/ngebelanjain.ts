import { ImageSource } from "expo-image";
import { IconName } from "@/types/ui";

export type StatusNgebelanjain = { id: string; label: string; ikon: IconName };

// Tahapan pesanan Ngebelanjain (titip belanja pasar), urut dari awal sampai akhir
export const STATUS_NGEBELANJAIN: readonly StatusNgebelanjain[] = [
  { id: "diproses", label: "Sedang\nDiproses", ikon: "sync-circle-outline" },
  { id: "dibelanjain", label: "Sedang\nDibelanjain", ikon: "cart" },
  { id: "pembayaran", label: "Pembayaran\nTersedia", ikon: "card" },
  { id: "dibayar", label: "Sudah\nDibayar", ikon: "checkbox-outline" },
];

// Ilustrasi layar kosong. Kosong = tampil gambar sementara dari ikon.
// Untuk memasang gambar asli: taruh file di assets/images lalu isi, mis.
//   export const ILUSTRASI_NGEBELANJAIN_KOSONG = require("../../assets/images/ngebelanjain-kosong.png");
export const ILUSTRASI_NGEBELANJAIN_KOSONG: ImageSource | number | undefined = undefined;
