import { ScrollView, View, Text, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { products } from "@/data/mock";
import { colors } from "@/theme";
import HeaderAddress from "@/components/beranda/headeraddress";
import SearchBar from "@/components/beranda/searchbar";
import PromoCarousel from "@/components/beranda/promocarousel";
import KiosStatusCard from "@/components/beranda/kiosstatuscard";
import WalletCard from "@/components/beranda/walletcard";
import MenuGrid from "@/components/beranda/menugrid";
import ProductCard from "@/components/product";
import { useAlamat } from "@/context/alamat";
import { menuItems, promos, walletItems } from "@/data/beranda";
import { TEKS } from "@/data/teks";

export default function Beranda() {
  const router = useRouter();
  const { terpilih, memuat } = useAlamat();

  const alamatHeader = memuat
    ? TEKS.header.memuat
    : terpilih
      ? terpilih.jalan
      : TEKS.header.kosong;

  return (
    <View style={styles.screen}>
      <HeaderAddress
        address={alamatHeader}
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