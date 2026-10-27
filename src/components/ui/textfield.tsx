import { StyleProp, StyleSheet, TextInput, View, ViewStyle } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, radius, spacing } from "@/theme";
import { DefinisiField } from "@/data/formalamat";
import FormField from "./formfield";

type Props = {
  field: DefinisiField; // label, placeholder, keyboard, dst. diambil dari definisi (data)
  value: string;
  onChangeText: (v: string) => void;
  error?: string;
  style?: StyleProp<ViewStyle>;
};

export default function TextField({ field, value, onChangeText, error, style }: Props) {
  const inputProps = {
    value,
    onChangeText,
    placeholder: field.placeholder,
    placeholderTextColor: colors.placeholder,
    keyboardType: field.keyboardType,
    maxLength: field.maxLength,
    multiline: field.multiline,
  };

  return (
    <FormField label={field.label} wajib={field.wajib} error={error} style={style}>
      {field.ikon ? (
        <View style={[styles.row, error ? styles.invalid : null]}>
          <Ionicons name={field.ikon} size={18} color={colors.placeholder} />
          <TextInput style={styles.rowInput} {...inputProps} />
        </View>
      ) : (
        <TextInput
          style={[styles.input, field.multiline && styles.multiline, error ? styles.invalid : null]}
          {...inputProps}
        />
      )}
    </FormField>
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: 11,
    fontSize: 14,
    color: colors.text,
    backgroundColor: colors.white,
  },
  multiline: { minHeight: 48, textAlignVertical: "top" },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    height: 48,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.white,
  },
  rowInput: { flex: 1, fontSize: 14, color: colors.text, padding: 0 },
  invalid: { borderColor: colors.danger },
});
