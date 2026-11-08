import { IconName } from "@/types/ui";

/**
 * Pembayaran transfer manual (sementara, sebelum ada API QRIS / Virtual Account).
 * Pelanggan transfer ke rekening kios, lalu menekan "Saya Sudah Transfer".
 * Nanti nomor rekening / VA datang dari server per tagihan.
 */
export const REKENING_BCA = {
  bank: "BCA",
  nomor: "7655216154",
  namaAkun: "Yudo Prayitno",
} as const;

// Lama tagihan berlaku sejak dibuat
export const BATAS_BAYAR_MENIT = 15;

// Jendela pengantaran yang ditampilkan di ringkasan pesanan
export const JENDELA_ANTAR = "05.30 - 07.00 WIB";

export type DataPetunjuk = {
  nomor: string;     // nomor rekening tujuan
  namaAkun: string;  // nama pemilik rekening
  total: string;     // sudah diformat, mis. "Rp 121.500"
};

export type PetunjukBank = {
  id: string;
  judul: string;
  ikon: IconName;
  // Teks di antara ** ** tampil tebal
  langkah: (d: DataPetunjuk) => string[];
};

export const PETUNJUK_BCA: readonly PetunjukBank[] = [
  {
    id: "mbca",
    judul: "m-BCA (BCA Mobile)",
    ikon: "phone-portrait-outline",
    langkah: (d) => [
      "Buka aplikasi **BCA mobile**, lalu pilih menu **m-Transfer**.",
      `Pilih **Antar Rekening BCA** dan masukkan nomor rekening **${d.nomor}**.`,
      `Periksa nama penerima (**${d.namaAkun}**), lalu masukkan nominal tepat **${d.total}**.`,
      "Masukkan PIN m-BCA Anda. Setelah transfer berhasil, kembali ke sini dan ketuk **Saya Sudah Transfer**.",
    ],
  },
  {
    id: "klikbca",
    judul: "KlikBCA (Internet Banking)",
    ikon: "desktop-outline",
    langkah: (d) => [
      "Masuk ke **KlikBCA**, lalu pilih menu **Transfer Dana**.",
      `Pilih **Transfer ke Rekening BCA** dan masukkan nomor rekening **${d.nomor}**.`,
      `Periksa nama penerima (**${d.namaAkun}**), lalu masukkan nominal tepat **${d.total}**.`,
      "Selesaikan dengan **KeyBCA**. Setelah berhasil, ketuk **Saya Sudah Transfer** di sini.",
    ],
  },
  {
    id: "atm",
    judul: "ATM BCA",
    ikon: "card-outline",
    langkah: (d) => [
      "Masukkan kartu ATM dan PIN, lalu pilih **Transaksi Lainnya** > **Transfer** > **Ke Rekening BCA**.",
      `Masukkan nomor rekening **${d.nomor}** dan nominal tepat **${d.total}**.`,
      `Periksa nama penerima (**${d.namaAkun}**), lalu pilih **Benar**.`,
      "Simpan struk sebagai bukti, lalu ketuk **Saya Sudah Transfer** di aplikasi ini.",
    ],
  },
];
