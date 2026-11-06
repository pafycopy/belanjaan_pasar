import { ScrollView, View, Text, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { DAFTAR_PRODUK } from "@/data/produk";
import { colors } from "@/theme";
import HeaderAddress from "@/components/beranda/headeraddress";
import SearchBar from "@/components/beranda/searchbar";
import PromoCarousel from "@/components/beranda/promocarousel";
import KiosStatusCard from "@/components/beranda/kiosstatuscard";
import MenuGrid, { MenuItem } from "@/components/beranda/menugrid";
import KartuProduk from "@/components/produk/kartuproduk";
import { useAlamat } from "@/context/alamat";
import { useKeranjang } from "@/context/keranjang";
import { JAM_KIOS, menuItems, promos } from "@/data/beranda";
import { JUMLAH_NOTIFIKASI_BARU } from "@/data/notifikasi";
import { TEKS } from "@/data/teks";

export default function Beranda() {
  const router = useRouter();
  const { terpilih, memuat } = useAlamat();
  const { jumlahBaris } = useKeranjang();

  const menu: MenuItem[] = menuItems.map(({ href, ...item }) => ({
    ...item,
    onPress: () => router.push(href),
  }));

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
        hasNotification={JUMLAH_NOTIFIKASI_BARU > 0}
        onPressAddress={() => router.push("/alamat")}
        onPressCart={() => router.push("/keranjang")}
        onPressNotification={() => router.push("/notifikasi")}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.searchWrap}>
          <SearchBar placeholder={TEKS.beranda.cari} />
        </View>

        <PromoCarousel promos={promos} style={styles.promo} cardHeight={170} />

        <View style={styles.kiosWrap}>
          <KiosStatusCard openAt={JAM_KIOS.buka} closeAt={JAM_KIOS.tutup} />
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
    backgroundColor: colors.canvas,
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
    marginHorizontal: 0,
    marginTop: 8,
    paddingHorizontal: 16,
    paddingTop: 26,
    paddingBottom: 14,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    shadowColor: colors.dark,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
  },
  recommendationSection: {
    marginHorizontal: 4,
    marginTop: 0,
    backgroundColor: colors.canvas,
  },
  sectionHeading: {
    backgroundColor: colors.canvas,
    paddingHorizontal: 14,
    paddingVertical: 11,
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
    paddingHorizontal: 8,
    paddingTop: 2,
  },
});
