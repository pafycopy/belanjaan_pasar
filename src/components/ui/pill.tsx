import { StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, radius } from "@/theme";
import { IconName } from "@/types/ui";

type Props = {
  label: string;
  icon?: IconName;
  bg?: string;
  fg?: string;
  style?: StyleProp<ViewStyle>;
};

// Kapsul kecil berisi ikon + teks (mis. "s/d 10.00 WIB")
export default function Pill({ label, icon, bg = colors.peachSoft, fg = colors.brown, style }: Props) {
  return (
    <View style={[styles.pill, { backgroundColor: bg }, style]}>
      {icon ? <Ionicons name={icon} size={12} color={fg} /> : null}
      <Text style={[styles.text, { color: fg }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.xl,
  },
  text: { fontSize: 11, fontWeight: "600" },
});
