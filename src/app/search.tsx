import { useMemo, useRef, useState } from "react";
import type { ComponentRef } from "react";
import {
  FlatList,
  Keyboard,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import KartuProduk from "@/components/produk/kartuproduk";
import { DAFTAR_PRODUK } from "@/data/produk";
import { useFavorit } from "@/context/favorit";
import { colors, radius, spacing } from "@/theme";
import { saringProduk } from "@/utils/produk";

const KATA_KUNCI_POPULER = ["Ayam", "Beras", "Daging sapi", "Telur", "Sayuran", "Ikan"];

export default function SearchScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const inputRef = useRef<ComponentRef<typeof TextInput>>(null);
  const [kata, setKata] = useState("");
  const [riwayat, setRiwayat] = useState<string[]>([]);
  const { isFavorit, toggle } = useFavorit();

  const hasil = useMemo(() => saringProduk(DAFTAR_PRODUK, kata, "semua"), [kata]);
  const pilihKata = (teks: string) => {
    setKata(teks);
    setRiwayat((sebelumnya) => [teks, ...sebelumnya.filter((item) => item.toLowerCase() !== teks.toLowerCase())].slice(0, 8));
    Keyboard.dismiss();
  };
  const kirimPencarian = () => {
    const teks = kata.trim();
    if (!teks) return;
    setKata(teks);
    setRiwayat((sebelumnya) => [teks, ...sebelumnya.filter((item) => item.toLowerCase() !== teks.toLowerCase())].slice(0, 8));
    Keyboard.dismiss();
  };
  const bukaProduk = (id: string) => router.push({ pathname: "/produk/[id]", params: { id } });

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={10} style={styles.backButton} accessibilityLabel="Kembali">
          <Ionicons name="arrow-back" size={23} color={colors.textStrong} />
        </Pressable>
        <View style={styles.searchBox}>
          <Ionicons name="search-outline" size={19} color={colors.muted} />
          <TextInput
            ref={inputRef}
            style={styles.input}
            value={kata}
            onChangeText={setKata}
            placeholder="Cari produk yang kamu butuhkan"
            placeholderTextColor={colors.placeholder}
            autoFocus
            returnKeyType="search"
            onSubmitEditing={kirimPencarian}
            autoCorrect={false}
          />
          {kata.length > 0 ? (
            <Pressable onPress={() => { setKata(""); inputRef.current?.focus(); }} hitSlop={8}>
              <Ionicons name="close-circle" size={19} color={colors.muted} />
            </Pressable>
          ) : null}
        </View>
        <Pressable onPress={kirimPencarian} style={styles.searchAction}>
          <Text style={styles.searchActionText}>Cari</Text>
        </Pressable>
      </View>

      {kata.trim().length > 0 ? (
        <View style={styles.resultHeader}>
          <Text style={styles.sectionTitle}>Hasil pencarian</Text>
          <Text style={styles.resultCount}>{hasil.length} produk</Text>
        </View>
      ) : null}

      {kata.trim().length > 0 ? (
        hasil.length > 0 ? (
          <FlatList
            key="hasil-pencarian"
            data={hasil}
            numColumns={2}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.grid}
            columnWrapperStyle={styles.gridRow}
            keyboardShouldPersistTaps="handled"
            renderItem={({ item }) => (
              <KartuProduk
                produk={item}
                favorit={isFavorit(item.id)}
                onToggleFavorit={() => void toggle(item.id)}
                onPress={() => bukaProduk(item.id)}
              />
            )}
          />
        ) : (
          <View style={styles.empty}>
            <Ionicons name="search-outline" size={42} color={colors.placeholder} />
            <Text style={styles.emptyTitle}>Produk tidak ditemukan</Text>
            <Text style={styles.emptyText}>Coba kata kunci lain atau periksa ejaan pencarianmu.</Text>
          </View>
        )
      ) : (
        <ScrollView contentContainerStyle={styles.discovery} keyboardShouldPersistTaps="handled">
          {riwayat.length > 0 ? (
            <View style={styles.section}>
              <View style={styles.sectionHeading}>
                <Text style={styles.sectionTitle}>Pencarian terakhir</Text>
                <Pressable onPress={() => setRiwayat([])}>
                  <Text style={styles.clearText}>Hapus</Text>
                </Pressable>
              </View>
              <View style={styles.chips}>
                {riwayat.map((item) => (
                  <Pressable key={item} style={styles.historyChip} onPress={() => pilihKata(item)}>
                    <Ionicons name="time-outline" size={15} color={colors.muted} />
                    <Text style={styles.chipText}>{item}</Text>
                  </Pressable>
                ))}
              </View>
            </View>
          ) : null}
          <View style={styles.section}>
            <View style={styles.sectionHeading}>
              <Text style={styles.sectionTitle}>Pencarian populer</Text>
              <Ionicons name="trending-up" size={18} color={colors.primary} />
            </View>
            <View style={styles.popularList}>
              {KATA_KUNCI_POPULER.map((item, index) => (
                <Pressable key={item} style={styles.popularItem} onPress={() => pilihKata(item)}>
                  <Text style={[styles.rank, index < 3 && styles.topRank]}>{index + 1}</Text>
                  <Text style={styles.popularText}>{item}</Text>
                  <Ionicons name="arrow-up-outline" size={15} color={colors.muted} />
                </Pressable>
              ))}
            </View>
          </View>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.white },
  header: { flexDirection: "row", alignItems: "center", paddingHorizontal: 12, paddingTop: spacing.sm, paddingBottom: 12, gap: 9, borderBottomWidth: 1, borderBottomColor: colors.border },
  backButton: { width: 26, alignItems: "center", justifyContent: "center" },
  searchBox: { flex: 1, height: 42, flexDirection: "row", alignItems: "center", gap: 8, backgroundColor: colors.fieldBg, borderRadius: radius.md, paddingHorizontal: 11 },
  input: { flex: 1, padding: 0, fontSize: 13, color: colors.textStrong },
  searchAction: { paddingVertical: 8, paddingLeft: 2 },
  searchActionText: { color: colors.primary, fontWeight: "700", fontSize: 14 },
  discovery: { paddingBottom: 30 },
  section: { paddingHorizontal: 16, paddingTop: 20, paddingBottom: 6 },
  sectionHeading: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 13 },
  sectionTitle: { color: colors.textStrong, fontSize: 15, fontWeight: "800" },
  clearText: { color: colors.primary, fontSize: 12, fontWeight: "600" },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: 9 },
  historyChip: { flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: colors.surface, borderRadius: radius.pill, paddingHorizontal: 12, paddingVertical: 9 },
  chipText: { color: colors.text, fontSize: 12 },
  popularList: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  popularItem: { width: "48%", minHeight: 42, flexDirection: "row", alignItems: "center", gap: 9, borderBottomWidth: 1, borderBottomColor: colors.border, paddingVertical: 8 },
  rank: { width: 20, textAlign: "center", color: colors.muted, fontSize: 12, fontWeight: "800" },
  topRank: { color: colors.danger },
  popularText: { flex: 1, color: colors.text, fontSize: 13 },
  resultHeader: { paddingHorizontal: 14, paddingVertical: 13, flexDirection: "row", justifyContent: "space-between", alignItems: "center", backgroundColor: colors.white },
  resultCount: { color: colors.muted, fontSize: 12 },
  grid: { paddingHorizontal: 8, paddingBottom: 24 },
  gridRow: { justifyContent: "space-between" },
  empty: { flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 32, paddingBottom: 80 },
  emptyTitle: { marginTop: 12, color: colors.textStrong, fontSize: 15, fontWeight: "800" },
  emptyText: { marginTop: 6, color: colors.muted, fontSize: 12, textAlign: "center", lineHeight: 18 },
});
