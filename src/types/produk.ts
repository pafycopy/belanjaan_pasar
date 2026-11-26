import { ImageSource } from "expo-image";

export type Produk = {
  id: string;
  nama: string;
  harga: number;                  // Rupiah per satuan
  satuan?: string;                // ekor, kg, ikat, ...
  toko?: string;
  gambar?: ImageSource | number;  // require(...) untuk .jpg/.png/.svg, atau { uri: "https://..." }
  ringkas?: string[];             // baris keterangan singkat di bawah nama
  deskripsi?: string;
  stok?: number;
  hargaCoret?: number;            // harga normal sebelum promo; bila lebih besar dari `harga`, produk tampil sebagai promo
  rating?: number;                // 0 - 5, mis. 4.9
  jumlahUlasan?: number;          // jumlah ulasan produk, bila tersedia
  varian?: string[];              // teks varian yang ditampilkan di bawah nama produk
  tag?: string[];                 // penanda untuk filter, mis. "promo", "ayam-bebek", "partingan"
  beratBersihGram?: number;       // estimasi berat bersih per satuan, untuk kapasitas keranjang
  pilihanJumlah?: number[];       // tombol jumlah cepat (selain "Custom")
};
