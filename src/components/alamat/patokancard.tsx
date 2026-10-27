import { StyleSheet, Text, TextInput, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, radius, spacing } from "@/theme";
import { DefinisiField } from "@/data/formalamat";
import { TEKS } from "@/data/teks";

type Props = {
  field: DefinisiField; // judul, teks bantuan, dan placeholder dari definisi
  value: string;
  onChangeText: (v: string) => void;
};

export default function PatokanCard({ field, value, onChangeText }: Props) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.ikon}>
          <Ionicons name="flag" size={12} color={colors.dark} />
        </View>
        <Text style={styles.judul}>{field.label}</Text>
        <Text style={styles.opsional}>{TEKS.opsional}</Text>
      </View>
      {field.bantuan ? <Text style={styles.bantuan}>{field.bantuan}</Text> : null}
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={field.placeholder}
        placeholderTextColor={colors.placeholder}
        multiline
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginTop: 18,
    padding: spacing.md,
    gap: spacing.sm,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.tint,
  },
  header: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  ikon: {
    width: 22,
    height: 22,
    borderRadius: 6,
    backgroundColor: colors.card,
    alignItems: "center",
    justifyContent: "center",
  },
  judul: { flex: 1, fontSize: 12, fontWeight: "700", color: colors.text },
  opsional: { fontSize: 11, color: colors.muted },
  bantuan: { fontSize: 11, color: colors.muted, lineHeight: 16 },
  input: {
    minHeight: 84,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    backgroundColor: colors.fieldBg,
    padding: 10,
    fontSize: 12,
    color: colors.text,
    textAlignVertical: "top",
  },
});
