import { FlatList, StyleSheet, Text, View } from "react-native";
import KartuProduk, { LEBAR_KARTU_GESER } from "@/components/produk/kartuproduk";
import Pill from "@/components/ui/pill";
import { TEKS } from "@/data/teks";
import { colors, radius, spacing } from "@/theme";
import { Produk } from "@/types/produk";

const T = TEKS.katalog;

type Props = {
  produk: readonly Produk[];          // hanya produk yang sedang promo
  isFavorit: (produkId: string) => boolean;
  onToggleFavorit: (produkId: string) => void;
  onPressProduk: (produkId: string) => void;
  sampai?: string;                    // mis. "s/d 10.00 WIB"
};

const Pemisah = () => <View style={styles.pemisah} />;

/** Panel hijau "Promo Hari Ini": kartu produk promo yang digeser ke samping. Tanpa promo, panel disembunyikan. */
export default function PromoHariIni({ produk, isFavorit, onToggleFavorit, onPressProduk, sampai }: Props) {
  if (produk.length === 0) return null;

  return (
    <View style={styles.panel}>
      <View style={styles.header}>
        <Text style={styles.judul}>{T.promoJudul}</Text>
        {sampai ? <Pill icon="alarm-outline" label={sampai} /> : null}
      </View>

      <FlatList
        horizontal
        data={produk}
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
        ItemSeparatorComponent={Pemisah}
        renderItem={({ item }) => (
          <KartuProduk
            produk={item}
            style={styles.kartu}
            favorit={isFavorit(item.id)}
            onToggleFavorit={() => onToggleFavorit(item.id)}
            onPress={() => onPressProduk(item.id)}
          />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    marginHorizontal: 14,
    padding: spacing.md,
    backgroundColor: colors.heroB,
    borderRadius: radius.xl,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.md,
  },
  judul: { color: colors.white, fontSize: 17, fontWeight: "800" },
  kartu: { width: LEBAR_KARTU_GESER, marginBottom: 0 },
  pemisah: { width: spacing.sm },
});
