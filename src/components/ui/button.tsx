import { ActivityIndicator, Pressable, StyleProp, StyleSheet, Text, ViewStyle } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, radius } from "@/theme";
import { IconName } from "@/types/ui";

type Variant = "primary" | "light" | "outline";
type Size = "sm" | "md" | "lg";

type Props = {
  label: string;
  onPress: () => void;
  variant?: Variant;
  size?: Size;
  icon?: IconName;
  loading?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
};

const UKURAN: Record<Size, { height: number; fontSize: number; iconSize: number; radius: number }> = {
  sm: { height: 42, fontSize: 13, iconSize: 14, radius: radius.md },
  md: { height: 44, fontSize: 13, iconSize: 16, radius: radius.lg },
  lg: { height: 48, fontSize: 14, iconSize: 18, radius: radius.lg },
};

const VARIAN: Record<Variant, { bg: string; fg: string; border?: string; weight: "600" | "700" }> = {
  primary: { bg: colors.dark, fg: colors.white, weight: "700" },
  light: { bg: colors.white, fg: colors.text, border: colors.border, weight: "700" },
  outline: { bg: colors.white, fg: colors.textSoft, border: colors.border, weight: "600" },
};

export default function Button({
  label,
  onPress,
  variant = "primary",
  size = "lg",
  icon,
  loading,
  disabled,
  style,
}: Props) {
  const u = UKURAN[size];
  const v = VARIAN[variant];
  const nonaktif = disabled || loading;

  return (
    <Pressable
      onPress={onPress}
      disabled={nonaktif}
      style={[
        styles.base,
        {
          height: u.height,
          borderRadius: u.radius,
          backgroundColor: v.bg,
          borderWidth: v.border ? 1 : 0,
          borderColor: v.border,
          opacity: nonaktif ? 0.6 : 1,
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={v.fg} />
      ) : (
        <>
          {icon ? <Ionicons name={icon} size={u.iconSize} color={v.fg} /> : null}
          <Text style={{ color: v.fg, fontSize: u.fontSize, fontWeight: v.weight }}>{label}</Text>
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6 },
});
