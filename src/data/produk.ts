import { ChipItem } from "@/components/ui/chipgroup";
import { DefinisiField } from "@/data/formalamat";
import { Produk } from "@/types/produk";

/**
 * Katalog produk (data contoh). Nanti diganti data dari API.
 * Gambar sementara: satu gambar yang sama untuk semua produk (.svg, .jpg, atau .png).
 */
// Satuan bila produk tidak menentukan sendiri
export const SATUAN_BAWAAN = "pcs";

const FOTO_AYAM = require("../../assets/images/produk/ayam.svg");

// Tombol jumlah cepat bila produk tidak menentukan sendiri
export const PILIHAN_JUMLAH_BAWAAN = [1, 5, 10];

export const FIELD_JUMLAH_CUSTOM: DefinisiField = {
  label: "Jumlah",
  placeholder: "Contoh: 7",
  keyboardType: "number-pad",
  maxLength: 3,
};

export const KATEGORI_PRODUK_SEMUA = "semua";

// Chip kategori di halaman Produk. `id` selain "semua" dicocokkan dengan Produk.tag
export const KATEGORI_PRODUK: readonly ChipItem[] = [
  { id: KATEGORI_PRODUK_SEMUA, label: "Semua" },
  { id: "ayam-bebek", label: "Ayam & Bebek Potong" },
  { id: "daging-tanpa-tulang", label: "Daging Tanpa Tulang" },
  { id: "sembako", label: "Sembako" },
  { id: "daging-sapi", label: "Daging Sapi Segar" },
  { id: "bumbu", label: "Bumbu" },
  { id: "sayuran", label: "Sayuran Segar" },
  { id: "telur", label: "Telur Segar" },
  { id: "ikan", label: "Ikan Segar" },
];

export const DAFTAR_PRODUK: Produk[] = [
  {
    id: "ayam-bakar",
    tag: ["ayam-bebek"],
    nama: "Ayam Broiler Ukuran Ayam Bakar",
    varian: ["1 Ekor", "2 Ekor", "3 Ekor", "4 Ekor", "5 Ekor"],
    pilihanJumlah: [1, 2, 3, 4, 5],
    harga: 39000,
    hargaCoret: 49000,
    satuan: "ekor",
    toko: "Taman Alfa",
    gambar: FOTO_AYAM,
    ringkas: ["Berat Hidup 1,0 - 1,1 Kg", "Berat Bersih 700 - 800 Gr"],
    beratBersihGram: 750,
    deskripsi:
      "Ayam Broiler Ayam Bakar\n\nBerat Hidup 1,0 - 1,1 Kg\nBerat Bersih 700 - 800 Gr\n\nBukan ayam frozen/karkas. Dipotong dadakan sesuai syariat, tanpa bahan pengawet. Lengkap kepala, ceker, dan ati ampela.",
    stok: 48,
  },
  {
    id: "ayam-kfc",
    tag: ["ayam-bebek"],
    nama: "Ayam Broiler Ukuran KFC",
    varian: ["1 Ekor", "2 Ekor", "3 Ekor", "4 Ekor", "5 Ekor"],
    pilihanJumlah: [1, 2, 3, 4, 5],
    harga: 51000,
    satuan: "ekor",
    toko: "Taman Alfa",
    gambar: FOTO_AYAM,
    ringkas: ["Berat Hidup 1,4 - 1,5 Kg", "Berat Bersih 1,0 - 1,1 Kg"],
    beratBersihGram: 1050,
    deskripsi:
      "Ayam Broiler Ukuran KFC\n\nBerat Hidup 1,4 - 1,5 Kg\nBerat Bersih 1,0 - 1,1 Kg\n\nBukan ayam frozen/karkas. Dipotong dadakan sesuai syariat, tanpa bahan pengawet. Pas untuk digoreng tepung ala fried chicken.",
    stok: 36,
  },
  {
    id: "ayam-potong-8",
    tag: ["ayam-bebek", "partingan"],
    nama: "Ayam Broiler Ukuran Potong 8",
    varian: ["1 Ekor", "2 Ekor", "3 Ekor", "4 Ekor", "5 Ekor"],
    pilihanJumlah: [1, 2, 3, 4, 5],
    harga: 45000,
    hargaCoret: 52000,
    satuan: "ekor",
    toko: "Taman Alfa",
    gambar: FOTO_AYAM,
    ringkas: ["Berat Hidup 1,2 - 1,3 Kg", "Berat Bersih 850 - 950 Gr"],
    beratBersihGram: 900,
    deskripsi:
      "Ayam Broiler Ukuran Potong 8\n\nBerat Hidup 1,2 - 1,3 Kg\nBerat Bersih 850 - 950 Gr\n\nAyam segar yang praktis untuk berbagai masakan harian keluarga.",
    stok: 40,
  },
  {
    id: "ayam-jumbo",
    tag: ["ayam-bebek"],
    nama: "Ayam Broiler Ukuran Jumbo",
    varian: ["1 Ekor", "2 Ekor", "3 Ekor", "4 Ekor", "5 Ekor"],
    pilihanJumlah: [1, 2, 3, 4, 5],
    harga: 62000,
    satuan: "ekor",
    toko: "Taman Alfa",
    gambar: FOTO_AYAM,
    ringkas: ["Berat Hidup 1,8 - 2,0 Kg", "Berat Bersih 1,3 - 1,5 Kg"],
    beratBersihGram: 1400,
    deskripsi:
      "Ayam Broiler Ukuran Jumbo\n\nBerat Hidup 1,8 - 2,0 Kg\nBerat Bersih 1,3 - 1,5 Kg\n\nUkuran besar, cocok untuk acara atau katering.",
    stok: 20,
  },
  // ---- Data contoh untuk kategori lain (hapus / ganti saat data dari API siap) ----
  {
    id: "fillet-dada",
    tag: ["daging-tanpa-tulang"],
    nama: "Fillet Dada Ayam Tanpa Tulang",
    harga: 58000,
    satuan: "kg",
    toko: "Taman Alfa",
    gambar: FOTO_AYAM,
    ringkas: ["Tanpa tulang dan kulit", "Dipotong dadakan"],
    beratBersihGram: 1000,
    deskripsi: "Fillet dada ayam segar tanpa tulang dan kulit, praktis untuk berbagai olahan.",
    stok: 25,
  },
  {
    id: "beras-premium",
    tag: ["sembako"],
    nama: "Beras Premium 5 Kg",
    harga: 72000,
    satuan: "karung",
    toko: "Taman Alfa",
    gambar: FOTO_AYAM,
    ringkas: ["Pulen dan wangi", "Kemasan 5 Kg"],
    beratBersihGram: 5000,
    deskripsi: "Beras premium pulen dan wangi, kemasan 5 Kg.",
    stok: 30,
  },
  {
    id: "daging-sapi-has",
    tag: ["daging-sapi"],
    nama: "Daging Sapi Has Dalam",
    harga: 135000,
    satuan: "kg",
    toko: "Taman Alfa",
    gambar: FOTO_AYAM,
    ringkas: ["Segar, tanpa lemak berlebih"],
    beratBersihGram: 1000,
    deskripsi: "Daging sapi has dalam segar, empuk untuk steak dan tumisan.",
    stok: 15,
  },
  {
    id: "bawang-merah",
    tag: ["bumbu"],
    nama: "Bawang Merah Segar",
    harga: 38000,
    satuan: "kg",
    toko: "Taman Alfa",
    gambar: FOTO_AYAM,
    ringkas: ["Pilihan, ukuran sedang"],
    beratBersihGram: 1000,
    deskripsi: "Bawang merah segar pilihan ukuran sedang.",
    stok: 40,
  },
  {
    id: "bayam-segar",
    tag: ["sayuran"],
    nama: "Bayam Segar",
    harga: 5000,
    satuan: "ikat",
    toko: "Taman Alfa",
    gambar: FOTO_AYAM,
    ringkas: ["Dipetik pagi hari"],
    beratBersihGram: 250,
    deskripsi: "Bayam hijau segar, dipetik pagi hari.",
    stok: 60,
  },
  {
    id: "telur-ayam",
    tag: ["telur"],
    nama: "Telur Ayam Negeri",
    harga: 29000,
    satuan: "kg",
    toko: "Taman Alfa",
    gambar: FOTO_AYAM,
    ringkas: ["Segar, kulit bersih"],
    beratBersihGram: 1000,
    deskripsi: "Telur ayam negeri segar dengan kulit bersih.",
    stok: 50,
  },
  {
    id: "ikan-lele",
    tag: ["ikan"],
    nama: "Ikan Lele Segar",
    harga: 28000,
    satuan: "kg",
    toko: "Taman Alfa",
    gambar: FOTO_AYAM,
    ringkas: ["Hidup, dibersihkan sesuai permintaan"],
    beratBersihGram: 1000,
    deskripsi: "Ikan lele segar, bisa dibersihkan sesuai permintaan.",
    stok: 35,
  },
];
