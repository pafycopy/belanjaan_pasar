import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import GambarProduk from "@/components/produk/gambarproduk";
import { Produk } from "@/types/produk";
import { colors, radius, spacing } from "@/theme";
import { formatHarga } from "@/utils/produk";

type Props = {
  produk?: Produk[];
  isFavorit: (produkId: string) => boolean;
  onToggleFavorit: (produkId: string) => void;
  onPressProduk: (produkId: string) => void;
};

export default function PromoHariIni({
  produk = [],
  isFavorit,
  onToggleFavorit,
  onPressProduk,
}: Props) {
  const daftarProduk = Array.isArray(produk) ? produk : [];

  if (daftarProduk.length === 0) {
    return (
      <View style={styles.kosong}>
        <Text style={styles.teksKosong}>Belum ada produk untuk ditampilkan.</Text>
      </View>
    );
  }

  return (
    <View style={styles.panel}>
      <FlatList
        horizontal
        data={daftarProduk}
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.daftar}
        ItemSeparatorComponent={() => <View style={{ width: spacing.sm }} />}
        renderItem={({ item }) => {
          const favorit = isFavorit(item.id);
          return (
            <View style={styles.kartuLuar}>
              <Pressable
                style={styles.kartu}
                onPress={() => onPressProduk(item.id)}
                accessibilityRole="button"
                accessibilityLabel={`Lihat ${item.nama}`}
              >
                <View style={styles.gambarWrap}>
                  <GambarProduk gambar={item.gambar} style={styles.gambar} fit="contain" />
                  <Pressable
                    style={styles.tombolFavorit}
                    onPress={(event) => {
                      event.stopPropagation();
                      onToggleFavorit(item.id);
                    }}
                    hitSlop={8}
                    accessibilityRole="button"
                    accessibilityLabel={favorit ? `Hapus ${item.nama} dari favorit` : `Tambahkan ${item.nama} ke favorit`}
                  >
                    <Ionicons
                      name={favorit ? "heart" : "heart-outline"}
                      size={20}
                      color={favorit ? colors.danger : colors.text}
                    />
                  </Pressable>
                </View>

                <View style={styles.info}>
                  <Text style={styles.nama} numberOfLines={2}>{item.nama}</Text>
                  <Text style={styles.harga}>{formatHarga(item.harga)}</Text>
                  <Text style={styles.toko} numberOfLines={1}>{item.toko ?? "Belanjaan Pasar"}</Text>
                </View>
              </Pressable>
            </View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    backgroundColor: colors.primary,
    borderRadius: radius.card,
    paddingVertical: spacing.md,
    paddingLeft: spacing.md,
    paddingRight: spacing.md,
    marginHorizontal: spacing.md,
  },
  daftar: { paddingRight: spacing.xs },
  kartuLuar: {
    width: 214,
    backgroundColor: colors.white,
    borderRadius: radius.md,
    padding: spacing.sm,
  },
  kartu: { flex: 1 },
  gambarWrap: { position: "relative" },
  gambar: { aspectRatio: 1.35, borderRadius: radius.sm, backgroundColor: colors.surface },
  tombolFavorit: {
    position: "absolute",
    top: 6,
    right: 6,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
    elevation: 2,
  },
  info: { paddingTop: spacing.sm },
  nama: { color: colors.text, fontSize: 13, lineHeight: 18, fontWeight: "700", minHeight: 36 },
  harga: { color: colors.dark, fontSize: 16, fontWeight: "800", marginTop: spacing.xs },
  toko: { color: colors.muted, fontSize: 11, marginTop: spacing.xs },
  kosong: { marginHorizontal: spacing.md, padding: spacing.lg, backgroundColor: colors.white, borderRadius: radius.md },
  teksKosong: { color: colors.muted, fontSize: 13 },
});
