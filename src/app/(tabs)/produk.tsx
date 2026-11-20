import { useMemo, useState } from "react";
import { FlatList, ScrollView, StyleSheet, View } from "react-native";
import { useRouter } from "expo-router";
import HeaderAddress from "@/components/beranda/headeraddress";
import { useAlamat } from "@/context/alamat";
import { usePesanan } from "@/context/pesanan";
import { JUMLAH_NOTIFIKASI_BARU } from "@/data/notifikasi";
import SearchField from "@/components/ui/searchfield";
import JudulSeksi from "@/components/ui/judulseksi";
import ChipGroup from "@/components/ui/chipgroup";
import ScreenState from "@/components/ui/screenstate";
import PromoHariIni from "@/components/produk/promohariini";
import KartuProduk, { LEBAR_KARTU_GESER } from "@/components/produk/kartuproduk";
import { useKeranjang } from "@/context/keranjang";
import { useFavorit } from "@/context/favorit";
import { JAM_KIOS } from "@/data/beranda";
import { DAFTAR_PRODUK, KATEGORI_PRODUK, KATEGORI_PRODUK_SEMUA } from "@/data/produk";
import { JUDUL_PRODUK_TERLARIS } from "@/data/terlaris";
import { TEKS } from "@/data/teks";
import { adaPromo, saringProduk } from "@/utils/produk";
import { urutkanProdukTerlaris } from "@/utils/terlaris";
import { colors, spacing } from "@/theme";

const T = TEKS.katalog;

export default function ProdukScreen() {
  const { terpilih, memuat } = useAlamat();
  const alamatHeader = memuat
    ? TEKS.header.memuat
    : terpilih
      ? terpilih.jalan
      : TEKS.header.kosong;

  const router = useRouter();
  const { jumlahBaris } = useKeranjang();
  const { pesanan } = usePesanan();
  const { isFavorit, toggle } = useFavorit();

  const [cari, setCari] = useState("");
  const [kategori, setKategori] = useState(KATEGORI_PRODUK_SEMUA);

  // Semua produk katalog tetap ditampilkan; produk dengan penjualan tertinggi
  // dalam 30 hari terakhir ditempatkan lebih dahulu.
  const produkTerlaris = useMemo(
    () => urutkanProdukTerlaris(DAFTAR_PRODUK, pesanan),
    [pesanan]
  );

  const produkPromo = useMemo(() => DAFTAR_PRODUK.filter(adaPromo), []);

  const daftar = useMemo(
    () => saringProduk(DAFTAR_PRODUK, cari, kategori),
    [cari, kategori]
  );

  const keDetail = (id: string) =>
    router.push({ pathname: "/produk/[id]", params: { id } });

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

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={styles.searchWrap}>
          <SearchField
            value={cari}
            onChangeText={setCari}
            onSubmit={() => undefined}
            placeholder={T.cari}
            icon="search-outline"
          />
        </View>

        <View style={styles.seksi}>
          <JudulSeksi judul={JUDUL_PRODUK_TERLARIS} />
          <FlatList
            horizontal
            data={produkTerlaris}
            keyExtractor={(produk) => produk.id}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.produkTerlarisList}
            renderItem={({ item }) => (
              <KartuProduk
                produk={item}
                style={styles.kartuGeser}
                favorit={isFavorit(item.id)}
                onToggleFavorit={() => void toggle(item.id)}
                onPress={() => keDetail(item.id)}
              />
            )}
          />
        </View>

        {produkPromo.length > 0 ? (
          <View style={styles.seksi}>
            <PromoHariIni
              produk={produkPromo}
              sampai={T.promoSampai(JAM_KIOS.tutup)}
              isFavorit={isFavorit}
              onToggleFavorit={(id) => void toggle(id)}
              onPressProduk={keDetail}
            />
          </View>
        ) : null}

        <View style={styles.filters}>
          <ChipGroup items={KATEGORI_PRODUK} selectedId={kategori} onSelect={setKategori} scroll />
        </View>

        {daftar.length > 0 ? (
          <View style={styles.grid}>
            {daftar.map((produk) => (
              <KartuProduk
                key={produk.id}
                produk={produk}
                favorit={isFavorit(produk.id)}
                onToggleFavorit={() => void toggle(produk.id)}
                onPress={() => keDetail(produk.id)}
              />
            ))}
          </View>
        ) : (
          <ScreenState message={T.kosong} />
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.canvas },
  content: { paddingBottom: spacing.xl },
  searchWrap: { paddingHorizontal: 14, paddingTop: spacing.md },
  seksi: { marginTop: spacing.lg },
  produkTerlarisList: { paddingHorizontal: 14, gap: 10 },
  kartuGeser: { width: LEBAR_KARTU_GESER, marginBottom: 0 },
  filters: { marginTop: spacing.lg },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 6,
    paddingTop: spacing.md,
  },
});
