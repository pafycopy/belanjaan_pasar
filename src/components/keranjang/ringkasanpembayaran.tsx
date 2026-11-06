import { Pressable, StyleSheet, Text, View } from "react-native";
import { TEKS } from "@/data/teks";
import { colors, radius, spacing } from "@/theme";
import { formatHarga } from "@/utils/produk";

type Props = { total: number; onBayar: () => void; disabled?: boolean };

export default function RingkasanPembayaran({ total, onBayar, disabled }: Props) {
  return (
    <View style={styles.wrap}>
      <View>
        <Text style={styles.label}>{TEKS.keranjang.ringkasan.total}</Text>
        <Text style={styles.total}>{formatHarga(total)}</Text>
      </View>
      <Pressable style={[styles.button, disabled && styles.disabled]} onPress={onBayar} disabled={disabled}>
        <Text style={styles.buttonText}>{TEKS.keranjang.ringkasan.bayar}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", backgroundColor: colors.white, borderTopWidth: 1, borderTopColor: colors.border, paddingHorizontal: spacing.lg, paddingTop: spacing.md },
  label: { fontSize: 9, color: colors.muted },
  total: { fontSize: 14, fontWeight: "800", color: colors.primary, marginTop: 1 },
  button: { minWidth: 78, height: 36, paddingHorizontal: spacing.lg, borderRadius: radius.md, backgroundColor: colors.primary, alignItems: "center", justifyContent: "center" },
  disabled: { opacity: 0.45 },
  buttonText: { color: colors.white, fontSize: 11, fontWeight: "700" },
});
