import { StyleSheet, Text, View } from "react-native";
import { colors, spacing } from "@/theme";

type Props = {
  kiri: string;
  kanan: string;
  hijau?: boolean; // nilai di kanan ditonjolkan dengan warna hijau
};

// Satu baris rincian: label tebal di kiri, nilai di kanan
export default function BarisRincian({ kiri, kanan, hijau }: Props) {
  return (
    <View style={styles.baris}>
      <Text style={styles.kiri}>{kiri}</Text>
      <Text style={[styles.kanan, hijau && styles.hijau]}>{kanan}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  baris: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: spacing.md },
  kiri: { fontSize: 13, fontWeight: "800", color: colors.textStrong },
  kanan: { fontSize: 13, fontWeight: "700", color: colors.textStrong, textAlign: "right", flexShrink: 1 },
  hijau: { color: colors.dark },
});
