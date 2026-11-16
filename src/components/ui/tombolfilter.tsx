import { Pressable, StyleSheet, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, radius, spacing } from "@/theme";
import { IconName } from "@/types/ui";

type Props = {
  label: string;
  icon: IconName;
  onPress: () => void;
  aksesibilitas?: string;
};

// Tombol filter berbentuk kapsul (ikon + label + panah bawah), mis. pemilih bulan
export default function TombolFilter({ label, icon, onPress, aksesibilitas }: Props) {
  return (
    <Pressable
      style={styles.tombol}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={aksesibilitas ?? label}
    >
      <Ionicons name={icon} size={16} color={colors.dark} />
      <Text style={styles.label} numberOfLines={1}>
        {label}
      </Text>
      <Ionicons name="chevron-down" size={14} color={colors.textSoft} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tombol: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    height: 44,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.white,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  label: { fontSize: 12, fontWeight: "700", color: colors.text },
});
