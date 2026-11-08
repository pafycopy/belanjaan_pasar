import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import GambarProduk from "@/components/produk/gambarproduk";
import { TEKS } from "@/data/teks";
import { colors, radius, spacing } from "@/theme";
import { Produk } from "@/types/produk";
import { formatHarga } from "@/utils/produk";

type Props = {
  produk: Produk;
  onPress: () => void;   // buka detail produk
  onTambah: () => void;  // tombol "+": tambah ke keranjang
};

// Kartu produk ringkas untuk daftar yang digeser ke samping (mis. "Produk Favorit Anda")
export default function KartuProdukRingkas({ produk, onPress, onTambah }: Props) {
  return (
    <Pressable style={styles.kartu} onPress={onPress}>
      <GambarProduk gambar={produk.gambar} style={styles.gambar} fit="contain" />

      <Text style={styles.nama} numberOfLines={2}>
        {produk.nama}
      </Text>
      <Text style={styles.deskripsi} numberOfLines={1}>
        {produk.ringkas?.[0] ?? ""}
      </Text>

      <View style={styles.garis} />

      <View style={styles.bawah}>
        <Text style={styles.harga}>{formatHarga(produk.harga)}</Text>
        <Pressable
          onPress={onTambah}
          hitSlop={8}
          style={styles.tambah}
          accessibilityRole="button"
          accessibilityLabel={TEKS.katalog.tambahAksesibilitas(produk.nama)}
        >
          <Ionicons name="add" size={20} color={colors.white} />
        </Pressable>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  kartu: {
    width: 190,
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
  },
  gambar: { aspectRatio: 1.2, borderRadius: radius.sm },
  nama: { fontSize: 13, fontWeight: "700", color: colors.text, lineHeight: 18, marginTop: spacing.sm, minHeight: 36 },
  deskripsi: { fontSize: 11, color: colors.muted, marginTop: 2, minHeight: 16 },
  garis: { height: 1, backgroundColor: colors.border, marginTop: spacing.sm },
  bawah: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: spacing.sm },
  harga: { fontSize: 16, fontWeight: "800", color: colors.dark },
  tambah: {
    width: 34,
    height: 34,
    borderRadius: radius.md,
    backgroundColor: colors.dark,
    alignItems: "center",
    justifyContent: "center",
  },
});
