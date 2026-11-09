import { Pressable, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { TEKS } from "@/data/teks";
import { colors, radius, spacing } from "@/theme";

type Props = {
  nama: string;
  telepon: string;
  terverifikasi: boolean;
  poin: string;      // sudah diformat, mis. "2.450 Pts"
  voucher: string;   // sudah diformat, mis. "3 Kupon"
  onEdit: () => void;
  onFoto: () => void;
  onPoin: () => void;
  onVoucher: () => void;
};

const T = TEKS.akun;

function Statistik({ label, nilai, onPress }: { label: string; nilai: string; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={styles.stat} accessibilityRole="button">
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statNilai}>{nilai}</Text>
    </Pressable>
  );
}

// Kartu profil: foto (kosong dulu), nama, nomor HP, status terverifikasi, dan ringkasan poin & voucher
export default function KartuProfil({ nama, telepon, terverifikasi, poin, voucher, onEdit, onFoto, onPoin, onVoucher }: Props) {
  return (
    <View style={styles.kartu}>
      {/* semburat hijau lembut di pojok kanan atas */}
      <LinearGradient
        colors={[colors.primarySoft, colors.white]}
        start={{ x: 1, y: 0 }}
        end={{ x: 0.35, y: 0.7 }}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      />

      <View style={styles.atas}>
        <Pressable onPress={onFoto} style={styles.avatarWrap} accessibilityRole="button" accessibilityLabel={T.ubahFoto}>
          <View style={styles.avatar} />
          <View style={styles.avatarBadge}>
            <Ionicons name="camera" size={13} color={colors.white} />
          </View>
        </Pressable>

        <View style={styles.info}>
          <Text style={styles.nama} numberOfLines={1}>
            {nama}
          </Text>
          <Text style={styles.telepon}>{telepon}</Text>
          {terverifikasi ? (
            <View style={styles.chip}>
              <Ionicons name="checkmark-circle" size={13} color={colors.dark} />
              <Text style={styles.chipTeks}>{T.terverifikasi}</Text>
            </View>
          ) : null}
        </View>
      </View>

      <Pressable onPress={onEdit} hitSlop={6} style={styles.edit} accessibilityRole="button">
        <Text style={styles.editTeks}>{T.editProfil}</Text>
      </Pressable>

      <View style={styles.statBaris}>
        <Statistik label={T.poin} nilai={poin} onPress={onPoin} />
        <Statistik label={T.voucher} nilai={voucher} onPress={onVoucher} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  kartu: {
    backgroundColor: colors.white,
    borderRadius: radius.card,
    padding: spacing.lg,
    gap: spacing.lg,
    overflow: "hidden",
    shadowColor: colors.shadow,
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  atas: { flexDirection: "row", alignItems: "center", gap: spacing.lg },
  avatarWrap: { width: 58, height: 58 },
  avatar: { width: 58, height: 58, borderRadius: 29, backgroundColor: colors.accentSoftStrong },
  avatarBadge: {
    position: "absolute",
    right: -3,
    bottom: -3,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.dark,
    borderWidth: 2,
    borderColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
  },
  info: { flex: 1, gap: 4 },
  nama: { fontSize: 17, fontWeight: "800", color: colors.text },
  telepon: { fontSize: 12, color: colors.textSoft },
  chip: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: colors.mintFade,
    borderRadius: radius.xl,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },
  chipTeks: { fontSize: 10, fontWeight: "700", color: colors.dark },
  edit: {
    position: "absolute",
    top: spacing.sm,
    right: spacing.sm,
    backgroundColor: colors.accentSoftStrong,
    borderRadius: radius.xl,
    paddingHorizontal: spacing.md,
    paddingVertical: 5,
  },
  editTeks: { fontSize: 11, fontWeight: "800", color: colors.text },
  statBaris: { flexDirection: "row", alignItems: "center" },
  stat: { flex: 1, alignItems: "center", gap: 2 },
  statLabel: { fontSize: 12, color: colors.textSoft },
  statNilai: { fontSize: 15, fontWeight: "800", color: colors.text },
});
