import { ReactNode } from "react";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors, spacing } from "@/theme";

type Props = { children: ReactNode; bordered?: boolean; background?: string };

// Area tombol di bawah layar; otomatis memberi ruang untuk safe area
export default function FooterBar({ children, bordered = true, background = colors.white }: Props) {
  const insets = useSafeAreaInsets();
  return (
    <View
      style={[
        styles.bar,
        { backgroundColor: background, paddingBottom: insets.bottom + spacing.md },
        bordered && styles.bordered,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: { paddingHorizontal: spacing.lg, paddingTop: spacing.md, gap: 10,marginBottom: 0 },
  bordered: { borderTopWidth: 1, borderTopColor: colors.border },
});
