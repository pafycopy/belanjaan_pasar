import { StyleSheet, View } from "react-native";
import { colors, spacing } from "@/theme";

type Props = { warnaGaris: string };

// Garis putus-putus dengan takik setengah lingkaran di kiri dan kanan kartu (gaya tiket).
// Taruh di dalam kartu yang punya padding `spacing.lg`.
export default function PemisahTiket({ warnaGaris }: Props) {
  return (
    <View style={styles.pemisah}>
      <View style={[styles.takik, { left: -9 }]} />
      <View style={[styles.takik, { right: -9 }]} />
      {/* Android hanya menggambar garis putus-putus utuh kalau semua sisi dibuat; sisi bawah dipotong */}
      <View style={styles.garis}>
        <View style={[styles.garisDalam, { borderColor: warnaGaris }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  pemisah: { height: 18, marginHorizontal: -spacing.lg, justifyContent: "center" },
  takik: {
    position: "absolute",
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.surface,
  },
  garis: { marginHorizontal: spacing.lg + 6, height: 1, overflow: "hidden" },
  garisDalam: { height: 2, borderWidth: 1, borderStyle: "dashed", borderRadius: 1 },
});
