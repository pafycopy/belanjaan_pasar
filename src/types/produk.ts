import { ImageSource } from "expo-image";
import { IconName } from "@/types/ui";

// Pilihan potongan gratis (khusus produk yang bisa dipotong, mis. ayam)
export type OpsiPotongan = {
  id: string;
  judul: string;
  deskripsi: string;
  ikon: IconName;
  warna: "hijau" | "cokelat"; // warna ikon saat belum dipilih
};

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
  beratBersihGram?: number;       // estimasi berat bersih per satuan, untuk kapasitas keranjang
  pilihanJumlah?: number[];       // tombol jumlah cepat (selain "Custom")
  opsiPotongan?: OpsiPotongan[];  // bila ada: tampilkan "Request Potongan" dan "Catatan Pemotong"
  potonganBawaan?: string;        // id opsi yang terpilih di awal
};
