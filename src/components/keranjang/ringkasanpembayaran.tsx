import { StyleSheet, Text, View } from "react-native";
import Button from "@/components/ui/button";
import { colors, spacing } from "@/theme";
import { TEKS } from "@/data/teks";
import { formatHarga } from "@/utils/produk";

type Props = {
  total?: number;        // kosong = belum ada produk dipilih: total disembunyikan, diganti petunjuk
  label: string;         // teks tombol, mis. "Checkout (2)" atau "Bayar"
  onPress: () => void;
  disabled?: boolean;
};

// Isi bar bawah: total di kiri, tombol aksi di kanan (latar bar disediakan FooterBar)
export default function RingkasanPembayaran({ total, label, onPress, disabled }: Props) {
  const T = TEKS.keranjang.ringkasan;

  return (
    <View style={styles.wrap}>
      <View style={styles.kiri}>
        {total !== undefined ? (
          <>
            <Text style={styles.label}>{T.total}</Text>
            <Text style={styles.total}>{formatHarga(total)}</Text>
          </>
        ) : (
          <Text style={styles.petunjuk}>{T.belumDipilih}</Text>
        )}
      </View>

      <Button label={label} size="md" onPress={onPress} disabled={disabled} style={styles.tombol} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: spacing.md },
  kiri: { flex: 1 },
  label: { fontSize: 11, color: colors.muted },
  total: { fontSize: 18, fontWeight: "800", color: colors.dark, marginTop: 2 },
  petunjuk: { fontSize: 12, color: colors.muted },
  tombol: { minWidth: 110 },
});
