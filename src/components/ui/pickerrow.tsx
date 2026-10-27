import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, radius, spacing } from "@/theme";
import { IconName } from "@/types/ui";

type Props = {
  icon: IconName;
  title?: string;     // kosong -> tampilkan placeholder
  subtitle?: string;
  placeholder: string;
  invalid?: boolean;
  onPress: () => void;
};

// Baris pilihan dengan panah (membuka lembar/layar pemilihan)
export default function PickerRow({ icon, title, subtitle, placeholder, invalid, onPress }: Props) {
  return (
    <Pressable style={[styles.row, invalid && styles.invalid]} onPress={onPress}>
      <Ionicons name={icon} size={18} color={colors.placeholder} />
      <View style={styles.body}>
        {title ? (
          <>
            <Text style={styles.title} numberOfLines={1}>
              {title}
            </Text>
            {subtitle ? (
              <Text style={styles.subtitle} numberOfLines={1}>
                {subtitle}
              </Text>
            ) : null}
          </>
        ) : (
          <Text style={styles.placeholder}>{placeholder}</Text>
        )}
      </View>
      <Ionicons name="chevron-forward" size={18} color={colors.placeholder} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    minHeight: 54,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: colors.white,
  },
  invalid: { borderColor: colors.danger },
  body: { flex: 1 },
  title: { fontSize: 14, fontWeight: "700", color: colors.text },
  subtitle: { fontSize: 11, color: colors.muted, marginTop: 2 },
  placeholder: { fontSize: 14, color: colors.placeholder },
});
