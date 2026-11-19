import { useMemo, useState } from "react";
import { FlatList, ScrollView, StyleSheet, View } from "react-native";
import { useRouter } from "expo-router";
import HeaderAddress from "@/components/beranda/headeraddress";
import { useAlamat } from "@/context/alamat";
import { JUMLAH_NOTIFIKASI_BARU } from "@/data/notifikasi";
import SearchField from "@/components/ui/searchfield";
import JudulSeksi from "@/components/ui/judulseksi";
import Pill from "@/components/ui/pill";
import ChipGroup from "@/components/ui/chipgroup";
import ScreenState from "@/components/ui/screenstate";
import PromoCarousel from "@/components/beranda/promocarousel";
import KartuProduk from "@/components/produk/kartuproduk";
import KartuProdukRingkas from "@/components/produk/kartuprodukringkas";
import { useFavorit } from "@/context/favorit";
import { useKeranjang } from "@/context/keranjang";
import { JAM_KIOS, promos } from "@/data/beranda";
import { DAFTAR_PRODUK, KATEGORI_PRODUK, KATEGORI_PRODUK_SEMUA } from "@/data/produk";
import { TEKS } from "@/data/teks";
import { useTambahCepat } from "@/hooks/usetambahcepat";
import { produkDariIds } from "@/utils/favorit";
import { saringProduk } from "@/utils/produk";
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
  const { ids } = useFavorit();
  const tambahCepat = useTambahCepat();

  const [cari, setCari] = useState("");
  const [kategori, setKategori] = useState(KATEGORI_PRODUK_SEMUA);

  const favorit = useMemo(() => produkDariIds(ids, DAFTAR_PRODUK), [ids]);
  const daftar = useMemo(() => saringProduk(DAFTAR_PRODUK, cari, kategori), [cari, kategori]);

  const keDetail = (id: string) => router.push({ pathname: "/produk/[id]", params: { id } });

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

        {/* Hanya tampil bila sudah ada produk favorit */}
        {favorit.length > 0 ? (
          <View style={styles.seksi}>
            <JudulSeksi
              judul={T.favoritJudul}
              aksi={{ label: T.lihatSemua, onPress: () => router.navigate("/favorit") }}
            />
            <FlatList
              horizontal
              data={favorit}
              keyExtractor={(p) => p.id}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.favoritList}
              renderItem={({ item }) => (
                <KartuProdukRingkas
                  produk={item}
                  onPress={() => keDetail(item.id)}
                  onTambah={() => void tambahCepat(item)}
                />
              )}
            />
          </View>
        ) : null}

        <View style={styles.seksi}>
          <JudulSeksi
            judul={T.promoJudul}
            kanan={<Pill icon="alarm-outline" label={T.promoSampai(JAM_KIOS.tutup)} />}
          />
          <PromoCarousel promos={promos} cardHeight={170} />
        </View>

        <View style={styles.filters}>
          <ChipGroup items={KATEGORI_PRODUK} selectedId={kategori} onSelect={setKategori} scroll />
        </View>

        {daftar.length > 0 ? (
          <View style={styles.grid}>
            {daftar.map((produk) => (
              <KartuProduk key={produk.id} produk={produk} onPress={() => keDetail(produk.id)} />
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
  favoritList: { paddingHorizontal: 14, gap: 10 },
  filters: { marginTop: spacing.lg },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingTop: spacing.md,
  },
});
