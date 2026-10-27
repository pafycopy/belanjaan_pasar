import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors, radius, spacing } from "@/theme";
import { TEKS } from "@/data/teks";
import Button from "@/components/ui/button";

type Props = { teks: string; mencari: boolean; onKonfirmasi: () => void };

// Kartu di bawah peta: alamat titik pin + tombol konfirmasi
export default function PinCard({ teks, mencari, onKonfirmasi }: Props) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.sheet, { paddingBottom: insets.bottom + 14 }]}>
      <View style={styles.baris}>
        {mencari ? (
          <ActivityIndicator size="small" color={colors.primary} />
        ) : (
          <Ionicons name="navigate-outline" size={18} color={colors.primary} />
        )}
        <Text style={styles.teks} numberOfLines={3}>
          {teks}
        </Text>
      </View>
      <Button label={TEKS.pinpoint.konfirmasi} onPress={onKonfirmasi} disabled={mencari} />
    </View>
  );
}

const styles = StyleSheet.create({
  sheet: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.white,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    gap: 14,
    elevation: 8,
    shadowColor: colors.shadow,
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: -2 },
  },
  baris: { flexDirection: "row", alignItems: "center", gap: 10 },
  teks: { flex: 1, fontSize: 13, color: colors.text, lineHeight: 18 },
});
