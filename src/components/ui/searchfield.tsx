import { ActivityIndicator, StyleSheet, TextInput, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, radius, spacing } from "@/theme";
import { IconName } from "@/types/ui";

type Props = {
  value: string;
  onChangeText: (v: string) => void;
  onSubmit: () => void;
  placeholder: string;
  icon?: IconName;
  loading?: boolean;
};

export default function SearchField({
  value,
  onChangeText,
  onSubmit,
  placeholder,
  icon = "location-outline",
  loading,
}: Props) {
  return (
    <View style={styles.box}>
      <Ionicons name={icon} size={18} color={colors.primary} />
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={colors.placeholder}
        value={value}
        onChangeText={onChangeText}
        onSubmitEditing={onSubmit}
        returnKeyType="search"
      />
      {loading ? <ActivityIndicator size="small" color={colors.primary} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    height: 44,
    backgroundColor: colors.white,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
  },
  input: { flex: 1, fontSize: 13, padding: 0 },
});
