import { ImageSourcePropType } from "react-native";
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
  gambar?: ImageSourcePropType;   // require(...) atau { uri: "https://..." }; kosong -> placeholder
  ringkas?: string[];             // baris keterangan singkat di bawah nama
  deskripsi?: string;
  stok?: number;
  pilihanJumlah?: number[];       // tombol jumlah cepat (selain "Custom")
  opsiPotongan?: OpsiPotongan[];  // bila ada: tampilkan "Request Potongan" dan "Catatan Pemotong"
  potonganBawaan?: string;        // id opsi yang terpilih di awal
};
