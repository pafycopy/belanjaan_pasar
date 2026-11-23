import { Pressable, StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import GambarProduk from "@/components/produk/gambarproduk";
import { TEKS } from "@/data/teks";
import { colors, radius, spacing } from "@/theme";
import { Produk } from "@/types/produk";
import { adaPromo, formatHarga, hematRupiah, persenDiskon } from "@/utils/produk";

const T = TEKS.katalog;

// Lebar kartu bila ditaruh di daftar yang digeser ke samping (Terlaris, Promo Hari Ini)
export const LEBAR_KARTU_GESER = 200;

type Props = {
  produk: Produk;
  onPress: () => void;
  favorit?: boolean;
  onToggleFavorit?: () => void; // bila diisi, tombol hati tampil
  style?: StyleProp<ViewStyle>; // mis. lebar kartu
};

/**
 * Kartu produk katalog: foto persegi, nama + tombol hati, pilihan ukuran (hijau miring),
 * harga, lalu toko dan rating di bagian bawah.
 * Bila promo (produk.hargaCoret > harga): muncul lencana "Diskon N %", harga coret, dan "Hemat Rp ...".
 */
export default function KartuProduk({ produk, onPress, favorit = false, onToggleFavorit, style }: Props) {
  const promo = adaPromo(produk);
  const varian = produk.varian?.join(" - ");

  return (
    <Pressable
      style={({ pressed }) => [styles.kartu, style, pressed && styles.ditekan]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={T.lihatProduk(produk.nama)}
    >
      <GambarProduk gambar={produk.gambar} style={styles.gambar} fit="contain" />

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
            <Ionicons
              name={favorit ? "heart" : "heart-outline"}
              size={22}
              color={favorit ? colors.danger : colors.textStrong}
            />
          </Pressable>
        ) : null}
      </View>

      {varian ? (
        <Text style={styles.varian} numberOfLines={1}>
          {varian}
        </Text>
      ) : null}

      <View style={styles.garis} />

      {/* "Rp" dan angka selalu satu baris; angka mengecil sendiri bila lencana diskon memakan tempat */}
      <View style={styles.barisHarga}>
        <Text style={styles.harga} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.7}>
          {formatHarga(produk.harga)}
        </Text>
        {promo ? (
          <View style={styles.lencanaDiskon}>
            <Text style={styles.lencanaDiskonTeks}>{T.diskon(persenDiskon(produk))}</Text>
          </View>
        ) : null}
      </View>

      {promo ? (
        <View style={styles.barisHemat}>
          <Text style={styles.hargaCoret} numberOfLines={1}>
            {formatHarga(produk.hargaCoret ?? 0)}
          </Text>
          <Text style={styles.hemat} numberOfLines={1}>
            {T.hemat(formatHarga(hematRupiah(produk)))}
          </Text>
        </View>
      ) : null}

      <View style={styles.footer}>
        {produk.toko ? (
          <Text style={styles.toko} numberOfLines={1}>
            {produk.toko}
          </Text>
        ) : (
          <View style={styles.tokoKosong} />
        )}
        {produk.rating != null ? (
          <View style={styles.rating}>
            <Ionicons name="star" size={14} color={colors.gold} />
            <Text style={styles.ratingTeks}>{produk.rating.toFixed(1)}</Text>
            {produk.jumlahUlasan != null ? (
              <Text style={styles.ulasan} numberOfLines={1}>
                {T.ulasan(produk.jumlahUlasan)}
              </Text>
            ) : null}
          </View>
        ) : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  kartu: {
    width: "49.5%",
    backgroundColor: colors.white,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  ditekan: { opacity: 0.92 },
  gambar: { aspectRatio: 1, borderRadius: radius.lg, backgroundColor: colors.white },
  barisNama: { flexDirection: "row", alignItems: "flex-start", marginTop: spacing.md, minHeight: 40 },
  nama: { flex: 1, color: colors.textStrong, fontSize: 14, lineHeight: 20, fontWeight: "700" },
  tombolFavorit: { marginLeft: spacing.sm, padding: 1 },
  varian: { marginTop: 2, color: colors.dark, fontSize: 11, fontStyle: "italic" },
  garis: { height: 1, backgroundColor: colors.border, marginTop: spacing.md },
  barisHarga: { flexDirection: "row", alignItems: "center", gap: spacing.sm, marginTop: spacing.md },
  harga: { flexShrink: 1, color: colors.primary, fontSize: 18, fontWeight: "800", fontVariant: ["tabular-nums"] },
  lencanaDiskon: { backgroundColor: colors.dangerSoft, borderRadius: radius.sm, paddingHorizontal: spacing.sm, paddingVertical: 3 },
  lencanaDiskonTeks: { color: colors.danger, fontSize: 10, fontWeight: "700" },
  barisHemat: { flexDirection: "row", alignItems: "center", gap: spacing.sm, marginTop: spacing.xs },
  hargaCoret: { flexShrink: 1, color: colors.muted, fontSize: 11, textDecorationLine: "line-through" },
  hemat: { flexShrink: 1, color: colors.primary, fontSize: 11, fontWeight: "700" },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.sm,
    marginTop: "auto",
    paddingTop: spacing.md,
  },
  toko: { flex: 1, color: colors.textStrong, fontSize: 11, fontWeight: "700" },
  tokoKosong: { flex: 1 },
  rating: { flexDirection: "row", alignItems: "center", gap: 3 },
  ratingTeks: { color: colors.textStrong, fontSize: 12, fontWeight: "800" },
  ulasan: { color: colors.muted, fontSize: 9 },
});
