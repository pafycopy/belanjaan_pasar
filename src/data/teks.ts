// Seluruh teks (copy) fitur alamat di satu tempat: mudah diubah dan siap untuk multi-bahasa nanti.
export const TEKS = {
  hapus: "Hapus",
  batal: "Batal",
  gunakan: "Gunakan",
  dipakai: "Dipakai",
  kelola: "Kelola",
  selesai: "Selesai",
  opsional: "Opsional",
  alamatTidakDitemukan: "Alamat tidak ditemukan.",

  header: { memuat: "Memuat alamat...", kosong: "Pilih alamat pengantaran" },

  dialogHapus: {
    judul: "Hapus alamat ini?",
    pesan:
      "Alamat yang dipilih akan dihapus dari daftar alamat Anda. Tindakan ini tidak dapat dibatalkan.",
  },

  daftar: {
    cariPlaceholder: "Cari lokasi yang kamu tuju",
    pilihTitik: "Pilih Titik di Peta",
    lokasiSaya: "Lokasi Saya saat ini",
    tambahBaru: "Tambah Alamat Baru",
    judulTersimpan: (jumlah: number) => `Alamat Tersimpan Lainnya (${jumlah})`,
    kosong: "Belum ada alamat tersimpan. Pilih titik di peta untuk menambahkan alamat pertamamu.",
  },

  pinpoint: {
    petunjuk: "Geser peta untuk menentukan titik pengantaran",
    konfirmasi: "Konfirmasi Lokasi",
  },

  detail: {
    labelKategori: "Kategori / Label Alamat",
    labelWilayah: "Kecamatan & Kelurahan",
    pilihWilayah: "Pilih kecamatan & kelurahan",
    simpanSheet: "Simpan",
    simpan: "Simpan Alamat Pengantaran",
    titikBelumDipilih: "Titik lokasi belum dipilih. Kembali dan pilih titik di peta.",
  },

  peringatan: {
    lokasiTidakDitemukan: {
      judul: "Lokasi tidak ditemukan",
      pesan: "Coba kata kunci lain, atau pilih titik langsung di peta.",
    },
    lokasiTidakTersedia: {
      judul: "Lokasi tidak tersedia",
      pesan: "Izinkan akses lokasi di pengaturan HP, atau geser peta secara manual.",
    },
    gagalSimpan: { judul: "Gagal menyimpan", pesan: "Terjadi kesalahan, coba lagi." },
  },
} as const;
