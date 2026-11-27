import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing } from "@/theme";
import { SATUAN_BAWAAN } from "@/data/produk";
import { TEKS } from "@/data/teks";
import { Produk } from "@/types/produk";
import { formatHarga } from "@/utils/produk";
import { usePenilaian } from "@/context/penilaian";

type Props = {
  produk: Produk;
  favorit: boolean;
  onToggleFavorit: () => void;
};

export default function InfoProduk({ produk, favorit, onToggleFavorit }: Props) {
  const { ringkasan } = usePenilaian();
  const penilaianAktif = ringkasan(produk.id);

  return (
    <View style={styles.wrap}>
      <View style={styles.baris}>
        <Text style={styles.nama}>{produk.nama}</Text>
        <Pressable onPress={onToggleFavorit} hitSlop={10} accessibilityRole="button" accessibilityLabel={favorit ? "Hapus dari favorit" : "Tambah ke favorit"}>
          <Ionicons name={favorit ? "heart" : "heart-outline"} size={26} color={colors.danger} />
        </Pressable>
      </View>

      <View style={styles.baris}>
        <View style={styles.ringkas}>
          {produk.ringkas?.map((teks) => (
            <Text key={teks} style={styles.ringkasText}>{teks}</Text>
          ))}
        </View>
        {produk.stok != null ? (
          <View style={styles.stok}>
            <Ionicons name="cart" size={18} color={colors.green} />
            <Text style={styles.stokText}>{TEKS.produk.stok(produk.stok, produk.satuan ?? SATUAN_BAWAAN)}</Text>
          </View>
        ) : null}
      </View>

      <Text style={styles.harga}>{formatHarga(produk.harga)}</Text>

      {penilaianAktif ? (
        <View style={styles.ratingWrap}>
          <View style={styles.bintang}>
            {[1, 2, 3, 4, 5].map((n) => (
              <Ionicons
                key={n}
                name={n <= Math.round(penilaianAktif.rating) ? "star" : "star-outline"}
                size={16}
                color={colors.gold}
              />
            ))}
          </View>
          <Text style={styles.ratingAngka}>{penilaianAktif.rating.toFixed(1)}</Text>
          <Text style={styles.jumlahUlasan}>({penilaianAktif.jumlahUlasan} ulasan)</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: spacing.sm },
  baris: { flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between", gap: spacing.md },
  nama: { flex: 1, fontSize: 17, fontWeight: "600", color: colors.text, lineHeight: 24 },
  ringkas: { flex: 1 },
  ringkasText: { fontSize: 14, lineHeight: 20, color: colors.textSoft },
  stok: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: spacing.xs },
  stokText: { fontSize: 14, color: colors.textSoft },
  harga: { fontSize: 26, fontWeight: "700", color: colors.dark, marginTop: spacing.md },
  ratingWrap: { flexDirection: "row", alignItems: "center", gap: 6 },
  bintang: { flexDirection: "row", gap: 2 },
  ratingAngka: { fontSize: 13, fontWeight: "800", color: colors.textStrong },
  jumlahUlasan: { fontSize: 12, color: colors.textSoft },
});
