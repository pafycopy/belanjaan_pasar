import { Promo } from "@/components/beranda/promocarousel";
import { WalletItem } from "@/components/beranda/walletcard";
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

export const walletItems: WalletItem[] = [
  { id: "saldo", label: "Saldo Anda", value: "Rp 150.000", icon: "wallet" },
  { id: "poin", label: "Poin Saya", value: "2.450 Pts", icon: "star" },
  { id: "transfer", label: "Transfer", value: "Kirim Saldo", icon: "swap-horizontal" },
];

export const menuItems: MenuItem[] = [
  { id: "belanja", label: "Ngebelanjain", icon: "bicycle" },
  { id: "toko", label: "Toko Populer", icon: "storefront" },
  { id: "voucher", label: "Voucher", icon: "ticket" },
  { id: "riwayat", label: "Riwayat Transaksi", icon: "receipt" },
];
