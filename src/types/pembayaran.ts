import { IdMetode, IdPengiriman } from "@/data/keranjang";

// Satu baris produk pada tagihan (salinan saat tagihan dibuat, jadi tidak berubah walau keranjang berubah)
export type BarisTagihan = {
  produkId: string;
  nama: string;
  jumlah: number;
  hargaSatuan: number;
  potongan?: string; // judul pilihan potongan, mis. "Potong 4"
};

// Tagihan transfer manual yang sedang menunggu dibayar.
// Nanti dibuat oleh server (bersama nomor VA / QRIS dinamis); bentuknya sengaja sudah mirip.
export type TagihanTransfer = {
  invoice: string;        // tanpa "#", mis. "SM-04028"
  metode: IdMetode;
  dibuatPada: number;     // ms
  batasBayar: number;     // ms, batas akhir transfer
  baris: BarisTagihan[];
  pengiriman: IdPengiriman;
  alamat?: string;        // alamat lengkap (hanya bila diantar)
  subtotal: number;
  ongkir: number | null;  // null = ambil di toko
  labelOngkir?: string;   // mis. "Radius 1\u20133 km"
  total: number;
};
