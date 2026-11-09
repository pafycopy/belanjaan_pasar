import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import LogoBank from "@/components/pembayaran/logobank";
import { TEKS } from "@/data/teks";
import { useSalin } from "@/hooks/usesalin";
import { colors, radius, spacing } from "@/theme";
import { formatRibuan } from "@/utils/angka";

type Props = {
  total: number;
  invoice: string;
  bank: string;
  nomor: string;
  namaAkun: string;
};

const T = TEKS.berhasil;

// Kartu "Total Dana Masuk": nominal, status LUNAS, invoice, dan rekening tujuan
export default function DanaMasuk({ total, invoice, bank, nomor, namaAkun }: Props) {
  const { tersalin, salin } = useSalin<"nomor">();

  return (
    <View style={styles.kartu}>
      <View style={styles.atas}>
        <View style={styles.kiri}>
          <Text style={styles.label}>{T.danaMasuk}</Text>
          <View style={styles.nominalBaris} accessible accessibilityLabel={`Rp ${formatRibuan(total)}`}>
            <Text style={styles.mataUang}>Rp</Text>
            <Text style={styles.nominal} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.6}>
              {formatRibuan(total)}
            </Text>
          </View>
        </View>

        <View style={styles.kanan}>
          <View style={styles.lunas}>
            <Ionicons name="checkmark-circle" size={13} color={colors.dark} />
            <Text style={styles.lunasTeks}>{T.lunas}</Text>
          </View>
          <Text style={styles.invoice}>{TEKS.pembayaran.ringkasan.invoice(invoice)}</Text>
        </View>
      </View>

      <View style={styles.rekening}>
        <LogoBank bank={bank} />
        <View style={styles.rekeningInfo}>
          <Text style={styles.rekeningJudul}>{TEKS.pembayaran.rekening.judul(bank)}</Text>
          <Text style={styles.rekeningNomor}>{`${nomor} (${namaAkun})`}</Text>
        </View>
        <Pressable
          onPress={() => void salin("nomor", nomor)}
          hitSlop={8}
          style={styles.salin}
          accessibilityRole="button"
          accessibilityLabel={TEKS.pembayaran.rekening.salin}
        >
          <Ionicons name={tersalin ? "checkmark" : "copy-outline"} size={18} color={colors.dark} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  kartu: { backgroundColor: colors.white, borderRadius: radius.lg, padding: spacing.lg, gap: spacing.md },
  atas: { flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between", gap: spacing.md },
  kiri: { flex: 1, minWidth: 0, gap: 2 },
  label: { fontSize: 12, fontWeight: "700", color: colors.textSoft },
  nominalBaris: { flexDirection: "row", alignItems: "baseline", gap: 4 },
  nominal: { flexShrink: 1, fontSize: 26, fontWeight: "800", color: colors.dark, fontVariant: ["tabular-nums"] },
  mataUang: { fontSize: 16, fontWeight: "700", color: colors.dark },
  kanan: { alignItems: "flex-end", gap: 6 },
  lunas: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: colors.mintFade,
    borderRadius: radius.xl,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
  },
  lunasTeks: { fontSize: 11, fontWeight: "800", color: colors.dark },
  invoice: { fontSize: 11, color: colors.muted },
  rekening: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    backgroundColor: colors.accentSoft,
    borderRadius: radius.md,
    padding: spacing.md,
  },
  rekeningInfo: { flex: 1, gap: 2 },
  rekeningJudul: { fontSize: 12, fontWeight: "700", color: colors.text },
  rekeningNomor: { fontSize: 13, fontWeight: "800", color: colors.text },
  salin: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
  },
});
