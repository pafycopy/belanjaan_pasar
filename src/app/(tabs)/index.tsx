import { ScrollView, View, Text, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { products } from "@/data/mock";
import { colors } from "@/theme";
import HeaderAddress from "@/components/beranda/headeraddress";
import SearchBar from "@/components/beranda/searchbar";
import PromoCarousel, { Promo } from "@/components/beranda/promocarousel";
import KiosStatusCard from "@/components/beranda/kiosstatuscard";
import WalletCard, { WalletItem } from "@/components/beranda/walletcard";
import MenuGrid, { MenuItem } from "@/components/beranda/menugrid";
import ProductCard from "@/components/product";

const promos: Promo[] = [
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
  },{
    id: "3",
    tag: "PROMO BULANAN",
    until: "s/d 31 Okt",
    title: "TANGGAL SPECIAL",
    subtitle: "(PROMO KHUSUS)",
    description: "Berlaku untuk semua kios di area pengantaran kamu.",
  },
];

const walletItems: WalletItem[] = [
  { id: "saldo", label: "Saldo Anda", value: "Rp 150.000", icon: "wallet" },
  { id: "poin", label: "Poin Saya", value: "2.450 Pts", icon: "star" },
  { id: "transfer", label: "Transfer", value: "Kirim Saldo", icon: "swap-horizontal" },
];

const menuItems: MenuItem[] = [
  { id: "belanja", label: "Ngebelanjain", icon: "bicycle" },
  { id: "toko", label: "Toko Populer", icon: "storefront" },
  { id: "voucher", label: "Voucher", icon: "ticket" },
  { id: "riwayat", label: "Riwayat Transaksi", icon: "receipt" },
];

export default function Beranda() {
  const router = useRouter();

  return (
    <View style={styles.screen}>
      <HeaderAddress
        address="Jl. Taman Alfa Indah Blok H2 No. 12, Jakarta"
        cartCount={2}
        hasNotification
        onPressAddress={() => router.push("/alamat")}
        onPressCart={() => router.push("/keranjang")}
        onPressNotification={() => router.push("/notifikasi")}
      />

      <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
        <View style={styles.padded}>
          <SearchBar placeholder="Cari ayam, bebek, ati ampela..." style={{ marginTop: 12 }} />
        </View>

        <PromoCarousel promos={promos} style={{ marginTop: 12 }} cardHeight={170} />

        <View style={[styles.padded, { marginTop: 12, gap: 12 }]}>
          <KiosStatusCard openAt="06:00" closeAt="10:00" />
          <WalletCard items={walletItems} />
        </View>

        <View style={styles.sheet}>
          <MenuGrid items={menuItems} />
        </View>

        <View style={styles.padded}>
          <Text style={styles.sectionTitle}>Rekomendasi Hari Ini</Text>
          <View style={styles.grid}>
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.surface },
  padded: { paddingHorizontal: 16 },
  sheet: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: 16,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.text,
    marginTop: 16,
    marginBottom: 12,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
});