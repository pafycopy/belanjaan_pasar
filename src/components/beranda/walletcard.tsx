import { Fragment, ComponentProps } from "react";
import { View, Text, Pressable, StyleSheet, StyleProp, ViewStyle } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/theme";

type IconName = ComponentProps<typeof Ionicons>["name"];

export type WalletItem = {
  id: string;
  label: string;
  value: string;
  icon: IconName;
  iconBackground?: string; // jika diisi, ikon tampil putih di dalam lingkaran berwarna
  onPress?: () => void;
};

type Props = {
  items: WalletItem[];
  style?: StyleProp<ViewStyle>;
};

export default function WalletCard({ items, style }: Props) {
  return (
    <View style={[styles.container, style]}>
      {items.map((item, i) => (
        <Fragment key={item.id}>
          {i > 0 ? <View style={styles.divider} /> : null}

          <Pressable onPress={item.onPress} style={styles.cell}>
            <View style={styles.iconSlot}>
              {item.iconBackground ? (
                <View style={[styles.iconCircle, { backgroundColor: item.iconBackground }]}>
                  <Ionicons name={item.icon} size={15} color="#fff" />
                </View>
              ) : (
                <Ionicons name={item.icon} size={24} color={colors.text} />
              )}
            </View>

            <Text style={styles.label}>{item.label}</Text>
            <Text style={styles.value} numberOfLines={1}>
              {item.value}
            </Text>
          </Pressable>
        </Fragment>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: colors.white,
    borderRadius: 16,
    paddingVertical: 16,
    elevation: 1,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  cell: { flex: 1, alignItems: "center", paddingHorizontal: 4 },
  iconSlot: {
    height: 28,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },
  iconCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  divider: {
    width: 1,
    backgroundColor: colors.border,
    marginVertical: 0,
  },
  label: { fontSize: 11, color: colors.muted },
  value: { fontSize: 13, fontWeight: "700", color: colors.text, marginTop: 2 },
});