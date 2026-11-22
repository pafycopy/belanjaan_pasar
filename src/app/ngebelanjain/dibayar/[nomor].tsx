import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import HeaderHijau from "@/components/ui/headerhijau";
import Nominal from "@/components/ui/nominal";
import ScreenState from "@/components/ui/screenstate";
import BarisRincian from "@/components/ngebelanjain/barisrincian";
import DaftarRingkasan from "@/components/ngebelanjain/daftarringkasan";
import { useNgebelanjain } from "@/context/ngebelanjain";
import { NAMA_METODE_NGEBELANJAIN } from "@/data/ngebelanjain";
import { TEKS_NGEBELANJAIN } from "@/data/teksngebelanjain";
import { colors, spacing } from "@/theme";
import { pecahDaftar } from "@/utils/ngebelanjain";
import { formatJamWib } from "@/utils/waktu";

const T = TEKS_NGEBELANJAIN.dibayar;

// Halaman Detail Pembayaran: bukti pembayaran lengkap satu pesanan Ngebelanjain
export default function DetailPembayaran() {
  const { nomor } = useLocalSearchParams<{ nomor?: string }>();
  const { pesanan, memuat } = useNgebelanjain();

  const p = pesanan.find((x) => x.nomor === nomor && (x.status === "dibayar" || x.status === "selesai"));
  const baris = p ? pecahDaftar(p.daftar) : [];

  return (
    <View style={styles.screen}>
      <HeaderHijau judul={T.detailPembayaran} />

      {memuat ? (
        <ScreenState loading />
      ) : !p ? (
        <ScreenState message={TEKS_NGEBELANJAIN.halamanDetail.tidakDitemukan} />
      ) : (
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.hero}>
            <View style={styles.halo}>
              <View style={styles.lingkaran}>
                <Ionicons name="checkmark" size={38} color={colors.white} />
              </View>
            </View>
            <Text style={styles.judul}>{T.chip}</Text>
          </View>

          <View style={styles.rincian}>
            <BarisRincian kiri={T.nomor} kanan={`#${p.nomor}`} hijau />
            <BarisRincian kiri={T.ringkasan} kanan={T.produk(baris.length)} hijau />
            <DaftarRingkasan baris={baris} bacaLagi={T.bacaSelengkapnya} />
            <BarisRincian kiri={T.metode} kanan={p.metode ? NAMA_METODE_NGEBELANJAIN[p.metode] : "-"} />
            <BarisRincian kiri={T.waktu} kanan={p.dibayarPada ? `${formatJamWib(p.dibayarPada)} WIB` : "-"} />
          </View>

          <View style={styles.total}>
            <Text style={styles.totalLabel}>{T.totalDibayar}</Text>
            <Nominal nilai={p.tagihan?.total ?? 0} ukuran={34} warna={colors.textStrong} />
          </View>

          <Text style={styles.catatan}>{T.catatan}</Text>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.white },
  content: { padding: spacing.xl, paddingBottom: spacing.xl * 2 },
  hero: { alignItems: "center", gap: spacing.md },
  halo: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: colors.mintFade,
    alignItems: "center",
    justifyContent: "center",
  },
  lingkaran: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: colors.primaryDeep,
    alignItems: "center",
    justifyContent: "center",
  },
  judul: { fontSize: 20, fontWeight: "800", color: colors.dark },
  rincian: { gap: 10, marginTop: spacing.xl },
  total: { alignItems: "center", gap: 4, marginTop: spacing.xl * 1.5 },
  totalLabel: { fontSize: 12, color: colors.textSoft },
  catatan: {
    fontSize: 12,
    lineHeight: 18,
    color: colors.textSoft,
    textAlign: "center",
    marginTop: spacing.xl * 1.5,
  },
});
