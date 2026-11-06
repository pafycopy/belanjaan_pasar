import { View, Text, Pressable, StyleSheet, StyleProp, ViewStyle } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ComponentProps } from "react";
import { colors } from "@/theme";

type IconName = ComponentProps<typeof Ionicons>["name"];

export type MenuItem = {
  id: string;
  label: string;
  icon: IconName;
  iconBackground?: string;
  onPress?: () => void;
};

type Props = {
  items: MenuItem[];
  style?: StyleProp<ViewStyle>;
};

export default function MenuGrid({ items, style }: Props) {
  return (
    <View style={[styles.row, style]}>
      {items.map((item) => (
        <Pressable key={item.id} onPress={item.onPress} style={styles.item}>
          <View style={[styles.iconBox, { backgroundColor: item.iconBackground ?? colors.dark }]}>
            <Ionicons name={item.icon} size={21} color="#fff" />
          </View>
          <Text style={styles.label} numberOfLines={2}>
            {item.label}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "flex-start" },
  item: { flex: 1, alignItems: "center", gap: 7, paddingHorizontal: 3 },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    fontSize: 10,
    lineHeight: 12,
    fontWeight: "600",
    textAlign: "center",
    color: colors.text,
    minHeight: 24,
  },
});
