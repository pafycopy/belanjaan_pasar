import { StyleSheet, Text, View } from "react-native";
import { colors, radius, spacing } from "@/theme";
import { TEKS } from "@/data/teks";
import { formatHarga } from "@/utils/produk";

type Props = {
  subtotal: number;
  ongkir: number | null;   // null = tanpa baris ongkir (ambil di toko)
  labelOngkir?: string;    // mis. "Radius 1–3 km"
  total: number;
};

const T = TEKS.keranjang.rincian;

function Baris({ label, nilai }: { label: string; nilai: string }) {
  return (
    <View style={styles.baris}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.nilai}>{nilai}</Text>
    </View>
  );
}

// Kartu "Ringkasan Pembayaran": rincian biaya dan total tagihan
export default function RincianPembayaran({ subtotal, ongkir, labelOngkir, total }: Props) {
  return (
    <View style={styles.kartu}>
      <Text style={styles.judul}>{T.judul}</Text>

      <View style={styles.rincian}>
        <Baris label={T.pesanan} nilai={formatHarga(subtotal)} />
        {ongkir !== null ? (
          <Baris label={T.ongkir(labelOngkir ?? "")} nilai={formatHarga(ongkir)} />
        ) : null}
      </View>

      <View style={styles.pemisah} />

      <View style={styles.baris}>
        <Text style={styles.totalLabel}>{T.total}</Text>
        <Text style={styles.totalNilai}>{formatHarga(total)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  kartu: { backgroundColor: colors.white, borderRadius: radius.lg, padding: spacing.lg },
  judul: { fontSize: 14, fontWeight: "700", color: colors.text },
  rincian: { gap: spacing.sm, marginTop: spacing.md },
  baris: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: spacing.md },
  label: { flex: 1, fontSize: 13, color: colors.textSoft },
  nilai: { fontSize: 12, fontWeight: "700", color: colors.text },
  pemisah: { height: 1, backgroundColor: colors.border, marginVertical: spacing.md },
  totalLabel: { fontSize: 16, fontWeight: "700", color: colors.text },
  totalNilai: { fontSize: 18, fontWeight: "800", color: colors.dark },
});
