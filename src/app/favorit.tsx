import { useMemo, useState } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import SearchField from "@/components/ui/searchfield";
import ChipGroup from "@/components/ui/chipgroup";
import HeaderTab from "@/components/ui/headertab";
import PromoCarousel from "@/components/beranda/promocarousel";
import KartuFavorit from "@/components/favorit/kartufavorit";
import KonfirmasiHapusFavorit from "@/components/favorit/konfirmasihapusfavorit";
import ScreenState from "@/components/ui/screenstate";
import { promos } from "@/data/beranda";
import { FILTER_FAVORIT, FILTER_FAVORIT_SEMUA } from "@/data/favorit";
import { JUMLAH_NOTIFIKASI_BARU } from "@/data/notifikasi";
import { DAFTAR_PRODUK } from "@/data/produk";
import { TEKS } from "@/data/teks";
import { useFavorit } from "@/context/favorit";
import { produkDariIds, saringFavorit } from "@/utils/favorit";
import { colors, radius, spacing } from "@/theme";
import { Produk } from "@/types/produk";

const T = TEKS.favorit;

export default function FavoritScreen() {
  const router = useRouter();
  const { ids, jumlah, memuat, hapus } = useFavorit();
  const [cari, setCari] = useState("");
  const [filter, setFilter] = useState(FILTER_FAVORIT_SEMUA);
  const [targetHapus, setTargetHapus] = useState<Produk | null>(null);

  const daftarFavorit = useMemo(
    () => saringFavorit(produkDariIds(ids, DAFTAR_PRODUK), cari, filter),
    [ids, cari, filter]
  );
  const belumAdaFavorit = ids.length === 0;

  const konfirmasiHapus = async () => {
    if (!targetHapus) return;
    try {
      await hapus(targetHapus.id);
    } catch {
      Alert.alert(T.gagalHapus.judul, T.gagalHapus.pesan);
    } finally {
      setTargetHapus(null);
    }
  };

  return (
    <View style={styles.screen}>
      <HeaderTab
        judul={T.judul}
        jumlahBadge={JUMLAH_NOTIFIKASI_BARU}
        onKembali={() => router.back()}
        onKanan={() => router.push("/notifikasi")}
      />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <PromoCarousel promos={promos} cardHeight={132} style={styles.promo} />

        <View style={styles.titleBar}>
          <Text style={styles.title}>{T.daftarJudul}</Text>
          <View style={styles.countPill}>
            <Text style={styles.countText}>{T.jumlah(jumlah)}</Text>
          </View>
        </View>

        <View style={styles.searchWrap}>
          <SearchField
            value={cari}
            onChangeText={setCari}
            onSubmit={() => undefined}
            placeholder={T.cari}
            icon="search-outline"
          />
        </View>

        <View style={styles.filters}>
          <ChipGroup items={FILTER_FAVORIT} selectedId={filter} onSelect={setFilter} scroll />
        </View>

        {memuat ? (
          <ScreenState loading />
        ) : daftarFavorit.length > 0 ? (
          <View style={styles.list}>
            {daftarFavorit.map((produk) => (
              <KartuFavorit
                key={produk.id}
                produk={produk}
                onDetail={() => router.push({ pathname: "/produk/[id]", params: { id: produk.id } })}
                onHapus={() => setTargetHapus(produk)}
              />
            ))}
          </View>
        ) : (
          <View style={styles.empty}>
            <Ionicons name="heart-outline" size={48} color={colors.muted} />
            <Text style={styles.emptyTitle}>{belumAdaFavorit ? T.kosong.judul : T.tidakCocok.judul}</Text>
            <Text style={styles.emptyText}>{belumAdaFavorit ? T.kosong.pesan : T.tidakCocok.pesan}</Text>
            {belumAdaFavorit ? (
              <Pressable style={styles.shopButton} onPress={() => router.navigate("/")}>
                <Text style={styles.shopButtonText}>{T.kosong.mulai}</Text>
              </Pressable>
            ) : null}
          </View>
        )}
      </ScrollView>

      <KonfirmasiHapusFavorit
        visible={!!targetHapus}
        namaProduk={targetHapus?.nama}
        onBatal={() => setTargetHapus(null)}
        onKonfirmasi={() => void konfirmasiHapus()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.canvas },
  content: { paddingBottom: spacing.xl },
  promo: { marginTop: 8 },
  titleBar: {
    marginHorizontal: 10,
    marginTop: 8,
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    minHeight: 42,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: { color: colors.white, fontSize: 14, fontWeight: "700" },
  countPill: { backgroundColor: colors.glass, borderRadius: 20, paddingHorizontal: 8, paddingVertical: 4 },
  countText: { color: colors.white, fontSize: 9, fontWeight: "600" },
  searchWrap: { paddingHorizontal: 10, marginTop: 8 },
  filters: { marginTop: 4 },
  list: { paddingHorizontal: 10, paddingTop: 8 },
  empty: {
    marginHorizontal: 14,
    marginTop: 18,
    padding: 24,
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    alignItems: "center",
  },
  emptyTitle: { color: colors.text, fontSize: 14, fontWeight: "700", marginTop: 10 },
  emptyText: { color: colors.muted, fontSize: 12, textAlign: "center", lineHeight: 18, marginTop: 6 },
  shopButton: { backgroundColor: colors.dark, paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8, marginTop: 14 },
  shopButtonText: { color: colors.white, fontWeight: "700", fontSize: 12 },
});
