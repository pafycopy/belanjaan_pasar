import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";
import GambarProduk from "@/components/produk/gambarproduk";
import Radio from "@/components/ui/radio";
import { TEKS } from "@/data/teks";
import { colors, radius, spacing } from "@/theme";
import { ItemKeranjang } from "@/types/keranjang";
import { Produk } from "@/types/produk";
import { formatHarga } from "@/utils/produk";

type Props = {
  item: ItemKeranjang;
  produk: Produk;
  dipilih: boolean;
  onPilih: () => void;
  onKurang: () => void;
  onTambah: () => void;
  onHapus: () => void;
};

export default function ItemKeranjangCard({ item, produk, dipilih, onPilih, onKurang, onTambah, onHapus }: Props) {
  return (
    <View style={styles.baris}>
      <Pressable
        onPress={onPilih}
        style={styles.radio}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: dipilih }}
        accessibilityLabel={TEKS.keranjang.pilihProduk(produk.nama)}
        hitSlop={6}
      >
        <Radio dipilih={dipilih} />
      </Pressable>

      <Pressable onPress={onPilih} style={styles.card}>
        <GambarProduk gambar={produk.gambar} style={styles.gambar} fit="contain" />

        <View style={styles.info}>
          <View>
            <View style={styles.namaRow}>
              <Text style={styles.nama} numberOfLines={2}>
                {produk.nama}
              </Text>
              <Pressable onPress={onHapus} hitSlop={8}>
                <Ionicons name="close" size={20} color={colors.textSoft} />
              </Pressable>
            </View>
            <Text style={styles.potongan}>{item.catatan?.trim() ? `Catatan: ${item.catatan.trim()}` : TEKS.keranjang.produkSegar}</Text>
          </View>

          <View style={styles.bawah}>
            <Text style={styles.harga}>{formatHarga(item.hargaSatuan)}</Text>

            <View style={styles.stepper}>
              <Pressable style={styles.stepButton} onPress={onKurang} hitSlop={4}>
                <Ionicons name="remove" size={16} color={colors.textSoft} />
              </Pressable>
              <Text style={styles.jumlah}>{item.jumlah}</Text>
              <Pressable style={styles.stepButton} onPress={onTambah} hitSlop={4}>
                <Ionicons name="add" size={16} color={colors.textSoft} />
              </Pressable>
            </View>
          </View>
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  baris: { flexDirection: "row", alignItems: "stretch" },
  radio: {
    width: 28,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.sm,
  },
  card: {
    flex: 1,
    minWidth: 0,
    flexDirection: "row",
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 0,
  },
  gambar: { width: 72, height: 72, borderRadius: radius.sm, backgroundColor: colors.white },
  info: { flex: 1, marginLeft: spacing.md, justifyContent: "space-between", gap: spacing.sm },
  namaRow: { flexDirection: "row", alignItems: "flex-start", gap: spacing.xs },
  nama: { flex: 1, fontSize: 13, lineHeight: 18, fontWeight: "500", color: colors.text },
  potongan: { fontSize: 12, color: colors.dark, marginTop: 2 },
  bawah: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  harga: { fontSize: 16, fontWeight: "700", color: colors.dark },
  stepper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.accentSoftStrong,
    borderRadius: radius.md,
    minHeight: 30,
  },
  stepButton: { width: 30, height: 30, alignItems: "center", justifyContent: "center" },
  jumlah: { minWidth: 22, textAlign: "center", fontSize: 13, fontWeight: "500", color: colors.text },
});
