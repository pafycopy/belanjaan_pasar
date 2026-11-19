import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import GambarProduk from "@/components/produk/gambarproduk";
import { colors, radius, spacing } from "@/theme";
import { Produk } from "@/types/produk";
import { formatHarga } from "@/utils/produk";

type Props = {
  produk: Produk;
  favorit: boolean;
  onPress: () => void;
  onToggleFavorit: () => void;
};

/** Kartu produk khusus untuk daftar Promo Hari Ini. */
export default function KartuPromoProduk({
  produk,
  favorit,
  onPress,
  onToggleFavorit,
}: Props) {
  return (
    <Pressable
      style={({ pressed }) => [styles.kartu, pressed && styles.ditekan]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Lihat ${produk.nama}`}
    >
      <GambarProduk gambar={produk.gambar} style={styles.gambar} fit="contain" />

      <Text style={styles.label}>PROMO HARI INI</Text>

      <View style={styles.barisNama}>
        <Text style={styles.nama} numberOfLines={2}>
          {produk.nama}
        </Text>
        <Pressable
          onPress={(event) => {
            event.stopPropagation();
            onToggleFavorit();
          }}
          hitSlop={8}
          style={styles.tombolFavorit}
          accessibilityRole="button"
          accessibilityLabel={favorit ? "Hapus dari favorit" : "Tambah ke favorit"}
        >
          <Ionicons
            name={favorit ? "heart" : "heart-outline"}
            size={21}
            color={colors.danger}
          />
        </Pressable>
      </View>

      <View style={styles.pemisah} />

      <Text style={styles.harga}>{formatHarga(produk.harga)}</Text>
      <Text style={styles.toko} numberOfLines={1}>
        {produk.toko ?? ""}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  kartu: {
    width: 166,
    padding: spacing.sm,
    backgroundColor: colors.white,
    borderRadius: radius.lg,
  },
  ditekan: {
    opacity: 0.92,
  },
  gambar: {
    aspectRatio: 1,
    borderRadius: radius.sm,
    backgroundColor: colors.white,
  },
  label: {
    marginTop: spacing.sm,
    color: colors.dark,
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.25,
  },
  barisNama: {
    minHeight: 42,
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: 3,
  },
  nama: {
    flex: 1,
    color: colors.text,
    fontSize: 12,
    lineHeight: 17,
    fontWeight: "700",
  },
  tombolFavorit: {
    marginLeft: 4,
    padding: 1,
  },
  pemisah: {
    height: 1,
    backgroundColor: colors.border,
    marginTop: spacing.xs,
    marginBottom: spacing.xs,
  },
  harga: {
    color: colors.dark,
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "800",
  },
  toko: {
    marginTop: 2,
    color: colors.text,
    fontSize: 10,
    textAlign: "right",
  },
});
