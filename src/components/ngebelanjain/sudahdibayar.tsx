import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Nominal from "@/components/ui/nominal";
import { NAMA_METODE_NGEBELANJAIN } from "@/data/ngebelanjain";
import { TEKS_NGEBELANJAIN } from "@/data/teksngebelanjain";
import { colors, radius, spacing } from "@/theme";
import { PesananNgebelanjain } from "@/types/ngebelanjain";
import { pecahDaftar } from "@/utils/ngebelanjain";
import { formatJamWib } from "@/utils/waktu";

type Props = { pesanan: PesananNgebelanjain };

const T = TEKS_NGEBELANJAIN.dibayar;

function Baris({ kiri, kanan, hijau }: { kiri: string; kanan: string; hijau?: boolean }) {
  return (
    <View style={styles.baris}>
      <Text style={styles.kiriTebal}>{kiri}</Text>
      <Text style={[styles.kanan, hijau && styles.hijau]}>{kanan}</Text>
    </View>
  );
}

// Kartu "Sudah Dibayar": bukti pembayaran Ngebelanjain
export default function SudahDibayar({ pesanan: p }: Props) {
  const baris = pecahDaftar(p.daftar);
  const metode = p.metode ? NAMA_METODE_NGEBELANJAIN[p.metode] : "-";

  return (
    <View style={styles.kartu}>
      <View style={styles.chip}>
        <Ionicons name="checkmark-circle" size={15} color={colors.dark} />
        <Text style={styles.chipTeks}>{T.chip}</Text>
      </View>

      <Baris kiri={T.nomor} kanan={`#${p.nomor}`} hijau />
      <Baris kiri={T.ringkasan} kanan={T.produk(baris.length)} hijau />

      <View style={styles.daftar}>
        {baris.map((b, i) => (
          <View key={i} style={styles.baris}>
            <Text style={styles.nama}>{b.nama}</Text>
            <Text style={styles.jumlah}>{b.jumlah}</Text>
          </View>
        ))}
      </View>

      <View style={styles.garis} />

      <Baris kiri={T.metode} kanan={metode} />
      <Baris kiri={T.waktu} kanan={p.dibayarPada ? `${formatJamWib(p.dibayarPada)} WIB` : "-"} />

      <View style={styles.totalBaris}>
        <View style={styles.totalKiri}>
          <Text style={styles.totalLabel}>{T.totalDibayar}</Text>
          <Nominal nilai={p.tagihan?.total ?? 0} ukuran={20} warna={colors.textStrong} />
        </View>
        <Text style={styles.lunas}>{T.lunas}</Text>
      </View>

      <View style={styles.catatan}>
        <Text style={styles.catatanTeks}>{T.catatan}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  kartu: { backgroundColor: colors.white, borderRadius: radius.xl, padding: spacing.lg, gap: spacing.md },
  chip: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: colors.mintFade,
    borderRadius: radius.xl,
    paddingHorizontal: spacing.md,
    paddingVertical: 4,
  },
  chipTeks: { fontSize: 11, fontWeight: "800", color: colors.dark },
  baris: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: spacing.md },
  kiriTebal: { fontSize: 13, fontWeight: "800", color: colors.textStrong },
  kanan: { fontSize: 13, fontWeight: "700", color: colors.textStrong },
  hijau: { color: colors.dark },
  daftar: { gap: 6 },
  nama: { flex: 1, fontSize: 13, color: colors.text },
  jumlah: { fontSize: 13, color: colors.text, textAlign: "right" },
  garis: { height: 1, backgroundColor: colors.border },
  totalBaris: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: spacing.md },
  totalKiri: { gap: 2, flexShrink: 1 },
  totalLabel: { fontSize: 12, color: colors.textSoft },
  lunas: { fontSize: 15, fontWeight: "800", color: colors.dark },
  catatan: { backgroundColor: colors.accentSoft, borderRadius: radius.md, padding: spacing.md },
  catatanTeks: { fontSize: 12, lineHeight: 18, color: colors.textSoft, textAlign: "center" },
});
