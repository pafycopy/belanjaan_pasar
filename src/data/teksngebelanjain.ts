// Teks fitur Ngebelanjain (titip belanja pasar). Boleh digabung ke TEKS di teks.ts bila mau.
export const TEKS_NGEBELANJAIN = {
  judul: "Ngebelanjain",
  pesananSaya: "Pesanan Saya",
  kosongJudul: "Belum ada pesanan Ngebelanjain.",
  kosongPesan: "Yuk, titip kebutuhan belanja pasar dan biar kami yang belanjain!",
  mulai: "Mulai Ngebelanjain",

  noPesanan: (no: string) => `No. Pesanan: #${no}`,
  pesananAnda: "Pesanan Anda",
  badge: { diproses: "Pesanan Diterima", dibelanjain: "Sedang Dibelanjain" },
  dipesanPukul: "Dipesan pukul",
  estimasiSelesai: "Estimasi Selesai",
  chatWa: "Chat via WhatsApp",
  chatWaPesan: (no: string) => `Halo, saya ingin menanyakan pesanan Ngebelanjain #${no}.`,
  waBelumDiatur: {
    judul: "WhatsApp belum diatur",
    pesan: "Nomor WhatsApp admin belum diisi (NOMOR_WA_NGEBELANJAIN di data/ngebelanjain.ts).",
  },
  waGagal: { judul: "Tidak bisa membuka WhatsApp", pesan: "Pastikan WhatsApp terpasang di HP Anda." },
  gagal: { judul: "Terjadi kesalahan", pesan: "Perubahan belum tersimpan. Coba lagi." },

  metode: { judul: "Metode Pembayaran", bayar: "Bayar Sekarang" },

  menunggu: {
    judul: "Menunggu Pembayaran",
    kembali: "Kembali pilih metode pembayaran",
    batas: "Batas waktu pembayaran",
    menit: (waktu: string) => `${waktu} MENIT`,
    cod: "Bayar di Tempat (COD)",
    rincian: "Rincian",
    nominal: "Nominal",
    totalProduk: "Total Produk",
    jasaHelper: "Jasa Helper",
    ongkir: "Ongkir",
    totalBayar: "Total Pembayaran:",
    qrisKosong: "Gambar QRIS belum dipasang",
    qrisKet: "Scan QRIS di atas untuk membayar",
    codKet: (total: string) => `Bayar tunai ke kurir saat pesanan sampai. Siapkan uang sebesar ${total}.`,
    habis: "Waktu pembayaran habis. Kembali untuk memilih metode pembayaran lagi.",
  },

  dibayar: {
    chip: "Pembayaran Berhasil!",
    nomor: "Nomor Pesanan",
    ringkasan: "Ringkasan Pesanan",
    produk: (n: number) => `${n} produk`,
    metode: "Metode Pembayaran",
    waktu: "Waktu Pembayaran",
    totalDibayar: "Total Dibayar",
    lunas: "LUNAS",
    catatan: "Pembayaran sudah diterima. Pesanan akan segera disiapkan untuk proses pengantaran.",
    detail: "Lihat Detail Pengantaran",
    segera: { judul: "Segera hadir", pesan: "Detail pengantaran Ngebelanjain belum tersedia." },
  },

  daftar: {
    judul: "Daftar Ngebelanjain",
    hapus: "Hapus Daftar",
    label: "Mau dibelanjain apa dari pasar?",
    placeholder: "Masukkan nama produk, jumlah, dan satuan.\nContoh: Cabai rawit merah - 500 gram",
    catatan: "Total tagihan final akan tersedia setelah barang selesai dibelanjakan dan ditimbang.",
    kirim: "Kirim Permintaan Belanja",
    kosong: { judul: "Daftar belanja masih kosong", pesan: "Tulis barang yang mau dibelanjain, satu barang per baris." },
  },

  // Hanya mode pengembangan: simulasi tugas admin memindahkan pesanan ke tahap berikutnya
  dev: (no: string) => `DEV: majukan status #${no} (tugas admin)`,
} as const;
