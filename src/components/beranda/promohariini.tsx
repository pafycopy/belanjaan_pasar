import { FlatList, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import KartuPromoProduk from "@/components/produk/kartupromoproduk";
import { useFavorit } from "@/context/favorit";
import { colors, radius, spacing } from "@/theme";
import { Produk } from "@/types/produk";

type Props = {
  produk: Produk[];
};

/** Panel hijau Promo Hari Ini dengan kartu produk yang dapat digeser horizontal. */
export default function PromoHariIni({ produk }: Props) {
  const router = useRouter();
  const { isFavorit, toggle } = useFavorit();

  const bukaDetailProduk = (produkId: string) => {
    router.push({
      pathname: "/produk/[id]",
      params: { id: produkId },
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.judul}>Promo Hari Ini</Text>
        <Text style={styles.subjudul}>Pilihan produk untuk belanja hari ini</Text>
      </View>

      {produk.length > 0 ? (
        <FlatList
          data={produk}
          horizontal
          keyExtractor={(item) => item.id}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.daftarProduk}
          ItemSeparatorComponent={() => <View style={styles.pemisah} />}
          renderItem={({ item }) => (
            <KartuPromoProduk
              produk={item}
              favorit={isFavorit(item.id)}
              onPress={() => bukaDetailProduk(item.id)}
              onToggleFavorit={() => void toggle(item.id)}
            />
          )}
        />
      ) : (
        <Text style={styles.kosong}>Belum ada produk untuk ditampilkan.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: spacing.md,
    marginTop: spacing.md,
    paddingVertical: spacing.md,
    backgroundColor: colors.primaryDeep,
    borderRadius: radius.card,
  },
  header: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
  },
  judul: {
    color: colors.white,
    fontSize: 17,
    fontWeight: "800",
  },
  subjudul: {
    color: "rgba(255,255,255,0.85)",
    fontSize: 11,
    marginTop: 3,
  },
  daftarProduk: {
    paddingHorizontal: spacing.md,
  },
  pemisah: {
    width: spacing.sm,
  },
  kosong: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.lg,
    color: colors.white,
    fontSize: 13,
  },
});
