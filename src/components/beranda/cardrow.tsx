import {
  View,
  Text,
  Pressable,
  StyleSheet,
  StyleProp,
  ViewStyle,
  TextStyle,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ComponentProps } from "react";
import { colors } from "@/theme";

type IconName = ComponentProps<typeof Ionicons>["name"];

export type InfoItem = {
  id: string;
  title: string;
  value?: string;
  icon?: IconName;
  onPress?: () => void;
};

type Props = {
  items: InfoItem[];
  iconSize?: number;
  iconColor?: string;
  style?: StyleProp<ViewStyle>;       // gaya baris
  cardStyle?: StyleProp<ViewStyle>;   // gaya tiap kartu
  titleStyle?: StyleProp<TextStyle>;
  valueStyle?: StyleProp<TextStyle>;
};

export default function InfoCardRow({
  items,
  iconSize = 22,
  iconColor = colors.primary,
  style,
  cardStyle,
  titleStyle,
  valueStyle,
}: Props) {
  return (
    <View style={[styles.row, style]}>
      {items.map((item) => (
        <Pressable
          key={item.id}
          onPress={item.onPress}
          style={[styles.card, cardStyle]}
        >
          {item.icon ? (
            <Ionicons name={item.icon} size={iconSize} color={iconColor} />
          ) : null}
          <Text style={[styles.title, titleStyle]}>{item.title}</Text>
          {item.value ? (
            <Text style={[styles.value, valueStyle]} numberOfLines={1}>
              {item.value}
            </Text>
          ) : null}
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", gap: 12 },
  card: {
    flex: 1,
    minHeight: 80,
    backgroundColor: colors.card,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    paddingHorizontal: 6,
    gap: 2,
  },
  title: { fontSize: 12, color: "#333" },
  value: { fontSize: 14, fontWeight: "700" },
});