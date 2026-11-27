import { Pressable, StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import GambarProduk from "@/components/produk/gambarproduk";
import { TEKS } from "@/data/teks";
import { colors, radius, spacing } from "@/theme";
import { Produk } from "@/types/produk";
import { adaPromo, formatHarga, hematRupiah } from "@/utils/produk";
import { usePenilaian } from "@/context/penilaian";

// Lebar kartu bila ditaruh di daftar yang digeser ke samping (Terlaris, Promo Hari Ini).
export const LEBAR_KARTU_GESER = 190;

type Props = {
  produk: Produk;
  onPress: () => void;
  favorit?: boolean;
  onToggleFavorit?: () => void;
  style?: StyleProp<ViewStyle>;
};

/**
 * Kartu katalog bersama untuk katalog reguler, Promo Hari Ini, dan Produk Terlaris.
 * Urutan konten dijaga konsisten: gambar, nama/favorit, varian, harga, lalu toko/rating.
 */
export default function KartuProduk({
  produk,
  onPress,
  favorit = false,
  onToggleFavorit,
  style,
}: Props) {
  const promo = adaPromo(produk);
  const { ringkasan } = usePenilaian();
  const penilaianAktif = ringkasan(produk.id);
  const ratingTampil = penilaianAktif?.rating ?? produk.rating;
  const jumlahUlasanTampil = penilaianAktif?.jumlahUlasan ?? produk.jumlahUlasan;
  // Fallback data demo untuk katalog Ayam Broiler selama backend belum tersedia.
  const varianProduk = produk.varian?.length
    ? produk.varian
    : ["ayam-bakar", "ayam-kfc", "ayam-potong-8", "ayam-jumbo"].includes(produk.id)
      ? ["1 Ekor", "2 Ekor", "3 Ekor", "4 Ekor", "5 Ekor"]
      : [];
  const labelVarian = varianProduk.length > 2
    ? `${varianProduk[0]} - ${varianProduk[varianProduk.length - 1]}`
    : varianProduk.join(" - ");
  const persenDiskon = promo && produk.hargaCoret
    ? Math.ceil(((produk.hargaCoret - produk.harga) / produk.hargaCoret) * 100)
    : 0;

  return (
    <Pressable
      style={({ pressed }) => [styles.kartu, style, pressed && styles.ditekan]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={TEKS.katalog.lihatProduk(produk.nama)}
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
            accessibilityLabel={favorit ? TEKS.katalog.favoritHapus(produk.nama) : TEKS.katalog.favoritTambah(produk.nama)}
          >
            <Ionicons name={favorit ? "heart" : "heart-outline"} size={25} color={favorit ? colors.danger : colors.textStrong} />
          </Pressable>
        ) : null}
      </View>

      {labelVarian ? (
        <Text style={styles.varian} numberOfLines={1}>
        {labelVarian}
        </Text>
      ) : null}

      <View style={styles.pemisah} />

      <View style={styles.bagianHarga}>
        <View style={styles.barisHarga}>
          <Text
            style={[styles.harga, promo && styles.hargaPromo]}
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={0.78}
          >
            {formatHarga(produk.harga)}
          </Text>
          {promo ? (
            <View style={styles.badgeDiskon}>
              <Text style={styles.teksBadgeDiskon}>Diskon {persenDiskon}%</Text>
            </View>
          ) : null}
        </View>
        {promo ? (
          <View style={styles.infoDiskon}>
            <Text
              style={styles.hargaCoret}
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.75}
            >
              {formatHarga(produk.hargaCoret ?? 0)}
            </Text>
            <Text
              style={styles.hemat}
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.7}
            >
              Hemat {formatHarga(hematRupiah(produk))}
            </Text>
          </View>
        ) : null}
      </View>

      <View style={styles.footer}>
        <Text style={styles.toko} numberOfLines={1}>
          {produk.toko ?? ""}
        </Text>
        {ratingTampil != null ? (
          <View style={styles.rating}>
            <Ionicons name="star" size={16} color={colors.gold} />
            <Text style={styles.ratingTeks}>{ratingTampil.toFixed(1)}</Text>
            {jumlahUlasanTampil != null ? (
              <Text style={styles.jumlahUlasan}>({jumlahUlasanTampil} ulasan)</Text>
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
    minHeight: 300,
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.sm,
    marginBottom: spacing.md,
  },
  ditekan: { opacity: 0.92 },
  gambar: {
    aspectRatio: 1,
    borderRadius: radius.md,
    backgroundColor: colors.white,
  },
  barisNama: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: spacing.sm,
    minHeight: 42,
    gap: spacing.xs,
  },
  nama: {
    flex: 1,
    color: colors.textStrong,
    fontSize: 15,
    lineHeight: 19,
    fontWeight: "800",
  },
  tombolFavorit: { padding: 1, marginTop: -2 },
  varian: {
    color: colors.primary,
    fontSize: 12,
    lineHeight: 17,
    fontStyle: "italic",
    marginTop: spacing.xs,
  },
  pemisah: {
    height: 1,
    backgroundColor: colors.border,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  bagianHarga: { minHeight: 54 },
  barisHarga: {
    minHeight: 29,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  harga: {
    flex: 1,
    minWidth: 0,
    color: colors.primary,
    fontSize: 22,
    lineHeight: 27,
    fontWeight: "900",
    flexShrink: 1,
  },
  hargaPromo: { color: colors.primary },
  badgeDiskon: {
    flexShrink: 0,
    backgroundColor: "#F6D9D9",
    borderRadius: 6,
    paddingHorizontal: 7,
    paddingVertical: 3,
    marginLeft: "auto",
  },
  teksBadgeDiskon: { color: "#C93636", fontSize: 10, lineHeight: 13, fontWeight: "600" },
  infoDiskon: {
    flexDirection: "row",
    flexWrap: "nowrap",
    alignItems: "center",
    gap: 8,
    marginTop: 2,
    minWidth: 0,
    width: "100%",
  },
  hargaCoret: {
    flexShrink: 1,
    minWidth: 0,
    color: "#737373",
    fontSize: 12,
    lineHeight: 18,
    fontWeight: "500",
    textDecorationLine: "line-through",
    textDecorationColor: "#737373",
  },
  hemat: {
    flexShrink: 1,
    minWidth: 0,
    color: colors.primary,
    fontSize: 12,
    lineHeight: 18,
    fontWeight: "600",
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.xs,
    marginTop: "auto",
    paddingTop: spacing.md,
    minHeight: 38,
  },
  toko: { flex: 1, minWidth: 0, color: colors.textStrong, fontSize: 12, fontWeight: "700" },
  rating: { flexDirection: "row", alignItems: "center", gap: 3, flexShrink: 0 },
  ratingTeks: { color: colors.textStrong, fontSize: 13, fontWeight: "800" },
  jumlahUlasan: { color: colors.textSoft, fontSize: 9 },
});
