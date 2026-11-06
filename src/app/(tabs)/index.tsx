import { ScrollView, View, Text, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { DAFTAR_PRODUK } from "@/data/produk";
import { colors, spacing } from "@/theme";
import HeaderAddress from "@/components/beranda/headeraddress";
import SearchBar from "@/components/beranda/searchbar";
import PromoCarousel from "@/components/beranda/promocarousel";
import KiosStatusCard from "@/components/beranda/kiosstatuscard";
import MenuGrid from "@/components/beranda/menugrid";
import KartuProduk from "@/components/produk/kartuproduk";
import { useAlamat } from "@/context/alamat";
import { useKeranjang } from "@/context/keranjang";
import { menuItems, promos } from "@/data/beranda";
import { TEKS } from "@/data/teks";

export default function Beranda() {
  const router = useRouter();
  const { terpilih, memuat } = useAlamat();
  const { jumlahBaris } = useKeranjang();

  const menu = menuItems.map((item) => {
    const tujuan: Record<string, () => void> = {
      poin: () => router.push("/poin"),
      favorit: () => router.push("/favorit"),
      voucher: () => router.push("/voucher"),
      riwayat: () => router.push("/pesanan"),
    };

    return { ...item, onPress: tujuan[item.id] };
  });

  const alamatHeader = memuat
    ? TEKS.header.memuat
    : terpilih
      ? terpilih.jalan
      : TEKS.header.kosong;

  return (
    <View style={styles.screen}>
      <HeaderAddress
        address={alamatHeader}
        cartCount={jumlahBaris}
        hasNotification
        onPressAddress={() => router.push("/alamat")}
        onPressCart={() => router.push("/keranjang")}
        onPressNotification={() => router.push("/notifikasi")}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.searchWrap}>
          <SearchBar placeholder="Cari ayam, bebek, ati ampela..." />
        </View>

        <PromoCarousel promos={promos} style={styles.promo} cardHeight={170} />

        <View style={styles.kiosWrap}>
          <KiosStatusCard openAt="06:00" closeAt="10:00" />
        </View>

        <View style={styles.shortcutPanel}>
          <MenuGrid items={menu} />
        </View>

        <View style={styles.recommendationSection}>
          <View style={styles.sectionHeading}>
            <Text style={styles.sectionTitle}>{TEKS.produk.rekomendasi}</Text>
          </View>

          <View style={styles.productGrid}>
            {DAFTAR_PRODUK.map((produk) => (
              <KartuProduk
                key={produk.id}
                produk={produk}
                onPress={() =>
                  router.push({
                    pathname: "/produk/[id]",
                    params: { id: produk.id },
                  })
                }
              />
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  searchWrap: {
    paddingHorizontal: 14,
    paddingTop: 10,
  },
  promo: {
    marginTop: 10,
  },
  kiosWrap: {
    paddingHorizontal: 8,
    marginTop: 10,
  },
  shortcutPanel: {
    backgroundColor: colors.white,
    marginHorizontal: 6,
    marginTop: 6,
    paddingHorizontal: 10,
    paddingTop: 16,
    paddingBottom: 12,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomLeftRadius: 14,
    borderBottomRightRadius: 14,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  recommendationSection: {
    marginTop: 8,
    backgroundColor: colors.white,
  },
  sectionHeading: {
    backgroundColor: "#e8e9eb",
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.text,
  },
  productGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    paddingTop: 10,
  },
});
