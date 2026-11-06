import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import GambarProduk from "@/components/produk/gambarproduk";
import Button from "@/components/ui/button";
import { colors, radius, spacing } from "@/theme";
import { Produk } from "@/types/produk";
import { formatHarga } from "@/utils/produk";

type Props = {
  produk: Produk;
  onDetail: () => void;
  onHapus: () => void;
};

export default function KartuFavorit({ produk, onDetail, onHapus }: Props) {
  return (
    <View style={styles.card}>
      <GambarProduk gambar={produk.gambar} style={styles.image} fit="contain" />
      <View style={styles.info}>
        <View style={styles.top}>
          <Text style={styles.name} numberOfLines={2}>{produk.nama}</Text>
          <Pressable onPress={onHapus} hitSlop={10} style={styles.remove}>
            <Ionicons name="close" size={18} color={colors.muted} />
          </Pressable>
        </View>
        <Text style={styles.price}>{formatHarga(produk.harga)}</Text>
      </View>
      <Button label="Lihat Detail" size="sm" onPress={onDetail} style={styles.button} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: radius.md,
    padding: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.sm,
  },
  image: { width: 76, height: 76, borderRadius: radius.sm },
  info: { flex: 1, marginLeft: spacing.sm, justifyContent: "center" },
  top: { flexDirection: "row", alignItems: "flex-start", gap: 4 },
  name: { flex: 1, color: colors.text, fontSize: 12, lineHeight: 16, fontWeight: "600" },
  remove: { padding: 1 },
  price: { color: colors.primary, fontSize: 14, fontWeight: "800", marginTop: 5 },
  button: { marginTop: spacing.sm, height: 36, borderRadius: 7 },
});
