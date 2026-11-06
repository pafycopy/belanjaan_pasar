import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing } from "@/theme";
import { SATUAN_BAWAAN } from "@/data/produk";
import { TEKS } from "@/data/teks";
import { Produk } from "@/types/produk";
import { formatHarga } from "@/utils/produk";

type Props = {
  produk: Produk;
  favorit: boolean;
  onToggleFavorit: () => void;
};

export default function InfoProduk({ produk, favorit, onToggleFavorit }: Props) {
  return (
    <View style={styles.wrap}>
      <View style={styles.baris}>
        <Text style={styles.nama}>{produk.nama}</Text>
        <Pressable onPress={onToggleFavorit} hitSlop={10} accessibilityRole="button" accessibilityLabel={favorit ? "Hapus dari favorit" : "Tambah ke favorit"}>
          <Ionicons name={favorit ? "heart" : "heart-outline"} size={26} color={colors.danger} />
        </Pressable>
      </View>

      <View style={styles.baris}>
        <View style={styles.ringkas}>
          {produk.ringkas?.map((teks) => (
            <Text key={teks} style={styles.ringkasText}>{teks}</Text>
          ))}
        </View>
        {produk.stok != null ? (
          <View style={styles.stok}>
            <Ionicons name="cart" size={18} color={colors.green} />
            <Text style={styles.stokText}>{TEKS.produk.stok(produk.stok, produk.satuan ?? SATUAN_BAWAAN)}</Text>
          </View>
        ) : null}
      </View>
      <Text style={styles.harga}>{formatHarga(produk.harga)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: spacing.sm },
  baris: { flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between", gap: spacing.md },
  nama: { flex: 1, fontSize: 17, fontWeight: "600", color: colors.text, lineHeight: 24 },
  ringkas: { flex: 1 },
  ringkasText: { fontSize: 14, lineHeight: 20, color: colors.textSoft },
  stok: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: spacing.xs },
  stokText: { fontSize: 14, color: colors.textSoft },
  harga: { fontSize: 26, fontWeight: "700", color: colors.dark, marginTop: spacing.md },
});
