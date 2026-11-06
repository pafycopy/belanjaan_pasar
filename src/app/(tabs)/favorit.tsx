import { useMemo, useState } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import HeaderHijau from "@/components/ui/headerhijau";
import SearchField from "@/components/ui/searchfield";
import ChipGroup, { ChipItem } from "@/components/ui/chipgroup";
import PromoCarousel from "@/components/beranda/promocarousel";
import KartuFavorit from "@/components/favorit/kartufavorit";
import KonfirmasiHapusFavorit from "@/components/favorit/konfirmasihapusfavorit";
import ScreenState from "@/components/ui/screenstate";
import { promos } from "@/data/beranda";
import { DAFTAR_PRODUK } from "@/data/produk";
import { useFavorit } from "@/context/favorit";
import { colors, radius, spacing } from "@/theme";
import { Produk } from "@/types/produk";

const FILTER: readonly ChipItem[] = [
  { id: "semua", label: "Semua" },
  { id: "promo", label: "PROMO" },
  { id: "ayam-bebek", label: "Ayam & Bebek Potong" },
  { id: "partingan", label: "Partingan" },
];

export default function FavoritScreen() {
  const router = useRouter();
  const { ids, jumlah, memuat, hapus } = useFavorit();
  const [cari, setCari] = useState("");
  const [filter, setFilter] = useState("semua");
  const [targetHapus, setTargetHapus] = useState<Produk | null>(null);

  const daftarFavorit = useMemo(() => {
    const semua = ids
      .map((id) => DAFTAR_PRODUK.find((produk) => produk.id === id))
      .filter((produk): produk is Produk => !!produk);

    return semua.filter((produk) => {
      const cocokCari = produk.nama.toLowerCase().includes(cari.trim().toLowerCase());
      const cocokFilter =
        filter === "semua" ||
        (filter === "ayam-bebek" && /ayam|bebek/i.test(produk.nama)) ||
        (filter === "promo" && false) ||
        (filter === "partingan" && /parting|potong/i.test(produk.nama));
      return cocokCari && cocokFilter;
    });
  }, [ids, cari, filter]);

  const konfirmasiHapus = async () => {
    if (!targetHapus) return;
    try {
      await hapus(targetHapus.id);
    } catch {
      Alert.alert("Gagal menghapus", "Produk belum berhasil dihapus dari favorit. Coba lagi.");
    } finally {
      setTargetHapus(null);
    }
  };

  return (
    <View style={styles.screen}>
      <HeaderHijau
        judul="Favorit"
        kanan={
          <Pressable onPress={() => router.push("/notifikasi")} hitSlop={10}>
            <Ionicons name="notifications-outline" size={23} color={colors.white} />
            <View style={styles.badge}><Text style={styles.badgeText}>2</Text></View>
          </Pressable>
        }
      />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <PromoCarousel promos={promos} cardHeight={132} style={styles.promo} />

        <View style={styles.titleBar}>
          <Text style={styles.title}>Produk Favorit Saya</Text>
          <View style={styles.countPill}>
            <Text style={styles.countText}>{jumlah} Item Favorit</Text>
          </View>
        </View>

        <View style={styles.searchWrap}>
          <SearchField
            value={cari}
            onChangeText={setCari}
            onSubmit={() => undefined}
            placeholder="Cari produk favorit Anda"
            icon="search-outline"
          />
        </View>

        <View style={styles.filters}>
          <ChipGroup items={FILTER} selectedId={filter} onSelect={setFilter} scroll />
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
            <Text style={styles.emptyTitle}>
              {ids.length === 0 ? "Belum Ada Produk Favorit" : "Produk Tidak Ditemukan"}
            </Text>
            <Text style={styles.emptyText}>
              {ids.length === 0
                ? "Tekan ikon hati pada produk untuk menyimpannya di sini."
                : "Coba ubah kata pencarian atau kategori pilihan Anda."}
            </Text>
            {ids.length === 0 ? (
              <Pressable style={styles.shopButton} onPress={() => router.navigate("/")}>
                <Text style={styles.shopButtonText}>Mulai Belanja</Text>
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
  screen: { flex: 1, backgroundColor: "#e8e9eb" },
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
  countPill: { backgroundColor: "rgba(255,255,255,0.22)", borderRadius: 20, paddingHorizontal: 8, paddingVertical: 4 },
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
  badge: {
    position: "absolute", top: -5, right: -7, minWidth: 16, height: 16,
    borderRadius: 8, backgroundColor: "#e53935", alignItems: "center", justifyContent: "center",
  },
  badgeText: { color: colors.white, fontSize: 9, fontWeight: "700" },
});
