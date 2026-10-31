import { ChipItem } from "@/components/ui/chipgroup";
import {
  KategoriNotifikasi,
  Notifikasi,
} from "@/types/notifikasi";

export const FILTER_SEMUA = "semua";

export type IdFilterNotifikasi =
  | typeof FILTER_SEMUA
  | KategoriNotifikasi;

export const FILTER_NOTIFIKASI: readonly (
  ChipItem & { id: IdFilterNotifikasi }
)[] = [
  {
    id: "semua",
    label: "Semua",
  },
  {
    id: "pesanan",
    label: "Pesanan",
    icon: "bicycle-outline",
  },
  {
    id: "promo",
    label: "Promo & Diskon",
    icon: "pricetag-outline",
  },
  {
    id: "toko",
    label: "Info Toko",
    icon: "storefront-outline",
  },
];

const menitLalu = (m: number) =>
  new Date(
    Date.now() - m * 60000
  ).toISOString();

export const notifikasiContoh: Notifikasi[] = [
  {
    id: "n1",
    kategori: "pesanan",
    nada: "hijau",
    label: "Pesanan #SM-04028",
    waktu: menitLalu(15),
    judul: "Kurir Sedang Menuju Rumah Anda!",
    isi: "Pesanan 2 Ayam Broiler Ukuran Ayam Bakar, Potong 4 Sedang diantar kurir. Estimasi tiba 05.45 WIB.",
  },

  {
    id: "n2",
    kategori: "pesanan",
    nada: "coklat",
    label: "Pemotongan Selesai",
    waktu: menitLalu(75),
    judul: "Ayam Pesanan Anda Telah Dipotong",
    isi: "Pesanan Anda sudah selesai ditimbang dan siap diantar.",
    produk: {
      nama: "Ayam Broiler Ukuran Ayam Bakar",
      timbangan: "1.98 kg",
      ringkasan: "2 Ekor Utuh (Potong 8)",
    },
  },

  {
    id: "n3",
    kategori: "promo",
    nada: "coklat",
    label: "Promo Kilat Subuh",
    waktu: menitLalu(135),
    judul:
      "Flash Sale BOCIN: Diskon Rp 10.000/kg Hari Ini!",
    isi: "Gunakan kupon voucher BOCINAPP untuk potongan ayam broiler & gratis ongkir pengantaran subuh Pasar Alfa Indah. Kuota sisa 18 dari 50 pemesan!",
    kode: "BOCINAPP",
    aksi: {
      label: "Klaim Voucher Sekarang",
      icon: "ticket-outline",
    },
  },

  {
    id: "n4",
    kategori: "toko",
    nada: "hijau",
    label: "Info Toko",
    waktu: menitLalu(60 * 26),
    judul: "Stok Ayam Potong Sudah Tersedia",
    isi: "Pak Joko Daging sudah buka. Pesan sebelum pukul 10.00 WIB agar diantar pagi ini.",
  },

  {
    id: "n5",
    kategori: "pesanan",
    nada: "hijau",
    label: "Pembayaran Berhasil",
    waktu: menitLalu(60 * 24 * 9),
    judul:
      "Pembayaran BCA Virtual Account Rp 121.500 Diterima",
    isi: "Transaksi tagihan #SM-04028 lunas. Pesanan Anda segera kami proses.",
  },
];