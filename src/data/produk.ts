import { DefinisiField } from "@/data/formalamat";
import { OpsiPotongan, Produk } from "@/types/produk";

/**
 * Katalog produk (data contoh). Nanti diganti data dari API.
 * Gambar sementara: satu gambar yang sama untuk semua produk (.svg, .jpg, atau .png).
 */
const FOTO_AYAM = require("../../assets/images/produk/ayam.svg");

// Tombol jumlah cepat bila produk tidak menentukan sendiri
export const PILIHAN_JUMLAH_BAWAAN = [1, 5, 10];

export const OPSI_POTONGAN_AYAM: OpsiPotongan[] = [
  {
    id: "utuhan",
    judul: "Utuhan",
    deskripsi: "Cocok untuk tumpeng / sop utuh kaldu kental",
    ikon: "egg-outline",
    warna: "hijau",
  },
  {
    id: "bekakak",
    judul: "Bekakak",
    deskripsi: "Dada dibelah melebar, pas bumbu bakar meresap",
    ikon: "flame",
    warna: "cokelat",
  },
  {
    id: "potong-4",
    judul: "Potong 4",
    deskripsi: "2 Dada & 2 Paha porsi resto / ayam goreng gurih",
    ikon: "restaurant",
    warna: "hijau",
  },
  {
    id: "potong-8",
    judul: "Potong 8",
    deskripsi: "Standar menu lauk harian bunda keluarga",
    ikon: "people",
    warna: "hijau",
  },
  {
    id: "potong-10",
    judul: "Potong 10",
    deskripsi: "Ideal nasi box syukuran / arisan hemat",
    ikon: "sparkles",
    warna: "hijau",
  },
  {
    id: "potong-12",
    judul: "Potong 12",
    deskripsi: "Porsi warung nasi rames, soto, & katering",
    ikon: "storefront",
    warna: "cokelat",
  },
];

// Tombol saran di "Catatan Khusus Pemotong": ketuk untuk menambahkan ke catatan
export const SARAN_CATATAN = ["+ Tanpa kepala", "+ Ceker dibuang", "+ Potong kecil-kecil"];

export const FIELD_JUMLAH_CUSTOM: DefinisiField = {
  label: "Jumlah",
  placeholder: "Contoh: 7",
  keyboardType: "number-pad",
  maxLength: 3,
};

export const DAFTAR_PRODUK: Produk[] = [
  {
    id: "ayam-bakar",
    nama: "Ayam Broiler Ukuran Ayam Bakar",
    harga: 39000,
    satuan: "ekor",
    toko: "Pak Joko Daging",
    gambar: FOTO_AYAM,
    ringkas: ["Berat Hidup 1,0 - 1,1 Kg", "Berat Bersih 700 - 800 Gr"],
    deskripsi:
      "Ayam Broiler Ayam Bakar\n\nBerat Hidup 1,0 - 1,1 Kg\nBerat Bersih 700 - 800 Gr\n\nBukan ayam frozen/karkas. Dipotong dadakan sesuai syariat, tanpa bahan pengawet. Lengkap kepala, ceker, dan ati ampela.",
    stok: 48,
    opsiPotongan: OPSI_POTONGAN_AYAM,
    potonganBawaan: "potong-4",
  },
  {
    id: "ayam-kfc",
    nama: "Ayam Broiler Ukuran KFC",
    harga: 51000,
    satuan: "ekor",
    toko: "Pak Joko Daging",
    gambar: FOTO_AYAM,
    // contoh: berat dan stok perlu disesuaikan dengan data asli
    ringkas: ["Berat Hidup 1,4 - 1,5 Kg", "Berat Bersih 1,0 - 1,1 Kg"],
    deskripsi:
      "Ayam Broiler Ukuran KFC\n\nBerat Hidup 1,4 - 1,5 Kg\nBerat Bersih 1,0 - 1,1 Kg\n\nBukan ayam frozen/karkas. Dipotong dadakan sesuai syariat, tanpa bahan pengawet. Pas untuk digoreng tepung ala fried chicken.",
    stok: 36,
    opsiPotongan: OPSI_POTONGAN_AYAM,
    potonganBawaan: "potong-8",
  },
  {
    id: "ayam-potong-8",
    nama: "Ayam Broiler Ukuran Potong 8",
    harga: 45000,
    satuan: "ekor",
    toko: "Pak Joko Daging",
    gambar: FOTO_AYAM,
    // contoh: data karangan, sesuaikan dengan data asli
    ringkas: ["Berat Hidup 1,2 - 1,3 Kg", "Berat Bersih 850 - 950 Gr"],
    deskripsi:
      "Ayam Broiler Ukuran Potong 8\n\nBerat Hidup 1,2 - 1,3 Kg\nBerat Bersih 850 - 950 Gr\n\nAyam segar yang praktis untuk berbagai masakan harian keluarga.",
    stok: 40,
    opsiPotongan: OPSI_POTONGAN_AYAM,
    potonganBawaan: "potong-8",
  },
  {
    id: "ayam-jumbo",
    nama: "Ayam Broiler Ukuran Jumbo",
    harga: 62000,
    satuan: "ekor",
    toko: "Pak Joko Daging",
    gambar: FOTO_AYAM,
    // contoh: data karangan, sesuaikan dengan data asli
    ringkas: ["Berat Hidup 1,8 - 2,0 Kg", "Berat Bersih 1,3 - 1,5 Kg"],
    deskripsi:
      "Ayam Broiler Ukuran Jumbo\n\nBerat Hidup 1,8 - 2,0 Kg\nBerat Bersih 1,3 - 1,5 Kg\n\nUkuran besar, cocok untuk acara atau katering.",
    stok: 20,
    opsiPotongan: OPSI_POTONGAN_AYAM,
    potonganBawaan: "potong-12",
  },
];