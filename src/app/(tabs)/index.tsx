import { ScrollView, View, Text, StyleSheet } from "react-native";
import { products, categories } from "@/data/mock";
import { colors } from "@/theme";
import ProductCard from "@/components/product";
import SearchBar from "@/components/beranda/searchbar";
import IconButton from "@/components/iconbutton";
import Banner from "@/components/beranda/kiosstatuscard";
import InfoCardRow, { InfoItem } from "@/components/beranda/cardrow";
import { useRouter } from "expo-router";
import HeaderAddress from "@/components/beranda/headeraddress";
import PromoCarousel, { Promo } from "@/components/beranda/promocarousel";

const promos: Promo[] = [
 {
  id: "1",
  tag: "PROMO UTAMA HARI INI",
  until: "s/d 10.00 WIB",
  title: "BOCIN",
  subtitle: "(Beli Obral Cuan!)",
  description: "Potongan langsung Rp 10.000 per paket ekor...",
  image: { uri: "https://www.magnific.com/vectors/horizontal-banner-mobile-marketing" },
},
  {
    id: "2",
    tag: "PROMO MINGGU INI",
    until: "s/d 31 Okt",
    title: "GRATIS ONGKIR",
    subtitle: "(Min. belanja Rp 50.000)",
    description: "Berlaku untuk semua kios di area pengantaran kamu.",
  },
];

const walletItems: InfoItem[] = [
  { id: "saldo", title: "Saldo", value: "Rp 150.000", icon: "wallet-outline" },
  { id: "poin", title: "Poin", value: "1.250", icon: "star-outline" },
  { id: "transfer", title: "Transfer", icon: "paper-plane-outline" },
];

export default function Beranda() {
  const router = useRouter();
  return (
    <ScrollView style={styles.screen}>
      <HeaderAddress
      address="Jl. Taman Alfa Indah Blok H2 No. 12, Jakarta"
      cartCount={2}
      hasNotification
      onPressAddress={() => router.push("/alamat")}
      onPressCart={() => router.push("/keranjang")}
      onPressNotification={() => router.push("/notifikasi")}
    />

<View style={styles.searchWrap}>
  <SearchBar placeholder="Cari ayam, bebek, ati ampela..." />
</View>

      <View style={styles.content}>
        <PromoCarousel promos={promos} style={{ marginTop: 12 }} />
        <InfoCardRow
          items={walletItems}
          cardStyle={{ backgroundColor: "#fff", borderRadius: 16 }}
          valueStyle={{ color: "#2e7d32" }}
        />
        <Banner style={{ height: 80, backgroundColor: colors.card }} />
      </View>

      <View style={styles.sheet}>
        <View style={styles.categoryRow}>
          {categories.map((c) => (
            <View key={c.id} style={styles.categoryItem}>
              <View style={styles.categoryIcon} />
              <Text style={styles.categoryName}>{c.name}</Text>
            </View>
          ))}
        </View>

        <View style={styles.grid}>
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.primary },
  searchWrap: { paddingHorizontal: 16, paddingBottom: 4 },
  content: { padding: 16, gap: 12 },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 16,
    minHeight: 500,
  },
  categoryRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 16,
  },
  categoryItem: { alignItems: "center" },
  categoryIcon: {
    width: 56,
    height: 56,
    borderRadius: 14,
    backgroundColor: "#e0e0e0",
  },
  categoryName: { marginTop: 6, fontSize: 12 },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
});