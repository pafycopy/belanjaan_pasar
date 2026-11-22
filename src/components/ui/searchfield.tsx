import { ActivityIndicator, Pressable, StyleSheet, TextInput, View } from "react-native";
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
  // Tombol ikon di ujung kanan kolom (mis. kalender untuk filter bulan); titik hijau bila filternya aktif
  aksi?: { icon: IconName; onPress: () => void; aksesibilitas: string; aktif?: boolean };
};

export default function SearchField({
  value,
  onChangeText,
  onSubmit,
  placeholder,
  icon = "location-outline",
  loading,
  aksi,
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
      {aksi ? (
        <Pressable
          onPress={aksi.onPress}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel={aksi.aksesibilitas}
          style={styles.aksi}
        >
          <Ionicons name={aksi.icon} size={20} color={colors.text} />
          {aksi.aktif ? <View style={styles.titik} /> : null}
        </Pressable>
      ) : null}
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
  aksi: { width: 24, height: 24, alignItems: "center", justifyContent: "center" },
  titik: {
    position: "absolute",
    top: 0,
    right: 0,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
    borderWidth: 1,
    borderColor: colors.white,
  },
});
