import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import LogoBank from "@/components/pembayaran/logobank";
import TeksTebal from "@/components/ui/tekstebal";
import { TEKS } from "@/data/teks";
import { useSalin } from "@/hooks/usesalin";
import { colors, radius, spacing } from "@/theme";
import { formatRibuan } from "@/utils/angka";
import { formatHarga } from "@/utils/produk";

type Kunci = "nomor" | "jumlah";

type Props = {
  bank: string;
  nomor: string;
  namaAkun: string;
  total: number;
};

const T = TEKS.pembayaran.rekening;

type TombolProps = { label: string; sudah: boolean; gelap?: boolean; onPress: () => void };

function TombolSalin({ label, sudah, gelap, onPress }: TombolProps) {
  const fg = gelap ? colors.white : colors.dark;
  return (
    <Pressable
      onPress={onPress}
      hitSlop={6}
      style={[styles.salin, gelap ? styles.salinGelap : styles.salinTerang]}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      <Ionicons name={sudah ? "checkmark" : "copy-outline"} size={16} color={fg} />
      <Text style={[styles.salinTeks, { color: fg }]}>{sudah ? T.tersalin : label}</Text>
    </Pressable>
  );
}

// Kartu rekening tujuan: nomor rekening, nama akun, dan nominal transfer, masing-masing bisa disalin
export default function RekeningTransfer({ bank, nomor, namaAkun, total }: Props) {
  const { tersalin, salin } = useSalin<Kunci>();
  const totalTeks = formatHarga(total);

  return (
    <View style={styles.kartu}>
      <View style={styles.judulBaris}>
        <LogoBank bank={bank} />
        <Text style={styles.judul}>{T.judul(bank)}</Text>
      </View>

      <View style={styles.kotak}>
        <View style={styles.baris}>
          <View style={styles.isi}>
            <Text style={styles.label}>{T.nomor}</Text>
            <Text style={styles.nomor}>{nomor}</Text>
          </View>
          <TombolSalin label={T.salin} sudah={tersalin === "nomor"} onPress={() => void salin("nomor", nomor)} />
        </View>

        <View style={styles.isi}>
          <Text style={styles.label}>{T.namaAkun}</Text>
          <Text style={styles.nama}>{namaAkun}</Text>
        </View>

        <View style={styles.baris}>
          <View style={styles.isiNominal}>
            <Text style={styles.label} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.8}>
              {T.total}
            </Text>
            {/* "Rp" tetap kecil; angka mengecil sendiri kalau ruangnya sempit, tombol tetap di kanan */}
            <View style={styles.nominalBaris} accessible accessibilityLabel={totalTeks}>
              <Text style={styles.mataUang}>Rp</Text>
              <Text style={styles.nominal} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.6}>
                {formatRibuan(total)}
              </Text>
            </View>
          </View>
          {/* Yang disalin hanya angkanya (tanpa "Rp" dan titik) supaya bisa ditempel di aplikasi bank */}
          <TombolSalin
            gelap
            label={T.salinJumlah}
            sudah={tersalin === "jumlah"}
            onPress={() => void salin("jumlah", String(Math.round(total)))}
          />
        </View>
      </View>

      <View style={styles.penting}>
        <View style={styles.pentingIkon}>
          <Ionicons name="information" size={13} color={colors.white} />
        </View>
        <TeksTebal teks={T.penting(totalTeks)} style={styles.pentingTeks} warnaTebal={colors.dark} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  kartu: { backgroundColor: colors.white, borderRadius: radius.lg, padding: spacing.lg, gap: spacing.md },
  judulBaris: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  judul: { fontSize: 14, fontWeight: "700", color: colors.text, textTransform: "uppercase" },
  kotak: { backgroundColor: colors.accentSoft, borderRadius: radius.lg, padding: spacing.lg, gap: spacing.lg },
  baris: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: spacing.md },
  isi: { flex: 1, gap: 4 },
  label: { fontSize: 10, fontWeight: "700", letterSpacing: 0.4, textTransform: "uppercase", color: colors.textSoft },
  nomor: { fontSize: 20, fontWeight: "800", letterSpacing: 0.5, color: colors.text, fontVariant: ["tabular-nums"] },
  nama: { fontSize: 15, fontWeight: "700", color: colors.text },
  isiNominal: { flex: 1, minWidth: 0, gap: 4 },
  nominalBaris: { flexDirection: "row", alignItems: "baseline", gap: 4 },
  nominal: { flexShrink: 1, fontSize: 26, fontWeight: "800", color: colors.dark, fontVariant: ["tabular-nums"] },
  mataUang: { fontSize: 16, fontWeight: "700", color: colors.dark },
  salin: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    minHeight: 40,
    paddingHorizontal: spacing.md,
    borderRadius: radius.md,
  },
  salinTerang: { backgroundColor: colors.white },
  salinGelap: { backgroundColor: colors.green },
  salinTeks: { fontSize: 13, fontWeight: "700" },
  penting: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.sm,
    backgroundColor: colors.accentSoftStrong,
    borderRadius: radius.md,
    padding: spacing.md,
  },
  pentingIkon: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.brown,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 1,
  },
  pentingTeks: { flex: 1, fontSize: 12, lineHeight: 18, color: colors.textSoft },
});
