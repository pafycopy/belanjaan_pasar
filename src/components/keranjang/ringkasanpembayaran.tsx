import { StyleSheet, Text, View } from "react-native";
import Button from "@/components/ui/button";
import { colors } from "@/theme";
import { TEKS } from "@/data/teks";
import { formatHarga } from "@/utils/produk";

type Props = { total: number; onBayar: () => void; disabled?: boolean };

// Isi bar bawah: total akhir di kiri, tombol Bayar di kanan (latar bar disediakan FooterBar)
export default function RingkasanPembayaran({ total, onBayar, disabled }: Props) {
  return (
    <View style={styles.wrap}>
      <View>
        <Text style={styles.label}>{TEKS.keranjang.ringkasan.total}</Text>
        <Text style={styles.total}>{formatHarga(total)}</Text>
      </View>
      <Button
        label={TEKS.keranjang.ringkasan.bayar}
        size="md"
        onPress={onBayar}
        disabled={disabled}
        style={styles.tombol}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  label: { fontSize: 11, color: colors.muted },
  total: { fontSize: 18, fontWeight: "800", color: colors.dark, marginTop: 2 },
  tombol: { minWidth: 110 },
});
