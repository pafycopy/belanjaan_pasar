import { StyleSheet, Text, View } from "react-native";
import { colors, radius, spacing } from "@/theme";
import { TEKS } from "@/data/teks";
import { formatSisaWaktu } from "@/utils/pembayaran";

type Props = {
  sisaDetik: number;
  bank: string; // mis. "BCA"
};

const T = TEKS.pembayaran.batas;

// Kartu paling atas: batas waktu transfer + hitung mundur
export default function BatasBayar({ sisaDetik, bank }: Props) {
  const habis = sisaDetik <= 0;

  return (
    <View style={[styles.kartu, habis && styles.kartuHabis]}>
      <View style={styles.kiri}>
        <Text style={[styles.label, habis && styles.labelHabis]}>{T.label}</Text>
        <Text style={styles.judul}>{habis ? T.habis : T.menunggu(bank)}</Text>
        {habis ? <Text style={styles.pesan}>{T.habisPesan}</Text> : null}
      </View>

      <View style={styles.kanan}>
        <Text style={styles.sisa}>{T.sisa}</Text>
        <Text style={styles.waktu}>{formatSisaWaktu(sisaDetik)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  kartu: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.md,
    backgroundColor: colors.accentSoftStrong,
    borderRadius: radius.lg,
    padding: spacing.lg,
  },
  kartuHabis: { backgroundColor: colors.dangerSoft },
  kiri: { flex: 1, gap: 4 },
  label: { fontSize: 10, fontWeight: "700", letterSpacing: 0.4, textTransform: "uppercase", color: colors.brown },
  labelHabis: { color: colors.danger },
  judul: { fontSize: 18, fontWeight: "800", color: colors.text },
  pesan: { fontSize: 12, lineHeight: 17, color: colors.textSoft, marginTop: 2 },
  kanan: { alignItems: "center" },
  sisa: { fontSize: 11, color: colors.textSoft },
  waktu: { fontSize: 22, fontWeight: "800", color: colors.danger, marginTop: 2, fontVariant: ["tabular-nums"] },
});
