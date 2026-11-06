import { Pressable, StyleSheet, Text, View } from "react-native";
import GambarProduk from "@/components/produk/gambarproduk";
import { colors, radius, spacing } from "@/theme";
import { Produk } from "@/types/produk";
import { formatHarga } from "@/utils/produk";

type Props = {
  produk: Produk[];
  onPress: (produk: Produk) => void;
};

export default function RekomendasiProduk({ produk, onPress }: Props) {
  return (
    <View style={styles.wrapper}>
      <View style={styles.header}>
        <Text style={styles.title}>Pilihan Belanjaan Pasar saat ini</Text>
      </View>

      <View style={styles.list}>
        {produk.map((item) => (
          <Pressable
            key={item.id}
            style={styles.card}
            onPress={() => onPress(item)}
          >
            <GambarProduk gambar={item.gambar} style={styles.image} fit="contain" />
            <Text style={styles.price}>{formatHarga(item.harga)}</Text>
            <Text style={styles.name} numberOfLines={3}>
              {item.nama}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginTop: spacing.md,
  },
  header: {
    marginHorizontal: spacing.lg,
    backgroundColor: colors.white,
    borderRadius: radius.md,
    paddingVertical: 9,
    paddingHorizontal: spacing.md,
    alignItems: "center",
  },
  title: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.text,
  },
  list: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: spacing.sm,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
    columnGap: spacing.sm,
    rowGap: spacing.sm,
  },
  card: {
    width: "31.5%",
    backgroundColor: colors.white,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    padding: 6,
  },
  image: {
    width: "100%",
    height: 104,
    aspectRatio: undefined,
    borderRadius: 6,
    backgroundColor: colors.white,
  },
  price: {
    fontSize: 12,
    fontWeight: "800",
    color: colors.dark,
    marginTop: 5,
  },
  name: {
    fontSize: 12,
    lineHeight: 14,
    color: colors.text,
    marginTop: 4,
    minHeight: 42,
  },
});
