import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";
import { colors, radius, spacing } from "@/theme";
import { KAPASITAS_KERANJANG_KG } from "@/data/keranjang";
import { TEKS } from "@/data/teks";
import { formatKg } from "@/utils/keranjang";

type Props = {
  beratGram: number;
  kapasitasKg?: number;
  melayang?: boolean; // true saat isi di bawahnya sudah tergulung: tampilkan garis pemisah
};

// Bar kapasitas berat bersih keranjang (di atas latar halaman, tanpa kartu)
export default function KapasitasBerat({ beratGram, kapasitasKg = KAPASITAS_KERANJANG_KG, melayang }: Props) {
  const T = TEKS.keranjang.kapasitas;
  const beratKg = beratGram / 1000;
  const persen = Math.min(beratKg / kapasitasKg, 1);
  const sisaKg = Math.max(kapasitasKg - beratKg, 0);
  const penuh = sisaKg === 0;
  const warnaStatus = penuh ? colors.danger : colors.dark;

  return (
    <View style={[styles.wrap, melayang && styles.melayang]}>
      <Text style={styles.judul}>{T.judul}</Text>

      <View style={styles.nilaiBaris}>
        <Text style={styles.nilai}>{T.terpakai(formatKg(beratKg))}</Text>
        <Text style={styles.nilai}>{T.maks(kapasitasKg)}</Text>
      </View>

      <View style={styles.track}>
        <View style={[styles.progress, { width: `${persen * 100}%` }]} />
      </View>

      <View style={styles.statusBaris}>
        <View style={styles.status}>
          <Ionicons name={penuh ? "alert-circle" : "checkmark"} size={14} color={warnaStatus} />
          <Text style={[styles.statusText, { color: warnaStatus }]}>
            {penuh ? T.penuh : T.tersedia}
          </Text>
        </View>
        <Text style={styles.sisa}>{T.sisa(formatKg(sisaKg))}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
    backgroundColor: colors.canvas, // buram agar isi yang tergulung tidak tembus ke belakang
  },
  melayang: { borderBottomWidth: 1, borderBottomColor: colors.borderStrong },
  judul: { fontSize: 14, fontWeight: "700", color: colors.text },
  nilaiBaris: { flexDirection: "row", justifyContent: "space-between", marginTop: spacing.md },
  nilai: { fontSize: 12, fontWeight: "500", color: colors.text },
  track: {
    height: 8,
    borderRadius: radius.sm,
    backgroundColor: colors.text,
    overflow: "hidden",
    marginTop: spacing.sm,
  },
  progress: { height: "100%", backgroundColor: colors.dark, borderRadius: radius.sm },
  statusBaris: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: spacing.md },
  status: { flexDirection: "row", alignItems: "center", gap: 4 },
  statusText: { fontSize: 12, fontWeight: "500" },
  sisa: { fontSize: 12, color: colors.textSoft },
});
