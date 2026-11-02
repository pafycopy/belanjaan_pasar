export type NadaTag = "hijau" | "peach";

// Voucher yang tersedia di katalog (nanti dari API)
export type Voucher = {
  id: string;
  tag: string;               // chip kecil, contoh: "Potongan Rp 10.000"
  nadaTag: NadaTag;
  kategori?: string;         // teks abu di samping chip, contoh: "Halal MUI"
  judul: string;
  deskripsi: string;
  biaya: number;             // harga dalam poin
  berlakuSampai?: string;    // "YYYY-MM-DD"
  catatan?: string;          // info kecil di footer bila tidak ada tanggal berlaku
  populer?: boolean;         // tampilkan pita "Paling Populer"

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
