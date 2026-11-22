// Hanya dua jenis voucher: potongan belanja dan gratis ongkir
export type JenisVoucher = "potongan" | "ongkir";

// Voucher yang tersedia di katalog (nanti dari API)
export type Voucher = {
  id: string;
  jenis: JenisVoucher;       // menentukan chip kecil di pojok kiri kartu
  judul: string;
  deskripsi: string;
  biaya: number;             // harga dalam poin
  berlakuSampai: string;     // "YYYY-MM-DD" (WIB). Lewat tanggal ini voucher hilang dari daftar tukar
  populer?: boolean;         // tampilkan pita "Paling Populer"
  kuota: number;             // sisa kuota; 0 = habis

  // Tampilan kupon di "Voucher Saya"
  judulKupon?: string;                          // judul singkat (kalau beda dari `judul`)
  syaratKupon?: string;                         // contoh: "Min. Belanja Rp 60.000"
  rincianKupon?: { kiri: string; kanan: string }; // baris info tambahan, contoh cashback
};

// Voucher yang sudah ditukar pengguna
export type VoucherMilik = {
  uid: string;               // id unik kepemilikan (satu voucher boleh ditukar berkali-kali)
  voucherId: string;
  ditukarPada: string;       // ISO 8601
  dipakaiPada?: string;      // ISO 8601; terisi saat voucher dipakai di pesanan
};

export type StatusMilik = "aktif" | "terpakai" | "kedaluwarsa";

export type HasilTukar = "berhasil" | "poinKurang" | "kedaluwarsa" | "tidakAda";
