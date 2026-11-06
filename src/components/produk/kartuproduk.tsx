import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, radius, spacing } from "@/theme";
import { Produk } from "@/types/produk";
import { formatHarga } from "@/utils/produk";
import { useFavorit } from "@/context/favorit";
import GambarProduk from "./gambarproduk";

type Props = { produk: Produk; onPress: () => void };

export default function KartuProduk({ produk, onPress }: Props) {
  const { isFavorit, toggle } = useFavorit();
  const favorit = isFavorit(produk.id);

  return (
    <Pressable style={styles.kartu} onPress={onPress}>
      <View style={styles.gambarWrap}>
        <GambarProduk gambar={produk.gambar} style={styles.gambar} />
        <Pressable
          style={styles.tombolFavorit}
          onPress={(event) => {
            event.stopPropagation();
            void toggle(produk.id);
          }}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel={favorit ? "Hapus dari favorit" : "Tambah ke favorit"}
        >
          <Ionicons name={favorit ? "heart" : "heart-outline"} size={19} color={favorit ? colors.danger : colors.text} />
        </Pressable>
      </View>
      <Text style={styles.harga}>{formatHarga(produk.harga)}</Text>
      <Text style={styles.nama} numberOfLines={2}>{produk.nama}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  kartu: {
    width: "48.5%",
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    paddingTop: 10,
    paddingBottom: 18,
    paddingHorizontal: 12,
    marginBottom: spacing.md,
  },
  gambarWrap: { position: "relative" },
  gambar: { aspectRatio: 1 },
  tombolFavorit: {
    position: "absolute",
    top: 5,
    right: 5,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "rgba(255,255,255,0.94)",
    alignItems: "center",
    justifyContent: "center",
    elevation: 2,
  },
  harga: { fontSize: 16, fontWeight: "700", color: colors.dark, marginTop: 14 },
  nama: { fontSize: 14, lineHeight: 20, color: colors.text, marginTop: 8, minHeight: 40 },
});
