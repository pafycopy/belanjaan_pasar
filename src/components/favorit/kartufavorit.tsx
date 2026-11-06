import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import GambarProduk from "@/components/produk/gambarproduk";
import Button from "@/components/ui/button";
import { TEKS } from "@/data/teks";
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
      <View style={styles.productRow}>
        <GambarProduk gambar={produk.gambar} style={styles.image} fit="contain" />

        <View style={styles.info}>
          <Text style={styles.name} numberOfLines={2}>
            {produk.nama}
          </Text>
          <Text style={styles.price}>{formatHarga(produk.harga)}</Text>
        </View>

        <View style={styles.actions}>
          <Ionicons
            name="heart"
            size={20}
            color={colors.danger}
            accessibilityLabel={TEKS.favorit.penandaFavorit}
          />
          <Pressable
            onPress={onHapus}
            hitSlop={10}
            style={styles.remove}
            accessibilityRole="button"
            accessibilityLabel={TEKS.favorit.hapusAksesibilitas}
          >
            <Ionicons name="close" size={18} color={colors.muted} />
          </Pressable>
        </View>
      </View>

      <Button
        label={TEKS.favorit.lihatDetail}
        size="sm"
        onPress={onDetail}
        style={styles.button}
      />
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
  productRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  image: {
    width: 72,
    height: 72,
    borderRadius: radius.sm,
  },
  info: {
    flex: 1,
    minWidth: 0,
    justifyContent: "center",
  },
  name: {
    color: colors.text,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "600",
  },
  price: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: "800",
    marginTop: spacing.xs,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: spacing.xs,
  },
  remove: {
    padding: spacing.xs,
    marginTop: -spacing.xs,
    marginRight: -spacing.xs,
  },
  button: {
    marginTop: spacing.sm,
    height: 36,
    borderRadius: radius.sm,
    alignSelf: "stretch",
  },
});
