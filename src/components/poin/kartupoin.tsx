import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, radius, spacing } from "@/theme";
import { TEKS } from "@/data/teks";
import { formatRibuan } from "@/utils/angka";
import Button from "@/components/ui/button";

type Props = {
  total: number;
  onPressTukar: () => void;
  onPressRiwayat: () => void;
};

// Kartu hijau berisi total poin dan dua tombol aksi
export default function KartuPoin({ total, onPressTukar, onPressRiwayat }: Props) {
  return (
    <View style={styles.card}>
      {/* hiasan latar */}
      <View style={styles.hiasan}>
        <Ionicons name="star" size={46} color="rgba(255,255,255,0.06)" />
      </View>

      <View style={styles.atas}>
        <Text style={styles.label}>{TEKS.poin.totalLabel}</Text>
        <View style={styles.status}>
          <Ionicons name="checkmark-circle-outline" size={14} color={colors.white} />
          <Text style={styles.statusTeks}>{TEKS.poin.akunAktif}</Text>
        </View>
      </View>

      <Text style={styles.total}>
        {formatRibuan(total)} <Text style={styles.satuan}>{TEKS.poin.satuan}</Text>
      </Text>

      <View style={styles.aksi}>
        <Button
          label={TEKS.poin.tukar}
          icon="gift-outline"
          variant="light"
          size="md"
          onPress={onPressTukar}
          style={styles.tombol}
        />
        <Button
          label={TEKS.poin.riwayat}
          icon="receipt-outline"
          variant="glass"
          size="md"
          onPress={onPressRiwayat}
          style={styles.tombol}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.dark,
    borderRadius: 16,
    padding: spacing.lg,
    overflow: "hidden",
  },
  hiasan: {
    position: "absolute",
    right: -28,
    bottom: -34,
    width: 130,
    height: 130,
    borderRadius: 65,
    borderWidth: 14,
    borderColor: "rgba(255,255,255,0.05)",
    alignItems: "center",
    justifyContent: "center",
  },
  atas: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  label: { fontSize: 11, fontWeight: "700", letterSpacing: 0.5, color: colors.banner },
  status: { flexDirection: "row", alignItems: "center", gap: 4 },
  statusTeks: { fontSize: 11, fontWeight: "600", color: colors.white },
  total: { fontSize: 34, fontWeight: "800", color: colors.white, marginTop: 2 },
  satuan: { fontSize: 14, fontWeight: "600", color: colors.banner },
  aksi: { flexDirection: "row", gap: spacing.md, marginTop: spacing.lg },
  tombol: { flex: 1, borderRadius: radius.lg },
});
