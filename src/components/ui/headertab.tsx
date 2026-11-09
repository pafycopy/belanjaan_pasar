import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors, spacing } from "@/theme";
import { IconName } from "@/types/ui";

type Props = {
  judul: string;
  ikonKanan?: IconName;     // bawaan: lonceng; halaman Produk memakai keranjang
  jumlahBadge?: number;     // badge merah di ikon kanan; 0 / kosong = tanpa badge
  labelKanan?: string;      // label aksesibilitas tombol kanan
  onKembali?: () => void;   // kosong = tanpa tombol kembali
  onKanan?: () => void;     // kosong = tanpa ikon aksi di kanan
};

// Header hijau untuk layar tab: tombol kembali, judul di tengah, satu ikon aksi di kanan (lonceng / keranjang)
// (layar tab tidak memakai header bawaan navigasi, jadi dibuat sebagai komponen biasa)
export default function HeaderTab({
  judul,
  ikonKanan = "notifications-outline",
  jumlahBadge = 0,
  labelKanan,
  onKembali,
  onKanan,
}: Props) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.header, { paddingTop: insets.top + 5 }]}>
      {onKembali ? (
        <Pressable onPress={onKembali} hitSlop={10} style={styles.kiri}>
          <Ionicons name="chevron-back" size={22} color={colors.white} />
        </Pressable>
      ) : (
        <View style={styles.kiri} />
      )}

      <Text style={styles.judul}>{judul}</Text>

      {onKanan ? (
        <Pressable
          onPress={onKanan}
          hitSlop={10}
          style={styles.kanan}
          accessibilityRole="button"
          accessibilityLabel={labelKanan}
        >
          <Ionicons name={ikonKanan} size={23} color={colors.white} />
          {jumlahBadge > 0 ? (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{jumlahBadge > 9 ? "9+" : jumlahBadge}</Text>
            </View>
          ) : null}
        </Pressable>
      ) : (
        <View style={styles.kanan} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.primary,
    minHeight: 42,
    paddingHorizontal: 14,
    paddingBottom: spacing.sm,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  kiri: { width: 32, alignItems: "flex-start" },
  kanan: { width: 32, alignItems: "flex-end" },
  judul: { color: colors.white, fontSize: 14, fontWeight: "700" },
  badge: {
    position: "absolute",
    top: -5,
    right: -7,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.danger,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: { color: colors.white, fontSize: 9, fontWeight: "700" },
});
