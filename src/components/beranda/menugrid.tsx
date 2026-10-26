import { View, Text, Pressable, StyleSheet, StyleProp, ViewStyle } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ComponentProps } from "react";
import { colors } from "@/theme";

type IconName = ComponentProps<typeof Ionicons>["name"];

export type MenuItem = {
  id: string;
  label: string;
  icon: IconName;
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
          <View style={styles.iconBox}>
            <Ionicons name={item.icon} size={28} color="#fff" />
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
  row: { flexDirection: "row" },
  item: { flex: 1, alignItems: "center", gap: 6, paddingHorizontal: 2 },
  iconBox: {
    width: 56,
    height: 56,
    borderRadius: 14,
    backgroundColor: colors.dark,
    alignItems: "center",
    justifyContent: "center",
  },
  label: { fontSize: 11, fontWeight: "600", textAlign: "center", color: colors.text },
});