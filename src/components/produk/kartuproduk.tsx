import { Pressable, StyleSheet, Text } from "react-native";
import { colors, radius, spacing } from "@/theme";
import { Produk } from "@/types/produk";
import { formatHarga } from "@/utils/produk";
import GambarProduk from "./gambarproduk";

type Props = { produk: Produk; onPress: () => void };

export default function KartuProduk({ produk, onPress }: Props) {
  return (
    <Pressable style={styles.kartu} onPress={onPress}>
      <GambarProduk gambar={produk.gambar} style={styles.gambar} />
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
  gambar: { aspectRatio: 1 },
  harga: { fontSize: 16, fontWeight: "700", color: colors.dark, marginTop: 14 },
  nama: { fontSize: 14, lineHeight: 20, color: colors.text, marginTop: 8, minHeight: 40 },
});
