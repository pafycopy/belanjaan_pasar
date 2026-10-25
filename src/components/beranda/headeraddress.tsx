import { View, Text, Pressable, StyleSheet, StyleProp, ViewStyle } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors } from "@/theme";

type Props = {
  address: string;
  cartCount?: number;
  hasNotification?: boolean;
  onPressAddress?: () => void;
  onPressCart?: () => void;
  onPressNotification?: () => void;
  style?: StyleProp<ViewStyle>;
};

export default function HeaderAddress({
  address,
  cartCount = 0,
  hasNotification = false,
  onPressAddress,
  onPressCart,
  onPressNotification,
  style,
}: Props) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top + 8 }, style]}>
      {/* Kiri: alamat */}
      <Pressable style={styles.left} onPress={onPressAddress}>
        <View style={styles.labelRow}>
          <Text style={styles.label}>Alamat Pengantaran</Text>
          <Ionicons name="pencil" size={12} color="#fff" />
        </View>
        <Text style={styles.address} numberOfLines={1}>
          {address}
        </Text>
      </Pressable>

      {/* Kanan: keranjang dan notifikasi */}
      <View style={styles.right}>
        <Pressable onPress={onPressCart} hitSlop={8}>
          <Ionicons name="cart-outline" size={26} color="#fff" />
          {cartCount > 0 ? (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{cartCount > 9 ? "9+" : cartCount}</Text>
            </View>
          ) : null}
        </Pressable>

        <Pressable onPress={onPressNotification} hitSlop={8}>
          <Ionicons name="notifications-outline" size={26} color="#fff" />
          {hasNotification ? <View style={styles.dot} /> : null}
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: colors.primary,
  },
  left: { flex: 1, marginRight: 16 },
  labelRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  label: { color: "#fff", fontSize: 12, fontWeight: "600" },
  address: { color: "#fff", fontSize: 13, marginTop: 2 },
  right: { flexDirection: "row", alignItems: "center", gap: 18 },
  badge: {
    position: "absolute",
    top: -6,
    right: -8,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#e53935",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
  },
  badgeText: { color: "#fff", fontSize: 10, fontWeight: "700" },
  dot: {
    position: "absolute",
    top: 0,
    right: 1,
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: "#e53935",
  },
});