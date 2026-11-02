import { Voucher } from "@/types/voucher";

// Voucher tanpa tanggal berlaku aktif sekian hari sejak ditukar
export const MASA_BERLAKU_DEFAULT_HARI = 30;

// Tingkat keanggotaan di kartu atas. Nanti dari profil pengguna.
export const TINGKAT_MEMBER = "Fajar Platinum";

// Data contoh katalog. Nanti diganti data dari API.
export const KATALOG_VOUCHER: readonly Voucher[] = [
  {
    id: "diskon-ayam",
    tag: "Potongan Rp 10.000",
    nadaTag: "hijau",
    kategori: "Halal MUI",
    judul: "Diskon Belanja Ayam Potong",
    deskripsi: "Min. transaksi Rp 60.000 (Ayam Utuh / Broiler / Fillet)",
    biaya: 500,
    berlakuSampai: "2026-12-31",
    judulKupon: "Diskon Ayam Potong Rp 10.000",
    syaratKupon: "Min. Belanja Rp 60.000",
  },
  {
    id: "ongkir-fajar",
    tag: "Gratis Ongkir",
    nadaTag: "peach",
    judul: "Gratis Ongkir Fajar (s.d Rp 10rb)",
    deskripsi: "Khusus pengantaran kloter fajar 05.30 - 08.00 WIB",
    catatan: "Semua rute radius 7 km",
    biaya: 350,
    populer: true,
    judulKupon: "Gratis Ongkir",
    syaratKupon: "Min. Belanja Rp 0",
  },
  {
    id: "jastip-pasar",
    tag: "Hemat Rp 5.000",
    nadaTag: "hijau",
    kategori: "Sayur & Bumbu",
    judul: "Potongan Jasa Titip Belanja Pasar",
    deskripsi: "Titip bumbu giling, tahu tempe, & cabai segar pasar tradisional",
    catatan: "Min. pesanan jastip Rp 25.000",
    biaya: 250,
    judulKupon: "Hemat Rp 5.000 Jasa Titip",
    syaratKupon: "Min. pesanan jastip Rp 25.000",
  },
  {
    id: "cashback-7",
    tag: "Cashback 7%",
    nadaTag: "hijau",
    judul: "Cashback Belanja Pasar",
    deskripsi: "Cashback 7% (maks. Rp 10.000) untuk belanja di kios pasar tradisional",
    biaya: 400,
    berlakuSampai: "2026-11-30",
    judulKupon: "Cashback 7% Maks Rp 10.000",
    syaratKupon: "Min. Belanja Rp 60.000",
    rincianKupon: { kiri: "Penerimaan Cashback", kanan: "Saldo atau Voucher" },
  },
];
