import { ReactNode } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, radius, spacing } from "@/theme";
import { IconName } from "@/types/ui";

type BarisProps = {
  ikon: IconName;
  label: string;
  keterangan?: string;       // baris kecil di bawah label (mis. nomor versi)
  onPress?: () => void;      // kosong = baris informasi saja (tanpa panah)
};

// Satu baris menu: ikon dalam lingkaran, label, dan panah
export function BarisMenu({ ikon, label, keterangan, onPress }: BarisProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      style={styles.baris}
      accessibilityRole={onPress ? "button" : undefined}
    >
      <View style={styles.ikon}>
        <Ionicons name={ikon} size={18} color={colors.dark} />
      </View>
      <View style={styles.teks}>
        <Text style={styles.label}>{label}</Text>
        {keterangan ? <Text style={styles.keterangan}>{keterangan}</Text> : null}
      </View>
      {onPress ? <Ionicons name="chevron-forward" size={16} color={colors.muted} /> : null}
    </Pressable>
  );
}

// Kelompok menu dengan judul kecil huruf kapital
export function GrupMenu({ judul, children }: { judul: string; children: ReactNode }) {
  return (
    <View style={styles.grup}>
      <Text style={styles.judul}>{judul}</Text>
      <View style={styles.daftar}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  grup: { gap: spacing.sm },
  judul: { fontSize: 13, fontWeight: "800", letterSpacing: 0.3, textTransform: "uppercase", color: colors.text },
  daftar: { gap: spacing.sm },
  baris: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    minHeight: 52,
  },
  ikon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primarySoft,
    alignItems: "center",
    justifyContent: "center",
  },
  teks: { flex: 1, gap: 1 },
  label: { fontSize: 13, fontWeight: "700", color: colors.text },
  keterangan: { fontSize: 11, color: colors.muted },
});
