import { StyleSheet, Text, View } from "react-native";
import { colors, radius, spacing } from "@/theme";

type Props = { beratGram: number; kapasitasKg?: number };

export default function KapasitasBerat({ beratGram, kapasitasKg = 50 }: Props) {
  const beratKg = beratGram / 1000;
  const persen = Math.min(beratKg / kapasitasKg, 1);
  const sisaKg = Math.max(kapasitasKg - beratKg, 0);

  return (
    <View style={styles.wrap}>
      <View style={styles.header}>
        <Text style={styles.label}>Kapasitas Berat Bersih</Text>
        <Text style={styles.nilai}>{beratKg.toFixed(1).replace(".0", "")} kg <Text style={styles.maks}>/ {kapasitasKg} kg</Text></Text>
      </View>
      <View style={styles.track}>
        <View style={[styles.progress, { width: `${persen * 100}%` }]} />
      </View>
      <View style={styles.footer}>
        <Text style={styles.tersedia}>✓ kapasitas tersedia</Text>
        <Text style={styles.sisa}>Sisa {sisaKg % 1 === 0 ? sisaKg : sisaKg.toFixed(1)} kg</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { backgroundColor: colors.white, paddingHorizontal: spacing.lg, paddingVertical: spacing.md },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end" },
  label: { fontSize: 10, fontWeight: "600", color: colors.text },
  nilai: { fontSize: 10, fontWeight: "700", color: colors.text },
  maks: { color: colors.muted, fontWeight: "500" },
  track: { height: 5, backgroundColor: colors.borderStrong, borderRadius: radius.sm, overflow: "hidden", marginTop: 7 },
  progress: { height: "100%", backgroundColor: colors.dark, borderRadius: radius.sm },
  footer: { flexDirection: "row", justifyContent: "space-between", marginTop: 5 },
  tersedia: { fontSize: 9, color: colors.primary, fontWeight: "600" },
  sisa: { fontSize: 9, color: colors.muted },
});
