import { Pressable, StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import GambarProduk from "@/components/produk/gambarproduk";
import { SATUAN_BAWAAN } from "@/data/produk";
import { TEKS } from "@/data/teks";
import { colors, radius, spacing } from "@/theme";
import { Produk } from "@/types/produk";
import { useTerjualHariIni } from "@/hooks/useterjual";
import { adaPromo, formatHarga, hematRupiah } from "@/utils/produk";
import { formatJumlahTerjual } from "@/utils/terlaris";

const T = TEKS.katalog;

// Lebar kartu bila ditaruh di daftar yang digeser ke samping (Terlaris, Promo Hari Ini)
export const LEBAR_KARTU_GESER = 190;

type Props = {
  produk: Produk;
  onPress: () => void;
  favorit?: boolean;
  onToggleFavorit?: () => void; // bila diisi, tombol hati tampil
  style?: StyleProp<ViewStyle>; // mis. lebar kartu
};

/**
 * Kartu produk dengan dua tampilan:
 * - promo (produk.hargaCoret > harga): label PROMO HARI INI, harga coret, dan badge "Hemat"
 * - biasa: jumlah terjual hari ini (dihitung dari pesanan yang sudah dibayar) dan rating (bila ada)
 */
export default function KartuProduk({ produk, onPress, favorit = false, onToggleFavorit, style }: Props) {
  const promo = adaPromo(produk);
  const terjual = useTerjualHariIni(produk.id);
  const adaInfo = terjual > 0 || produk.rating != null;

  return (
    <Pressable
      style={({ pressed }) => [styles.kartu, style, pressed && styles.ditekan]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={T.lihatProduk(produk.nama)}
    >
      <GambarProduk gambar={produk.gambar} style={styles.gambar} fit="contain" />

      {promo ? <Text style={styles.labelPromo}>{T.promoLabel}</Text> : null}

      <View style={styles.barisNama}>
        <Text style={styles.nama} numberOfLines={2}>
          {produk.nama}
        </Text>
        {onToggleFavorit ? (
          <Pressable
            onPress={(event) => {
              event.stopPropagation();
              onToggleFavorit();
            }}
            hitSlop={8}
            style={styles.tombolFavorit}
            accessibilityRole="button"
            accessibilityLabel={favorit ? T.favoritHapus(produk.nama) : T.favoritTambah(produk.nama)}
          >
            <Ionicons name={favorit ? "heart" : "heart-outline"} size={21} color={colors.danger} />
          </Pressable>
        ) : null}
      </View>

      {promo ? (
        <View style={styles.barisInfo}>
          <Text style={styles.hargaCoret}>{formatHarga(produk.hargaCoret ?? 0)}</Text>
          <View style={styles.badgeHemat}>
            <Text style={styles.badgeHematTeks}>{T.hemat(formatHarga(hematRupiah(produk)))}</Text>
          </View>
        </View>
      ) : adaInfo ? (
        <View style={[styles.barisInfo, styles.barisInfoSebar]}>
          {terjual > 0 ? (
            <View style={styles.pillTerjual}>
              <Ionicons name="checkmark-circle" size={12} color={colors.dark} />
              <Text style={styles.pillTerjualTeks} numberOfLines={1}>
                {T.terjual(formatJumlahTerjual(terjual), produk.satuan ?? SATUAN_BAWAAN)}
              </Text>
            </View>
          ) : (
            <View />
          )}
          {produk.rating != null ? (
            <View style={styles.rating}>
              <Text style={styles.ratingTeks}>{produk.rating.toFixed(1)}</Text>
              <Ionicons name="star" size={13} color={colors.gold} />
            </View>
          ) : null}
        </View>
      ) : null}

      <View style={styles.barisHarga}>
        <Text style={styles.harga}>{formatHarga(produk.harga)}</Text>
        {produk.toko ? (
          <Text style={styles.toko} numberOfLines={2}>
            {produk.toko}
          </Text>
        ) : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  kartu: {
    width: "48.5%",
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.sm,
    marginBottom: spacing.md,
  },
  ditekan: { opacity: 0.92 },
  gambar: { aspectRatio: 1.1, borderRadius: radius.sm, backgroundColor: colors.white },
  labelPromo: {
    marginTop: spacing.sm,
    color: colors.dark,
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.25,
  },
  barisNama: { flexDirection: "row", alignItems: "flex-start", marginTop: spacing.xs, minHeight: 40 },
  nama: { flex: 1, color: colors.text, fontSize: 14, lineHeight: 20, fontWeight: "700" },
  tombolFavorit: { marginLeft: spacing.xs, padding: 1 },
  barisInfo: { flexDirection: "row", alignItems: "center", gap: spacing.sm, marginTop: spacing.xs },
  barisInfoSebar: { justifyContent: "space-between" },
  hargaCoret: { color: colors.muted, fontSize: 12, textDecorationLine: "line-through" },
  badgeHemat: {
    backgroundColor: colors.peachSoft,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    flexShrink: 1,
  },
  badgeHematTeks: { color: colors.brown, fontSize: 10, fontWeight: "800" },
  pillTerjual: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    flexShrink: 1,
    backgroundColor: colors.primarySoft,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
  },
  pillTerjualTeks: { flexShrink: 1, color: colors.text, fontSize: 10, fontWeight: "600" },
  rating: { flexDirection: "row", alignItems: "center", gap: 3 },
  ratingTeks: { color: colors.text, fontSize: 13, fontWeight: "800" },
  barisHarga: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  harga: { color: colors.dark, fontSize: 18, fontWeight: "800" },
  toko: { flexShrink: 1, color: colors.text, fontSize: 10, textAlign: "right" },
});
