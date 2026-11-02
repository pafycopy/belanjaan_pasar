import { Pressable, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing } from "@/theme";
import { TEKS } from "@/data/teks";
import { formatRibuan } from "@/utils/angka";
import Button from "@/components/ui/button";

type Props = {
  total: number;
  tingkat: string;
  onPressRiwayat: () => void;
  onPressKlaim: () => void;
};

const T = TEKS.voucher;

// Kartu hijau di atas halaman Voucher: tingkat member, poin, dan jalan pintas Klaim Harian
export default function HeroVoucher({ total, tingkat, onPressRiwayat, onPressKlaim }: Props) {
  return (
    <LinearGradient
      colors={[colors.heroA, colors.heroB]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.card}
    >
      <View style={styles.hiasan} pointerEvents="none">
        <Ionicons name="pricetag" size={74} color="rgba(255,255,255,0.08)" />
      </View>

      <View style={styles.atas}>
        <View style={styles.member}>
          <View style={styles.bintang}>
            <Ionicons name="star" size={9} color={colors.white} />
          </View>
          <Text style={styles.memberTeks}>{T.member(tingkat)}</Text>
        </View>

        <Pressable style={styles.riwayat} onPress={onPressRiwayat} hitSlop={8}>
          <Text style={styles.riwayatTeks}>{T.riwayatPoin}</Text>
          <Ionicons name="chevron-forward" size={13} color={colors.card} />
        </Pressable>
      </View>

      <View style={styles.bawah}>
        <View style={styles.poinKolom}>
          <Text style={styles.label}>{T.poinAnda}</Text>
          <Text style={styles.total}>
            {formatRibuan(total)} <Text style={styles.satuan}>{T.satuan}</Text>
          </Text>
          <Text style={styles.ajak}>{T.ajakTukar}</Text>
        </View>

        <Button
          label={T.klaimHarian}
          icon="calendar-outline"
          variant="light"
          size="md"
          onPress={onPressKlaim}
          style={styles.tombol}
        />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: 14, padding: spacing.lg, overflow: "hidden", gap: spacing.md },
  hiasan: { position: "absolute", top: 18, right: 14, transform: [{ rotate: "-18deg" }] },
  atas: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  member: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 5,
    paddingLeft: 6,
    paddingRight: 10,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.25)",
  },
  bintang: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.gold,
    alignItems: "center",
    justifyContent: "center",
  },
  memberTeks: { fontSize: 10, fontWeight: "700", letterSpacing: 0.3, color: colors.white },
  riwayat: { flexDirection: "row", alignItems: "center", gap: 2 },
  riwayatTeks: { fontSize: 12, fontWeight: "600", color: colors.card },
  bawah: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: spacing.md },
  poinKolom: { flex: 1, gap: 2 },
  label: { fontSize: 12, color: colors.card },
  total: { fontSize: 32, fontWeight: "800", color: colors.white },
  satuan: { fontSize: 14, fontWeight: "700", color: colors.banner },
  ajak: { fontSize: 11, color: colors.card, marginTop: 2 },
  tombol: { borderRadius: 24, paddingHorizontal: 16, borderWidth: 0 },
});
