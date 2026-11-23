import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Nominal from "@/components/ui/nominal";
import DaftarRingkasan from "@/components/ngebelanjain/daftarringkasan";
import { TEKS_NGEBELANJAIN } from "@/data/teksngebelanjain";
import { colors, radius, spacing } from "@/theme";
import { PesananNgebelanjain } from "@/types/ngebelanjain";
import { pecahDaftar } from "@/utils/ngebelanjain";
import { formatTanggalJamWib } from "@/utils/waktu";

type Props = { pesanan: PesananNgebelanjain; onPress: () => void };

/** Kartu khusus Ngebelanjain di tab Pesanan > Selesai. Barang ditampilkan sebagai daftar teks, bukan katalog produk. */
export default function KartuNgebelanjainSelesai({ pesanan: p, onPress }: Props) {
  const daftar = pecahDaftar(p.daftar);
  const waktu = p.dibayarPada ?? p.dibuatPada;

  return (
    <Pressable onPress={onPress} style={styles.kartu} accessibilityRole="button">
      <View style={styles.kepala}>
        <View style={styles.judulBaris}>
          <Ionicons name="receipt-outline" size={16} color={colors.primaryDeep} />
          <Text style={styles.judul}>Ngebelanjain</Text>
          <View style={styles.badge}><Text style={styles.badgeTeks}>Selesai</Text></View>
        </View>
        <Text style={styles.nomor}>#{p.nomor}</Text>
      </View>

      <View style={styles.waktuBaris}>
        <Ionicons name="calendar-outline" size={13} color={colors.textSoft} />
        <Text style={styles.waktu}>{formatTanggalJamWib(waktu)}</Text>
      </View>

      <View style={styles.daftarWrap}>
        <Text style={styles.labelDaftar}>{TEKS_NGEBELANJAIN.pesananAnda}</Text>
        <DaftarRingkasan baris={daftar} bacaLagi={TEKS_NGEBELANJAIN.bacaSelengkapnya} />
      </View>

      <View style={styles.bawah}>
        <View style={styles.totalWrap}>
          <Text style={styles.labelTotal}>Total dibayar</Text>
          <Nominal nilai={p.tagihan?.total ?? 0} ukuran={17} warna={colors.textStrong} />
        </View>
        <View style={styles.detail}>
          <Text style={styles.detailTeks}>Rincian</Text>
          <Ionicons name="chevron-forward" size={16} color={colors.textSoft} />
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  kartu: { backgroundColor: colors.white, borderRadius: radius.xl, padding: spacing.lg, gap: spacing.md, shadowColor: colors.shadow, shadowOpacity: 0.07, shadowRadius: 7, shadowOffset: { width: 0, height: 2 }, elevation: 2 },
  kepala: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: spacing.sm },
  judulBaris: { flexDirection: "row", alignItems: "center", gap: 6, flex: 1, flexWrap: "wrap" },
  judul: { fontSize: 13, fontWeight: "800", color: colors.textStrong },
  badge: { backgroundColor: colors.mintFade, borderRadius: radius.xl, paddingHorizontal: 9, paddingVertical: 3 },
  badgeTeks: { fontSize: 10, fontWeight: "800", color: colors.primaryDeep },
  nomor: { fontSize: 11, fontWeight: "700", color: colors.textSoft },
  waktuBaris: { flexDirection: "row", alignItems: "center", gap: 5 },
  waktu: { fontSize: 11, color: colors.textSoft },
  daftarWrap: { backgroundColor: colors.canvas, borderRadius: radius.md, padding: spacing.md, gap: spacing.sm },
  labelDaftar: { fontSize: 12, fontWeight: "800", color: colors.textStrong },
  bawah: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: spacing.md },
  totalWrap: { gap: 2 },
  labelTotal: { fontSize: 11, color: colors.textSoft },
  detail: { flexDirection: "row", alignItems: "center", gap: 2 },
  detailTeks: { fontSize: 12, color: colors.textSoft },
});
