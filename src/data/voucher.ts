import { Voucher } from "@/types/voucher";

// Tingkat keanggotaan di kartu atas. Nanti dari profil pengguna.
export const TINGKAT_MEMBER = "Fajar Platinum";

// Data contoh katalog. Nanti diganti data dari API.
export const KATALOG_VOUCHER: readonly Voucher[] = [
  {
    id: "diskon-ayam",
    jenis: "potongan",
    judul: "Diskon Belanja Ayam Potong",
    deskripsi: "Min. transaksi Rp 60.000 (Ayam Utuh / Broiler / Fillet)",
    biaya: 500,
    kuota: 0,
    berlakuSampai: "2026-12-31",
    judulKupon: "Diskon Ayam Potong Rp 10.000",
    syaratKupon: "Min. Belanja Rp 60.000",
  },
  {
    id: "ongkir-fajar",
    jenis: "ongkir",
    judul: "Gratis Ongkir Fajar (s.d Rp 10rb)",
    deskripsi: "Khusus pengantaran kloter fajar 05.30 - 08.00 WIB",
    biaya: 350,
    kuota: 25,
    berlakuSampai: "2026-12-15",
    judulKupon: "Gratis Ongkir",
    syaratKupon: "Min. Belanja Rp 0",
  },
  {
    id: "jastip-pasar",
    jenis: "potongan",
    judul: "Potongan Jasa Titip Belanja Pasar",
    deskripsi: "Titip bumbu giling, tahu tempe, & cabai segar pasar tradisional",
    biaya: 250,
    kuota: 40,
    berlakuSampai: "2026-12-20",
    judulKupon: "Hemat Rp 5.000 Jasa Titip",
    syaratKupon: "Min. pesanan jastip Rp 25.000",
  },
  {
    id: "cashback-7",
    jenis: "potongan",
    judul: "Cashback Belanja Pasar",
    deskripsi: "Cashback 7% (maks. Rp 10.000) untuk belanja di kios pasar tradisional",
    biaya: 400,
    kuota: 12,
    berlakuSampai: "2026-11-30",
    judulKupon: "Cashback 7% Maks Rp 10.000",
    syaratKupon: "Min. Belanja Rp 60.000",
    rincianKupon: { kiri: "Penerimaan Cashback", kanan: "Saldo atau Voucher" },
  },
];
