import { ImageSource } from "expo-image";
import { MetodeNgebelanjain, StatusNgebelanjain } from "@/types/ngebelanjain";
import { IconName } from "@/types/ui";

export type TabNgebelanjain = { id: StatusNgebelanjain; label: string; ikon: IconName };

// Tahapan pesanan Ngebelanjain (titip belanja pasar), urut dari awal sampai akhir
export const TAB_NGEBELANJAIN: readonly TabNgebelanjain[] = [
  { id: "diproses", label: "Sedang\nDiproses", ikon: "sync-circle-outline" },
  { id: "dibelanjain", label: "Sedang\nDibelanjain", ikon: "cart" },
  { id: "pembayaran", label: "Pembayaran\nTersedia", ikon: "card" },
  { id: "dibayar", label: "Sudah\nDibayar", ikon: "checkbox-outline" },
];

export type OpsiMetodeNgebelanjain = { id: MetodeNgebelanjain; nama: string; keterangan: string; ikon: IconName };

export const OPSI_METODE_NGEBELANJAIN: readonly OpsiMetodeNgebelanjain[] = [
  { id: "qris", nama: "QRIS", keterangan: "GoPay, ShopeePay, OVO, Dana", ikon: "qr-code-outline" },
  { id: "cod", nama: "Bayar di Tempat (COD)", keterangan: "Bayar tunai ke kurir saat pesanan sampai", ikon: "cash-outline" },
];

export const NAMA_METODE_NGEBELANJAIN: Record<MetodeNgebelanjain, string> = { qris: "QRIS", cod: "COD" };

// Nomor WhatsApp admin untuk "Chat via WhatsApp", format internasional tanpa + (mis. "628123456789").
// WAJIB diisi sebelum dipakai; kosong = tombol chat menampilkan peringatan.
export const NOMOR_WA_NGEBELANJAIN = "";

// Gambar QRIS toko untuk layar "Menunggu Pembayaran". Kosong = tampil kotak pengganti.
// Pasang: taruh file di assets/images lalu isi, mis.
//   export const GAMBAR_QRIS = require("../../assets/images/qris.png");
export const GAMBAR_QRIS: ImageSource | number | undefined = undefined;

// Ilustrasi layar kosong. Kosong = tampil gambar sementara dari ikon.
export const ILUSTRASI_NGEBELANJAIN_KOSONG: ImageSource | number | undefined = undefined;

// Data contoh untuk simulasi tugas admin di mode pengembangan (nanti diisi admin lewat server)
export const ESTIMASI_SELESAI_CONTOH = "06.15 WIB";
export const TAGIHAN_CONTOH = { totalProduk: 80000, jasaHelper: 10000, ongkir: 10000 } as const;
