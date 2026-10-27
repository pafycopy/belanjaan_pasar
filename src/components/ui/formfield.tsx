import { ReactNode } from "react";
import { StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native";
import { colors, spacing } from "@/theme";

type Props = {
  label?: string;
  wajib?: boolean;
  error?: string;
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
};

// Pembungkus standar: label (+ tanda *), isian, dan pesan error
export default function FormField({ label, wajib, error, children, style }: Props) {
  return (
    <View style={[styles.wrap, style]}>
      {label ? (
        <Text style={styles.label}>
          {label}
          {wajib ? <Text style={styles.bintang}> *</Text> : null}
        </Text>
      ) : null}
      {children}
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginTop: spacing.lg },
  label: { fontSize: 13, fontWeight: "700", color: colors.text, marginBottom: spacing.sm },
  bintang: { color: colors.danger },
  error: { color: colors.danger, fontSize: 12, marginTop: spacing.xs },
});
