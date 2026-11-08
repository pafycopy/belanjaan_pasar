import { ReactNode } from "react";
import { Pressable, StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing } from "@/theme";

type Aksi = { label: string; onPress: () => void };

type Props = {
  judul: string;
  aksi?: Aksi;          // tautan di kanan, mis. "Lihat Semua >"
  kanan?: ReactNode;    // atau elemen bebas di kanan, mis. kapsul waktu
  style?: StyleProp<ViewStyle>;
};

// Judul seksi: teks tebal di kiri, tautan atau elemen kecil di kanan
export default function JudulSeksi({ judul, aksi, kanan, style }: Props) {
  return (
    <View style={[styles.row, style]}>
      <Text style={styles.judul}>{judul}</Text>

      {aksi ? (
        <Pressable onPress={aksi.onPress} hitSlop={8} style={styles.aksi} accessibilityRole="button">
          <Text style={styles.aksiText}>{aksi.label}</Text>
          <Ionicons name="chevron-forward" size={14} color={colors.dark} />
        </Pressable>
      ) : null}

      {kanan}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    marginBottom: spacing.sm,
  },
  judul: { fontSize: 17, fontWeight: "700", color: colors.text },
  aksi: { flexDirection: "row", alignItems: "center", gap: 2 },
  aksiText: { fontSize: 12, fontWeight: "700", color: colors.dark },
});
