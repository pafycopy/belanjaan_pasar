import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors, spacing } from "@/theme";

type Props = {
  judul: string;
  jumlahNotifikasi?: number; // badge merah di ikon lonceng; 0 / kosong = tanpa badge
  onKembali: () => void;
  onNotifikasi: () => void;
};

// Header hijau untuk layar tab: tombol kembali, judul di tengah, lonceng notifikasi di kanan
// (layar tab tidak memakai header bawaan navigasi, jadi dibuat sebagai komponen biasa)
export default function HeaderTab({ judul, jumlahNotifikasi = 0, onKembali, onNotifikasi }: Props) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.header, { paddingTop: insets.top + 5 }]}>
      <Pressable onPress={onKembali} hitSlop={10} style={styles.kiri}>
        <Ionicons name="chevron-back" size={22} color={colors.white} />
      </Pressable>

      <Text style={styles.judul}>{judul}</Text>

      <Pressable onPress={onNotifikasi} hitSlop={10} style={styles.kanan}>
        <Ionicons name="notifications-outline" size={23} color={colors.white} />
        {jumlahNotifikasi > 0 ? (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{jumlahNotifikasi > 9 ? "9+" : jumlahNotifikasi}</Text>
          </View>
        ) : null}
      </Pressable>
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
