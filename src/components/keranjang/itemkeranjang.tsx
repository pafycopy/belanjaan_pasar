import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";
import GambarProduk from "@/components/produk/gambarproduk";
import { colors, radius, spacing } from "@/theme";
import { ItemKeranjang } from "@/types/keranjang";
import { Produk } from "@/types/produk";
import { formatHarga } from "@/utils/produk";

type Props = {
  item: ItemKeranjang;
  produk: Produk;
  onKurang: () => void;
  onTambah: () => void;
  onHapus: () => void;
};

export default function ItemKeranjangCard({ item, produk, onKurang, onTambah, onHapus }: Props) {
  const potongan = produk.opsiPotongan?.find((o) => o.id === item.potonganId);

  return (
    <View style={styles.card}>
      <GambarProduk gambar={produk.gambar} style={styles.gambar} fit="contain" />

      <View style={styles.info}>
        <View style={styles.namaRow}>
          <Text style={styles.nama} numberOfLines={2}>{produk.nama}</Text>
          <Pressable onPress={onHapus} hitSlop={8}>
            <Ionicons name="close" size={18} color={colors.muted} />
          </Pressable>
        </View>

        <Text style={styles.potongan}>{potongan ? potongan.judul : "Produk segar"}</Text>
        <Text style={styles.harga}>{formatHarga(item.hargaSatuan)}</Text>

        <View style={styles.footer}>
          <Text style={styles.satuan}>{produk.satuan ?? "pcs"}</Text>
          <View style={styles.stepper}>
            <Pressable style={styles.stepButton} onPress={onKurang} hitSlop={4}>
              <Ionicons name="remove" size={15} color={colors.dark} />
            </Pressable>
            <Text style={styles.jumlah}>{item.jumlah}</Text>
            <Pressable style={styles.stepButton} onPress={onTambah} hitSlop={4}>
              <Ionicons name="add" size={15} color={colors.dark} />
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: spacing.sm,
    minHeight: 92,
    borderWidth: 1,
    borderColor: colors.border,
  },
  gambar: { width: 72, height: 72, borderRadius: radius.md },
  info: { flex: 1, marginLeft: spacing.sm },
  namaRow: { flexDirection: "row", alignItems: "flex-start", gap: 4 },
  nama: { flex: 1, fontSize: 12, lineHeight: 16, fontWeight: "600", color: colors.text },
  potongan: { fontSize: 10, color: colors.muted, marginTop: 2 },
  harga: { fontSize: 13, fontWeight: "700", color: colors.primary, marginTop: 3 },
  footer: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 4 },
  satuan: { fontSize: 10, color: colors.muted },
  stepper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.accentSoft,
    borderRadius: radius.sm,
    minHeight: 28,
  },
  stepButton: { width: 28, height: 28, alignItems: "center", justifyContent: "center" },
  jumlah: { minWidth: 22, textAlign: "center", fontSize: 11, fontWeight: "600", color: colors.text },
});
