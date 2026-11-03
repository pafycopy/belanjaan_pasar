import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
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

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.list}
      >
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
      </ScrollView>
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
    fontSize: 9,
    fontWeight: "700",
    color: colors.text,
  },
  list: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
    gap: spacing.sm,
  },
  card: {
    width: 108,
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
    fontSize: 10,
    fontWeight: "800",
    color: colors.dark,
    marginTop: 5,
  },
  name: {
    fontSize: 8,
    lineHeight: 12,
    color: colors.text,
    marginTop: 4,
    minHeight: 36,
  },
});
