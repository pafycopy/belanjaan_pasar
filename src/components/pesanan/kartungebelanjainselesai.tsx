import { Pressable, StyleSheet, Text, View } from "react-native";
import Nominal from "@/components/ui/nominal";
import DaftarRingkasan from "@/components/ngebelanjain/daftarringkasan";
import { TEKS_NGEBELANJAIN } from "@/data/teksngebelanjain";
import { colors, radius, spacing } from "@/theme";
import { PesananNgebelanjain } from "@/types/ngebelanjain";
import { pecahDaftar } from "@/utils/ngebelanjain";
import { formatTanggalJamWib } from "@/utils/waktu";

type Props = {
  pesanan: PesananNgebelanjain;
  onDetail: () => void;
  onNilai: () => void;
  onPesanUlang: () => void;
};

/** Kartu Ngebelanjain pada tab Pesanan > Selesai. */
export default function KartuNgebelanjainSelesai({
  pesanan: p,
  onDetail,
  onNilai,
  onPesanUlang,
}: Props) {
  const daftar = pecahDaftar(p.daftar);
  const waktu = p.selesaiPada ?? p.dibayarPada ?? p.dibuatPada;
  const metode =
    p.metode === "transfer"
      ? "Transfer BCA"
      : p.metode === "qris"
        ? "QRIS"
        : p.metode === "cod"
          ? "COD"
          : "Pembayaran";

  return (
    <View style={styles.kartu}>
      {/* Area isi kartu dapat ditekan untuk membuka detail pesanan. */}
      <Pressable
        onPress={onDetail}
        style={styles.areaDetail}
        accessibilityRole="button"
        accessibilityLabel={`Lihat detail pesanan Ngebelanjain ${p.nomor}`}
      >
        <View style={styles.barisAtas}>
          <View style={styles.badge}>
            <Text style={styles.badgeTeks}>Selesai</Text>
          </View>
          <Text style={styles.judul}>Ngebelanjain</Text>
        </View>

        <View style={styles.barisInfo}>
          <Text style={styles.nomor}>No. Pesanan: #{p.nomor}</Text>
          <Text style={styles.waktu}>{formatTanggalJamWib(waktu)}</Text>
        </View>

        <View style={styles.daftarWrap}>
          <Text style={styles.labelDaftar}>{TEKS_NGEBELANJAIN.pesananAnda}</Text>
          <DaftarRingkasan baris={daftar} bacaLagi={TEKS_NGEBELANJAIN.bacaSelengkapnya} />
        </View>

        <View style={styles.barisTotal}>
          <Text style={styles.metode}>{metode}</Text>
          <Nominal nilai={p.tagihan?.total ?? 0} ukuran={20} warna={colors.textStrong} />
        </View>

        <View style={styles.petunjuk}>
          <Text style={styles.petunjukTeks}>Lihat detail pesanan</Text>
        </View>
      </Pressable>

      {/* Tombol aksi dipisah agar tidak ikut memicu navigasi detail. */}
      <View style={styles.aksi}>
        <Pressable onPress={onNilai} style={[styles.tombol, styles.tombolLembut]} accessibilityRole="button">
          <Text style={[styles.tombolTeks, styles.teksGelap]}>Penilaian Produk</Text>
        </Pressable>
        <Pressable onPress={onPesanUlang} style={[styles.tombol, styles.tombolHijau]} accessibilityRole="button">
          <Text style={[styles.tombolTeks, styles.teksPutih]}>Ngebelanjain Lagi</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  kartu: {
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    padding: spacing.lg,
    gap: spacing.md,
    shadowColor: colors.shadow,
    shadowOpacity: 0.12,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  areaDetail: { gap: spacing.md },
  barisAtas: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  badge: { backgroundColor: colors.primaryDeep, borderRadius: radius.xl, paddingHorizontal: 10, paddingVertical: 4 },
  badgeTeks: { fontSize: 11, fontWeight: "800", color: colors.white },
  judul: { fontSize: 14, fontWeight: "800", color: colors.textStrong },
  barisInfo: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 8 },
  nomor: { fontSize: 11, color: colors.textSoft, flex: 1 },
  waktu: { fontSize: 14, fontWeight: "800", color: colors.textStrong },
  daftarWrap: { gap: 6 },
  labelDaftar: { fontSize: 14, fontWeight: "800", color: colors.textStrong },
  barisTotal: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingTop: 1 },
  metode: { fontSize: 12, color: colors.textSoft },
  petunjuk: { alignItems: "flex-end" },
  petunjukTeks: { fontSize: 11, fontWeight: "700", color: colors.primaryDeep },
  aksi: { flexDirection: "row", gap: 7 },
  tombol: { flex: 1, minHeight: 46, borderRadius: radius.lg, alignItems: "center", justifyContent: "center", paddingHorizontal: spacing.md },
  tombolLembut: { backgroundColor: "#ECEEFF" },
  tombolHijau: { backgroundColor: colors.primaryDeep },
  tombolTeks: { fontSize: 13, fontWeight: "800", textAlign: "center" },
  teksGelap: { color: colors.textStrong },
  teksPutih: { color: colors.white },
});
