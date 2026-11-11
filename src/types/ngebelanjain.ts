import { IdPengiriman } from "@/data/keranjang";

// Tahapan pesanan Ngebelanjain. Perpindahan antar tahap dilakukan admin (nanti lewat server).
export type StatusNgebelanjain = "diproses" | "dibelanjain" | "pembayaran" | "dibayar";

export type MetodeNgebelanjain = "qris" | "cod";

// Diisi admin setelah semua barang selesai dibelanjakan dan ditimbang
export type TagihanNgebelanjain = {
  totalProduk: number;
  jasaHelper: number;
  ongkir: number;
  total: number;
};

export type PesananNgebelanjain = {
  nomor: string;              // tanpa "#", mis. "BP-1"
  status: StatusNgebelanjain;
  daftar: string;             // teks daftar belanja apa adanya dari pelanggan (satu barang per baris)
  pengiriman: IdPengiriman;
  alamat?: string;            // alamat lengkap (hanya bila diantar)
  dibuatPada: number;         // ms
  estimasiSelesai?: string;   // mis. "06.15 WIB", terisi saat dibelanjain
  tagihan?: TagihanNgebelanjain; // terisi saat pembayaran tersedia
  metode?: MetodeNgebelanjain;   // terisi saat pelanggan memilih cara bayar
  batasBayar?: number;        // ms, batas bayar QRIS
  dibayarPada?: number;       // ms
};
