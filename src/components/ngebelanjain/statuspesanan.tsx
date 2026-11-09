import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { StatusNgebelanjain } from "@/data/ngebelanjain";
import { colors, spacing } from "@/theme";

type Props = {
  items: readonly StatusNgebelanjain[];
  onPress: (item: StatusNgebelanjain) => void;
};

// Baris pintasan tahapan pesanan: ikon di atas, label dua baris di bawah
export default function StatusPesananNgebelanjain({ items, onPress }: Props) {
  return (
    <View style={styles.baris}>
      {items.map((it) => (
        <Pressable key={it.id} onPress={() => onPress(it)} style={styles.item} accessibilityRole="button">
          <Ionicons name={it.ikon} size={26} color={colors.textStrong} />
          <Text style={styles.label} numberOfLines={2}>
            {it.label}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  baris: { flexDirection: "row", alignItems: "flex-start" },
  item: { flex: 1, alignItems: "center", gap: spacing.sm, paddingHorizontal: 2 },
  label: { fontSize: 11, lineHeight: 14, fontWeight: "700", textAlign: "center", color: colors.textStrong },
});
