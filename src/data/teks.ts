export const TEKS = {
  ya: "Ya",
  hapus: "Hapus",
  batal: "Batal",
  gunakan: "Gunakan",
  dipakai: "Dipakai",
  kelola: "Kelola",
  selesai: "Selesai",
  opsional: "Opsional",
  alamatTidakDitemukan: "Alamat tidak ditemukan.",

  header: {
    memuat: "Memuat alamat...",
    kosong: "Pilih alamat pengantaran",
  },

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
    judulTersimpan: (jumlah: number) =>
      `Alamat Tersimpan Lainnya (${jumlah})`,
    kosong:
      "Belum ada alamat tersimpan. Pilih titik di peta untuk menambahkan alamat pertamamu.",
  },

  pinpoint: {
    petunjuk:
      "Geser peta untuk menentukan titik pengantaran",
    konfirmasi: "Konfirmasi Lokasi",
  },

  detail: {
    labelKategori: "Kategori / Label Alamat",
    labelWilayah: "Kecamatan & Kelurahan",
    pilihWilayah: "Pilih kecamatan & kelurahan",
    simpanSheet: "Simpan",
    simpan: "Simpan Alamat Pengantaran",
    titikBelumDipilih:
      "Titik lokasi belum dipilih. Kembali dan pilih titik di peta.",
  },

  notifikasi: {
    judul: "Notifikasi",
    terbaru: "Update Terbaru",
    kosong: "Belum ada notifikasi di kategori ini.",
    timbanganBersih: "Timbangan Bersih:",
    voucherDiklaim: (kode: string) =>
      `Kode voucher ${kode} siap dipakai saat checkout.`,
    judulVoucher: "Voucher",
  },

  poin: {
    judul: "Poin",
    totalLabel: "TOTAL POIN ANDA",
    satuan: "Poin",
    akunAktif: "Akun Aktif",
    tukar: "Tukar Poin",
    riwayat: "Riwayat Poin",
    segera: { judul: "Segera hadir", pesan: "Fitur ini sedang disiapkan." },
    klaim: {
      judul: "Klaim Harian",
      deskripsi: (mulai: string, selesai: string) =>
        `Buka aplikasi tiap subuh (${mulai} - ${selesai} WIB) untuk kumpulkan bonus poin belanja`,
      hari: (n: number) => `Hari ${n}`,
      tambahPoin: (n: number) => `+${n} Poin`,
      hariIni: "Hari Ini!",
      superBonus: "Super Bonus",
      voucher: "Voucher",
      tombol: {
        bisa: "Klaim Sekarang",
        sudah: "Sudah Diklaim Hari Ini",
        sebelum: (jam: string) => `Klaim Dibuka ${jam} WIB`,
        terlewat: "Klaim Hari Ini Terlewat",
      },
      hitungMundur: {
        sisa: "Sisa waktu klaim hari ini:",
        dibuka: "Klaim dibuka dalam:",
        berikutnya: "Klaim berikutnya dalam:",
      },
      berhasil: {
        judul: "Klaim Berhasil",
        pesan: (poin: number) => `+${poin} Poin sudah masuk ke akunmu.`,
        siklusSelesai: "Siklus 7 hari selesai. Klaim berikutnya mulai lagi dari Hari 1.",
      },
      gagal: { judul: "Gagal klaim", pesan: "Terjadi kesalahan, coba lagi." },
    },
    statusHari: {
      terklaim: "Terklaim",
      siap: "Siap Klaim",
      menunggu: "Menunggu Subuh",
      terlewat: "Terlewat",
      besok: "Besok Subuh",
      terkunci: "Terkunci",
    },
  },

  voucher: {
    judul: "Voucher",
    member: (tingkat: string) => `MEMBER ${tingkat.toUpperCase()}`,
    poinAnda: "Poin Anda",
    satuan: "Pts",
    ajakTukar: "Tukarkan poin belanja Anda.",
    riwayatPoin: "Riwayat Poin",
    klaimHarian: "Klaim Harian",
    tab: { tukar: "Tukar Voucher", saya: "Voucher Saya" },
    populer: "Paling Populer",
    berlaku: (tanggal: string) => `Berlaku s/d ${tanggal}`,
    biaya: (n: string) => `Biaya: ${n} Pts`,
    tombolTukar: (n: string) => `Tukar ${n} Pts`,
    kedaluwarsa: "Kedaluwarsa",
    konfirmasi: {
      judul: "Tukar voucher?",
      pesan: (nama: string, biaya: string) => `${nama}\nPoinmu akan berkurang ${biaya} Pts.`,
      batal: "Batal",
      ya: "Tukar",
    },
    berhasil: {
      judul: "Penukaran Berhasil",
      pesan: (nama: string) => `${nama} sudah masuk ke Voucher Saya.`,
      nanti: "Nanti",
      lihat: "Lihat Voucher",
    },
    gagal: {
      poinKurang: (kurang: string) => ({
        judul: "Poin belum cukup",
        pesan: `Kamu butuh ${kurang} Pts lagi. Kumpulkan lewat Klaim Harian.`,
      }),
      kedaluwarsa: { judul: "Voucher berakhir", pesan: "Voucher ini sudah tidak berlaku." },
      umum: { judul: "Gagal menukar", pesan: "Terjadi kesalahan, coba lagi." },
    },
    milik: {
      kosong: "Belum ada voucher. Tukarkan poinmu di tab Tukar Voucher.",
      kosongFilter: "Tidak ada voucher di kategori ini.",
      filter: { aktif: "Dapat Digunakan", terpakai: "Terpakai", kedaluwarsa: "Kedaluwarsa" },
      pakai: "Pakai",
      terpakai: "Terpakai",
      berakhir: "Berakhir",
      sudahDipakai: "Sudah dipakai",
      berakhirPada: (tanggal: string) => `Berakhir ${tanggal}`,
      caraPakai: {
        judul: "Pakai voucher",
        pesan: "Pilih voucher ini saat checkout untuk memakainya.",
        tutup: "Tutup",
        belanja: "Mulai Belanja",
      },
    },
    syarat: {
      judul: "Syarat & Ketentuan Penggunaan",
      daftar: [
        "Voucher hanya berlaku untuk pembelian lewat aplikasi.",
        "Satu voucher untuk satu pesanan.",
        "Voucher tidak dapat diuangkan atau dipindahtangankan.",
        "Voucher yang sudah kedaluwarsa tidak dapat digunakan lagi.",
        "Poin yang sudah ditukar tidak dapat dikembalikan.",
      ],
    },
  },

  beranda: {
    cari: "Cari ayam, bebek, ati ampela...",
  },

  katalog: {
    judul: "Produk",
    cari: "Cari ayam, bebek, ati ampela...",
    favoritJudul: "Produk Favorit Anda",
    lihatSemua: "Lihat Semua",
    promoJudul: "Promo Hari Ini",
    promoSampai: (jam: string) => `s/d ${jam.replace(":", ".")} WIB`,
    kosong: "Produk tidak ditemukan. Coba ubah kata pencarian atau kategori.",
    keranjangAksesibilitas: "Buka keranjang",
    tambahAksesibilitas: (nama: string) => `Tambah ${nama} ke keranjang`,
  },

  keranjang: {
    judul: "Keranjang",
    pesananSaya: "Pesanan Saya",
    jumlahProduk: (jumlah: number) => `${jumlah} Produk`,
    produkSegar: "Produk segar",
    kosong: {
      judul: "Belum Ada Pesanan",
      rekomendasi: "Pilihan Belanjaan Pasar saat ini",
    },
    kapasitas: {
      judul: "Kapasitas Berat Bersih",
      tersedia: "kapasitas tersedia",
      penuh: "kapasitas penuh",
      terpakai: (berat: string) => `${berat} kg`,
      maks: (kapasitas: number) => `/ ${kapasitas} kg`,
      sisa: (sisa: string) => `Sisa ${sisa} kg`,
    },
    pengiriman: "Opsi Pengiriman",
    alamat: {
      judul: "Alamat Pengantaran",
      ubah: "Ubah Alamat",
      judulKartu: (sebutan: string) => `Alamat ${sebutan}`,
      utama: "Utama",
      patokan: (teks: string) => `Patokan: ${teks}`,
      kosongJudul: "Belum ada alamat",
      kosongPesan: "Pilih atau tambah alamat pengantaran",
    },
    pembayaran: { judul: "Pilih Pembayaran" },
    rincian: {
      judul: "Ringkasan Pembayaran",
      pesanan: "Total Pesanan",
      ongkir: (label: string) => `Ongkir Kurir (${label})`,
      total: "Total Tagihan",
    },
    ringkasan: { total: "Total Akhir", bayar: "Bayar" },
    alamatBelumDipilih: {
      judul: "Alamat belum dipilih",
      pesan: "Pilih alamat pengantaran terlebih dahulu.",
      pilih: "Pilih Alamat",
    },
    pembayaranBelumAda: {
      judul: "Pembayaran",
      pesan: (metode: string, total: string) =>
        `${metode} - ${total}. Halaman pembayaran akan dihubungkan pada tahap berikutnya.`,
    },
  },

  pembayaran: {
    judul: "Petunjuk Pembayaran",
    batas: {
      label: "Batas waktu bayar",
      menunggu: (bank: string) => `Menunggu Transfer ${bank}`,
      sisa: "Sisa Waktu",
      habis: "Waktu pembayaran habis",
      habisPesan: "Pesanan ini belum dibayar. Kembali ke keranjang untuk membuat tagihan baru.",
    },
    rekening: {
      judul: (bank: string) => `${bank} Rekening`,
      nomor: "Nomor rekening",
      namaAkun: "Nama akun / pedagang",
      total: "Total nominal transfer",
      salin: "Salin",
      salinJumlah: "Salin Jumlah",
      tersalin: "Tersalin",
      penting: (total: string) =>
        `**Penting:** Pastikan mentransfer tepat **${total}**. Selisih nominal dapat memperlambat proses penjadwalan pemotongan.`,
    },
    ringkasan: {
      judul: "Ringkasan Pesanan",
      invoice: (no: string) => `Invoice: #${no}`,
      jumlah: (jumlah: number, harga: string) => `${jumlah} x ${harga}`,
      ongkir: "Ongkos Kurir",
      antar: (jendela: string) => `Pengantaran (${jendela})`,
      ambil: "Ambil di Toko",
      ambilPesan: "Ambil pesanan langsung di kios setelah pembayaran terverifikasi.",
    },
    petunjuk: { judul: "Petunjuk Pembayaran" },
    sudahTransfer: "Saya Sudah Transfer",
    kembaliKeranjang: "Kembali ke Keranjang",
    konfirmasi: {
      judul: "Sudah transfer?",
      pesan: (total: string) => `Pastikan Anda sudah mentransfer tepat ${total}.`,
      ya: "Ya, sudah transfer",
    },
    tidakDitemukan: "Tagihan tidak ditemukan. Buat pesanan dari keranjang.",
    gagalBuat: { judul: "Gagal membuat tagihan", pesan: "Terjadi kesalahan, coba lagi." },
  },

  berhasil: {
    judul: "Pembayaran Berhasil!",
    pesan: (bank: string) => `Terima kasih! Pesanan Anda telah terverifikasi ${bank}.`,
    danaMasuk: "Total Dana Masuk",
    lunas: "LUNAS",
    jadwal: {
      judul: "Jadwal Pesanan",
      pesanan: (urutan: number, jam: string) => `Pesanan ${urutan} (${jam})`,
      kustomisasi: "Kustomisasi potongan terpilih:",
      targetTiba: "Target Tiba:",
      targetSiap: "Target Siap:",
      ambilDi: (kios: string) => `Ambil pesanan langsung di ${kios}.`,
    },
    ringkasan: {
      judul: "Ringkasan Pesanan",
      item: (n: number) => `${n} Item`,
    },
    bukti: "Simpan Bukti Pembayaran (E-Receipt)",
    lihatPesanan: "Lihat Pesanan",
    keBeranda: "Ke Beranda",
    tidakDitemukan: "Data pembayaran tidak ditemukan.",
  },

  pesanan: {
    judul: "Pesanan Saya",
    cari: "Cari No. Pesanan (#SM-...) atau produk",
    noPesanan: (no: string) => `No. Pesanan: #${no}`,
    status: { disiapkan: "Disiapkan", dikirim: "Sedang Dikirim", selesai: "Selesai" },
    jadwal: "Jadwal",
    estTiba: "Est. Tiba",
    diterima: (bagianHari: string) => `Diterima ${bagianHari}`,
    produkLain: (n: number) => `+${n} produk lainnya`,
    lunas: "Lunas",
    selesaiBayar: "Selesai",
    bayarSaatTiba: "Bayar saat tiba",
    labelBayar: (metode: string, ket: string) => `${metode} \u2022 ${ket}`,
    titikAntarKosong: "Titik antar",
    buktiFoto: (titik: string) => `Bukti Foto ${titik}`,
    buktiKet: "Tergantung aman & higienis",
    lihatFoto: "Lihat Foto",
    aksi: {
      detail: "Detail Produk",
      chat: "Chat Kurir",
      nilai: "Penilaian Produk",
      ulang: "Pesan Ulang Produk",
    },
    segera: {
      judul: "Segera hadir",
      chat: "Chat dengan kurir belum tersedia.",
      nilai: "Penilaian produk belum tersedia.",
      foto: "Foto bukti belum tersedia.",
    },
    kosong: {
      disiapkan: "Belum ada pesanan yang sedang disiapkan.",
      dikirim: "Belum ada pesanan yang sedang dikirim.",
      selesai: "Belum ada pesanan yang selesai.",
      cari: "Pesanan tidak ditemukan di tab ini.",
    },
    gagalUlang: {
      judul: "Gagal memesan ulang",
      pesan: "Produk tidak ditemukan atau terjadi kesalahan. Coba lagi.",
    },
    detail: {
      judul: "Detail Pesanan",
      tidakDitemukan: "Pesanan tidak ditemukan.",
      statusJudul: {
        disiapkan: "Pesanan sedang disiapkan",
        dikirim: "Pesanan sedang dalam pengiriman",
        selesai: "Pesanan selesai",
      },
      info: {
        judul: "Informasi Pesanan",
        noPesanan: "No. Pesanan",
        waktuBayar: "Waktu Pembayaran",
        metode: "Metode Pembayaran",
        salin: "Salin",
        tersalin: "Tersalin",
      },
      rincian: {
        judul: "Rincian Pembayaran",
        subtotal: "Subtotal Produk",
        ongkir: "Ongkos Kurir",
        ambil: "Ambil di toko",
        total: "Total Pembayaran",
      },
    },
  },

  akun: {
    editProfil: "Edit Profil",
    terverifikasi: "Terverifikasi",
    poin: "Poin Surya",
    poinNilai: (n: string) => `${n} Pts`,
    voucher: "Voucher",
    voucherNilai: (n: number) => `${n} Kupon`,
    versi: (v: string) => `v${v}`,
    keluar: "Keluar dari Akun",
    ubahFoto: "Ubah foto profil",
    profilKosong: "Lengkapi profil Anda",
    teleponKosong: "Tambahkan nomor telepon",
    edit: {
      judul: "Edit Profil",
      foto: "Foto Profil",
      petunjukFoto: "Gunakan foto yang jelas agar mudah dikenali.",
      tombolFoto: "Pilih dari Galeri",
      dataDiri: "Informasi Pribadi",
      deskripsi: "Pastikan informasi profilmu selalu terbaru.",
      nama: "Nama Lengkap",
      telepon: "Nomor Telepon",
      placeholderNama: "Masukkan nama lengkap",
      placeholderTelepon: "Contoh: 081234567890",
      catatanTelepon: "Nomor telepon yang diubah belum terverifikasi. Verifikasi OTP dapat dihubungkan saat backend autentikasi tersedia.",
      simpan: "Simpan Perubahan",
      izinFoto: {
        judul: "Izin Galeri Dibutuhkan",
        pesan: "Izinkan aplikasi mengakses galeri untuk memilih foto profil.",
      },
      validasi: {
        judul: "Periksa Kembali",
        nama: "Nama lengkap tidak boleh kosong.",
        telepon: "Masukkan nomor telepon yang valid (9–15 digit).",
      },
      berhasil: { judul: "Profil Diperbarui", pesan: "Perubahan profil berhasil disimpan." },
      gagal: { judul: "Gagal Menyimpan", pesan: "Profil belum berhasil disimpan. Silakan coba lagi." },
    },
    segera: {
      judul: "Segera hadir",
      pesan: (menu: string) => `${menu} belum tersedia.`,
    },
  },

  ngebelanjain: {
    judul: "Ngebelanjain",
    pesananSaya: "Pesanan Saya",
    kosongJudul: "Belum ada pesanan Ngebelanjain.",
    kosongPesan: "Yuk, titip kebutuhan belanja pasar dan biar kami yang belanjain!",
    mulai: "Mulai Ngebelanjain",
    segera: { judul: "Segera hadir", pesan: "Layanan Ngebelanjain belum tersedia." },
  },

  favorit: {
    judul: "Favorit",
    daftarJudul: "Produk Favorit Saya",
    jumlah: (jumlah: number) => `${jumlah} Item Favorit`,
    cari: "Cari produk favorit Anda",
    lihatDetail: "Lihat Detail",
    penandaFavorit: "Produk tersimpan di favorit",
    hapusAksesibilitas: "Hapus produk dari favorit",
    kosong: {
      judul: "Belum Ada Produk Favorit",
      pesan: "Tekan ikon hati pada produk untuk menyimpannya di sini.",
      mulai: "Mulai Belanja",
    },
    tidakCocok: {
      judul: "Produk Tidak Ditemukan",
      pesan: "Coba ubah kata pencarian atau kategori pilihan Anda.",
    },
    gagalHapus: {
      judul: "Gagal menghapus",
      pesan: "Produk belum berhasil dihapus dari favorit. Coba lagi.",
    },
    dialogHapus: {
      judul: "Hapus produk ini?",
      pesan: (nama?: string) =>
        `${nama ?? "Produk yang dipilih"} akan dihapus dari daftar produk favorit Anda. Apakah Anda yakin ingin melanjutkan?`,
      konfirmasi: "Hapus Produk",
    },
  },

  produk: {
    rekomendasi: "Rekomendasi Hari Ini",
    tidakDitemukan: "Produk tidak ditemukan.",
    varian: "Varian",
    custom: "Custom",
    stok: (jumlah: number, satuan: string) => `Stok: ${jumlah} ${satuan}`,
    deskripsi: "Deskripsi",
    lihatSelengkapnya: "Lihat Selengkapnya",
    lihatSedikit: "Lihat Lebih Sedikit",
    potongan: "Request Potongan Gratis",
    catatan: {
      judul: "Catatan Khusus Pemotong",
      label: "Instruksi Khusus Dapur Anda",
      placeholder:
        "Contoh: Tolong potong kecil-kecil untuk kuah soto lamongan, ceker jangan dipotong kukunya terlalu pendek...",
    },
    subtotal: "Subtotal",
    jumlahCustom: {
      judul: "Jumlah Custom",
      label: (satuan: string) => `Jumlah (${satuan})`,
      terapkan: "Terapkan",
      galat: (maks: number) => `Masukkan jumlah 1 sampai ${maks}`,
    },
    keranjang: {
      berhasil: {
        judul: "Masuk keranjang",
        pesan: (nama: string, jumlah: number) => `${jumlah} x ${nama} ditambahkan ke keranjang.`,
        lanjut: "Lanjut belanja",
        lihat: "Lihat keranjang",
      },
      gagal: { judul: "Gagal menambahkan", pesan: "Terjadi kesalahan, coba lagi." },
    },
    bagikan: (nama: string, harga: string) => `${nama} - ${harga}`,
  },

  peringatan: {
    lokasiTidakDitemukan: {
      judul: "Lokasi tidak ditemukan",
      pesan:
        "Coba kata kunci lain, atau pilih titik langsung di peta.",
    },

    lokasiTidakTersedia: {
      judul: "Lokasi tidak tersedia",
      pesan:
        "Izinkan akses lokasi di pengaturan HP, atau geser peta secara manual.",
    },

    gagalSimpan: {
      judul: "Gagal menyimpan",
      pesan: "Terjadi kesalahan, coba lagi.",
    },
  },
} as const;