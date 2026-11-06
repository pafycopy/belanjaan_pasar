import { Href } from "expo-router";
import { Promo } from "@/components/beranda/promocarousel";
import { MenuItem } from "@/components/beranda/menugrid";
import { colors } from "@/theme";

// Data Beranda dipisah dari tampilan. Nanti tinggal diganti dengan data dari API.

// Jam buka kios (format "HH:mm", zona WIB)
export const JAM_KIOS = { buka: "06:00", tutup: "10:00" } as const;

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

// Menu pintasan: tujuan (href) ikut di data, jadi Beranda cukup memetakan tanpa daftar if/map terpisah
export type MenuPintasan = Omit<MenuItem, "onPress"> & { href: Href };

export const menuItems: MenuPintasan[] = [
  { id: "poin", label: "Poin Saya", icon: "star", iconBackground: colors.shortcutOrange, href: "/poin" },
  { id: "favorit", label: "Favorit", icon: "heart", iconBackground: colors.shortcutGreen, href: "/favorit" },
  { id: "voucher", label: "Voucher", icon: "ticket", iconBackground: colors.shortcutGreen, href: "/voucher" },
  { id: "riwayat", label: "Riwayat Transaksi", icon: "receipt", iconBackground: colors.shortcutGreen, href: "/pesanan" },
];
