import { Promo } from "@/components/beranda/promocarousel";
import { MenuItem } from "@/components/beranda/menugrid";

// Data Beranda dipisah dari tampilan. Nanti tinggal diganti dengan data dari API.

export const promos: Promo[] = [
  {
    id: "1",
    tag: "PROMO UTAMA HARI INI",
    until: "s/d 10.00 WIB",
    title: "BOCIN",
    subtitle: "(Beli Obral Cuan!)",
    description:
      "Potongan langsung Rp 10.000 per paket ekor. Ekstra diskon bertingkat hingga Rp 20.000 khusus pemesanan via aplikasi pagi ini!",
  },
  {
    id: "2",
    tag: "PROMO MINGGU INI",
    until: "s/d 31 Okt",
    title: "GRATIS ONGKIR",
    subtitle: "(Min. belanja Rp 50.000)",
    description: "Berlaku untuk semua kios di area pengantaran kamu.",
  },
  {
    id: "3",
    tag: "PROMO BULANAN",
    until: "s/d 31 Okt",
    title: "TANGGAL SPECIAL",
    subtitle: "(PROMO KHUSUS)",
    description: "Berlaku untuk semua kios di area pengantaran kamu.",
  },
];

export const menuItems: MenuItem[] = [
  {
    id: "poin",
    label: "Poin Saya",
    icon: "star",
    iconBackground: "#ef7d00",
    onPress: undefined,
  },
  {
    id: "favorit",
    label: "Favorit",
    icon: "heart",
    iconBackground: "#176b38",
  },
  {
    id: "voucher",
    label: "Voucher",
    icon: "ticket",
    iconBackground: "#176b38",
  },
  {
    id: "riwayat",
    label: "Riwayat Transaksi",
    icon: "receipt",
    iconBackground: "#176b38",
  },
];
