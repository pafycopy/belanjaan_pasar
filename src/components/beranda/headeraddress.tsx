import { View, Text, Pressable, StyleSheet, StyleProp, ViewStyle } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors, fontSize, spacing } from "@/theme";

type Props = {
  address: string;
  cartCount?: number;
  hasNotification?: boolean;
  onPressAddress?: () => void;
  onPressCart?: () => void;
  onPressNotification?: () => void;
  showActions?: boolean; // false = sembunyikan ikon keranjang & notifikasi (mis. di tab Akun)
  style?: StyleProp<ViewStyle>;
};

export default function HeaderAddress({
  address,
  cartCount = 0,
  hasNotification = false,
  onPressAddress,
  onPressCart,
  onPressNotification,
  showActions = true,
  style,
}: Props) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top + spacing.sm }, style]}>
      {/* Kiri: alamat */}
      <Pressable style={styles.left} onPress={onPressAddress}>
        <View style={styles.labelRow}>
          <Text style={styles.label}>Alamat Pengantaran</Text>
          <Ionicons name="pencil" size={12} color={colors.white} />
        </View>
        <Text style={styles.address} numberOfLines={1}>
          {address}
        </Text>
      </Pressable>

      {/* Kanan: keranjang dan notifikasi */}
      {showActions ? (
      <View style={styles.right}>
        <Pressable onPress={onPressCart} hitSlop={8}>
          <Ionicons name="cart-outline" size={26} color={colors.white} />
          {cartCount > 0 ? (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{cartCount > 9 ? "9+" : cartCount}</Text>
            </View>
          ) : null}
        </Pressable>

        <Pressable onPress={onPressNotification} hitSlop={8}>
          <Ionicons name="notifications-outline" size={26} color={colors.white} />
          {hasNotification ? <View style={styles.dot} /> : null}
        </Pressable>
      </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
    backgroundColor: colors.primary,
  },
  left: { flex: 1, marginRight: spacing.lg },
  labelRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  label: { color: colors.white, fontSize: fontSize.sm, fontWeight: "600" },
  address: { color: colors.white, fontSize: fontSize.md, marginTop: 2 },
  right: { flexDirection: "row", alignItems: "center", gap: 18 },
  badge: {
    position: "absolute",
    top: -6,
    right: -8,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.danger,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
  },
  badgeText: { color: colors.white, fontSize: fontSize.xxs, fontWeight: "700" },
  dot: {
    position: "absolute",
    top: 0,
    right: 1,
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: colors.danger,
  },
});