import { ImageSource } from "expo-image";
import { colors } from "@/theme";
import { IconName } from "@/types/ui";

// Batas berat bersih satu keranjang (kg). Nanti bisa datang dari pengaturan kios / backend.
export const KAPASITAS_KERANJANG_KG = 50;

export type IdPengiriman = "antar" | "ambil";

export const PENGIRIMAN_BAWAAN: IdPengiriman = "antar";

// Pilihan pengiriman: label dan ikon dari data
export const OPSI_PENGIRIMAN: readonly { id: IdPengiriman; label: string; icon: IconName }[] = [
  { id: "antar", label: "Antar ke Rumah", icon: "bicycle" },
  { id: "ambil", label: "Ambil di Toko", icon: "storefront-outline" },
];

/* ---------- Metode pembayaran ---------- */

export type IdMetode = "bca" | "qris" | "cod";

export type MetodePembayaran = {
  id: IdMetode;
  nama: string;
  keterangan?: string;
  // Tampilan logo (urutan prioritas): file `logo` > `ikon` dalam kotak lavender > teks `singkatan`
  logo?: ImageSource | number;   // mis. require("../../assets/images/pembayaran/bca.svg")
  ikon?: IconName;
  singkatan?: string;
  warnaSingkatan?: string;
};

export const METODE_PEMBAYARAN: readonly MetodePembayaran[] = [
  { id: "bca", nama: "BCA Transfer", singkatan: "BCA", warnaSingkatan: colors.brandBca },
  {
    id: "qris",
    nama: "QRIS Instan",
    keterangan: "GoPay, ShopeePay, OVO, Dana",
    singkatan: "QRIS",
    warnaSingkatan: colors.text,
  },
  {
    id: "cod",
    nama: "Bayar di Tempat (COD)",
    keterangan: "Bayar tunai ke kurir saat pesanan sampai",
    ikon: "cash",
  },
];

export const METODE_BAWAAN: IdMetode = "qris";

/* ---------- Ongkir ---------- */

export type TarifOngkir = {
  sampaiKm: number; // berlaku untuk jarak sampai sekian km
  label: string;
  tarif: number;    // Rupiah
};

// Urutkan dari yang terdekat. Tambah tingkatan baru di sini bila radius lain sudah ditentukan.
export const TARIF_ONGKIR: readonly TarifOngkir[] = [
  { sampaiKm: 3, label: "Radius 1\u20133 km", tarif: 10000 },
];
