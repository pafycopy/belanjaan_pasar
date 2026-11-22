import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Button from "@/components/ui/button";
import Nominal from "@/components/ui/nominal";
import BarisRincian from "@/components/ngebelanjain/barisrincian";
import DaftarRingkasan from "@/components/ngebelanjain/daftarringkasan";
import { TEKS_NGEBELANJAIN } from "@/data/teksngebelanjain";
import { colors, radius, spacing } from "@/theme";
import { PesananNgebelanjain } from "@/types/ngebelanjain";
import { pecahDaftar } from "@/utils/ngebelanjain";

type Props = {
  pesanan: PesananNgebelanjain;
  onDetail: () => void; // buka halaman Detail Pembayaran
};

const T = TEKS_NGEBELANJAIN.dibayar;

// Kartu ringkas tab "Sudah Dibayar". Rincian lengkap (metode, waktu) ada di halaman Detail Pembayaran.
export default function SudahDibayar({ pesanan: p, onDetail }: Props) {
  const baris = pecahDaftar(p.daftar);

  return (
    <View style={styles.kartu}>
      <View style={styles.chip}>
        <Ionicons name="checkmark-circle" size={15} color={colors.dark} />
        <Text style={styles.chipTeks}>{T.chip}</Text>
      </View>

      <BarisRincian kiri={T.nomor} kanan={`#${p.nomor}`} hijau />
      <BarisRincian kiri={T.ringkasan} kanan={T.produk(baris.length)} hijau />

      <DaftarRingkasan baris={baris} bacaLagi={T.bacaSelengkapnya} />

      <View style={styles.totalBaris}>
        <View style={styles.totalKiri}>
          <Text style={styles.totalLabel}>{T.totalDibayar}</Text>
          <Nominal nilai={p.tagihan?.total ?? 0} ukuran={20} warna={colors.textStrong} />
        </View>
        <Text style={styles.lunas}>{T.lunas}</Text>
      </View>

      <Button label={T.detailPembayaran} variant="muted" size="lg" onPress={onDetail} />
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
  totalBaris: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: spacing.md },
  totalKiri: { gap: 2, flexShrink: 1 },
  totalLabel: { fontSize: 12, color: colors.textSoft },
  lunas: { fontSize: 15, fontWeight: "800", color: colors.dark },
});
