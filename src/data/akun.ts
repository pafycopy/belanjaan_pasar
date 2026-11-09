import { IconName } from "@/types/ui";

// Data profil contoh (sementara, belum ada login). Nanti dari akun pengguna di server.
export const PROFIL_CONTOH = {
  nama: "Asep Gracier",
  telepon: "+62 812-8921-3400",
  terverifikasi: true,
} as const;

export type MenuAkun = {
  id: string;
  label: string;
  ikon: IconName;
  href?: "/alamat"; // bila kosong: belum ada halamannya (tampil "Segera hadir")
};

export type GrupMenuAkun = { judul: string; menu: readonly MenuAkun[] };

export const GRUP_MENU_AKUN: readonly GrupMenuAkun[] = [
  {
    judul: "Pengaturan",
    menu: [
      { id: "alamat", label: "Daftar Alamat Pengantaran", ikon: "location-outline", href: "/alamat" },
      { id: "rekening", label: "Rekening Bank & Pembayaran", ikon: "card-outline" },
      { id: "keamanan", label: "Keamanan Akun & PIN Transaksi", ikon: "shield-checkmark-outline" },
    ],
  },
  {
    judul: "Informasi",
    menu: [
      { id: "syarat", label: "Syarat Ketentuan", ikon: "document-text-outline" },
      { id: "tentang", label: "Tentang Kami", ikon: "information-circle-outline" },
      { id: "privasi", label: "Kebijakan Privasi", ikon: "lock-closed-outline" },
      { id: "lapor", label: "Lapor Bug & Kirim Masukan", ikon: "chatbubble-ellipses-outline" },
    ],
  },
  {
    judul: "Lainnya",
    menu: [
      { id: "bantuan", label: "Pusat Bantuan & FAQ", ikon: "help-circle-outline" },
      { id: "nilai", label: "Beri Nilai Aplikasi", ikon: "star-outline" },
    ],
  },
];
