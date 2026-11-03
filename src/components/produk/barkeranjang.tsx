import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, radius, spacing } from "@/theme";
import { TEKS } from "@/data/teks";
import { formatHarga } from "@/utils/produk";

type Props = {
  subtotal: number;
  jumlah: number;       // ditampilkan sebagai badge kuning di tombol
  loading?: boolean;
  onTambah: () => void;
};

// Bar hijau di bawah layar: subtotal di kiri, tombol keranjang di kanan
export default function BarKeranjang({ subtotal, jumlah, loading, onTambah }: Props) {
  return (
    <View style={styles.bar}>
      <View>
        <Text style={styles.label}>{TEKS.produk.subtotal}</Text>
        <Text style={styles.nilai}>{formatHarga(subtotal)}</Text>
      </View>

      <Pressable style={styles.tombol} onPress={onTambah} disabled={loading} hitSlop={6}>
        {loading ? (
          <ActivityIndicator color={colors.white} />
        ) : (
          <Ionicons name="cart" size={24} color={colors.white} />
        )}
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{jumlah}</Text>
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.dark,
    borderRadius: radius.xl,
    paddingVertical: spacing.sm,
    paddingLeft: spacing.lg,
    paddingRight: spacing.sm,
  },
  label: { fontSize: 11, color: colors.white, opacity: 0.85 },
  nilai: { fontSize: 18, fontWeight: "700", color: colors.white },
  tombol: {
    width: 52,
    height: 52,
    borderRadius: radius.lg,
    backgroundColor: colors.darker,
    alignItems: "center",
    justifyContent: "center",
  },
  badge: {
    position: "absolute",
    top: -6,
    right: -6,
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    paddingHorizontal: 5,
    backgroundColor: colors.gold,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: { fontSize: 11, fontWeight: "700", color: colors.text },
});
