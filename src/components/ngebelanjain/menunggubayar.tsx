import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import Nominal from "@/components/ui/nominal";
import { GAMBAR_QRIS } from "@/data/ngebelanjain";
import { TEKS_NGEBELANJAIN } from "@/data/teksngebelanjain";
import { useSekarang } from "@/hooks/usesekarang";
import { colors, radius, spacing } from "@/theme";
import { PesananNgebelanjain } from "@/types/ngebelanjain";
import { formatRibuan } from "@/utils/angka";
import { pecahDaftar } from "@/utils/ngebelanjain";
import { formatSisaWaktu, sisaDetik } from "@/utils/pembayaran";

type Props = {
  pesanan: PesananNgebelanjain;
  onKembali: () => void; // kembali memilih metode pembayaran
};

const T = TEKS_NGEBELANJAIN;
const T2 = T.menunggu;
const rp = (n: number) => `Rp${formatRibuan(n)}`; // gaya tabel: "Rp80.000"

function BarisTabel({ kiri, kanan, tebal }: { kiri: string; kanan: string; tebal?: boolean }) {
  return (
    <View style={styles.barisTabel}>
      <Text style={[styles.kiri, tebal && styles.tebal]}>{kiri}</Text>
      <Text style={[styles.kanan, tebal && styles.tebal]}>{kanan}</Text>
    </View>
  );
}

// Tampilan "Menunggu Pembayaran": rincian tagihan, lalu QRIS (dengan hitung mundur) atau info COD
export default function MenungguBayar({ pesanan: p, onKembali }: Props) {
  const sekarang = useSekarang();
  const qris = p.metode === "qris";
  const sisa = qris && p.batasBayar ? sisaDetik(p.batasBayar, sekarang) : 0;
  const habis = qris && sisa === 0;
  const t = p.tagihan;
  const baris = pecahDaftar(p.daftar);

  return (
    <View style={styles.wadah}>
      <Pressable
        onPress={onKembali}
        style={styles.bar}
        accessibilityRole="button"
        accessibilityLabel={T2.kembali}
      >
        <Ionicons name="arrow-back" size={20} color={colors.textStrong} />
        <Text style={styles.barJudul}>{T2.judul}</Text>
      </Pressable>

      <ScrollView contentContainerStyle={styles.isi} showsVerticalScrollIndicator={false}>
        <View style={styles.kartu}>
          <View style={styles.batasBaris}>
            <Text style={styles.batas}>{qris ? T2.batas : T2.cod}</Text>
            {qris ? (
              <View style={[styles.pil, habis && styles.pilHabis]}>
                <Text style={styles.pilTeks}>{T2.menit(formatSisaWaktu(sisa))}</Text>
              </View>
            ) : null}
          </View>
          <Text style={styles.noPesanan}>{T.noPesanan(p.nomor)}</Text>

          <Text style={styles.judulBagian}>{T.pesananAnda}</Text>
          <View style={styles.bagian}>
            {baris.map((b, i) => (
              <BarisTabel key={i} kiri={b.nama} kanan={b.jumlah} />
            ))}
          </View>

          {t ? (
            <>
              <BarisTabel kiri={T2.rincian} kanan={T2.nominal} tebal />
              <View style={styles.bagian}>
                <BarisTabel kiri={T2.totalProduk} kanan={rp(t.totalProduk)} />
                <BarisTabel kiri={T2.jasaHelper} kanan={rp(t.jasaHelper)} />
                {p.pengiriman === "antar" ? <BarisTabel kiri={T2.ongkir} kanan={rp(t.ongkir)} /> : null}
              </View>
              <View style={styles.totalBaris}>
                <Text style={styles.totalLabel}>{T2.totalBayar}</Text>
                <Nominal nilai={t.total} ukuran={20} warna={colors.textStrong} />
              </View>
            </>
          ) : null}

          {habis ? (
            <Text style={styles.habis}>{T2.habis}</Text>
          ) : qris ? (
            <View style={styles.qrisWadah}>
              {GAMBAR_QRIS ? (
                <Image source={GAMBAR_QRIS} style={styles.qris} contentFit="contain" />
              ) : (
                <View style={[styles.qris, styles.qrisKosong]}>
                  <Ionicons name="qr-code-outline" size={110} color={colors.placeholder} />
                  <Text style={styles.qrisKosongTeks}>{T2.qrisKosong}</Text>
                </View>
              )}
              <Text style={styles.qrisKet}>{T2.qrisKet}</Text>
            </View>
          ) : t ? (
            <View style={styles.cod}>
              <Ionicons name="cash-outline" size={22} color={colors.dark} />
              <Text style={styles.codTeks}>{T2.codKet(`Rp ${formatRibuan(t.total)}`)}</Text>
            </View>
          ) : null}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wadah: { flex: 1 },
  bar: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    backgroundColor: colors.white,
    paddingHorizontal: 14,
    paddingVertical: spacing.md,
  },
  barJudul: { fontSize: 15, fontWeight: "800", color: colors.textStrong },
  isi: { padding: 14, paddingBottom: spacing.xl },
  kartu: { backgroundColor: colors.white, borderRadius: radius.xl, padding: spacing.lg, gap: spacing.md },
  batasBaris: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: spacing.md },
  batas: { fontSize: 14, fontWeight: "800", color: colors.textStrong },
  pil: { backgroundColor: colors.dark, borderRadius: radius.md, paddingHorizontal: spacing.md, paddingVertical: 5 },
  pilHabis: { backgroundColor: colors.danger },
  pilTeks: { fontSize: 12, fontWeight: "800", color: colors.white, fontVariant: ["tabular-nums"] },
  noPesanan: { fontSize: 11, color: colors.textSoft },
  judulBagian: { fontSize: 14, fontWeight: "800", color: colors.textStrong, marginTop: spacing.xs },
  bagian: { gap: 6 },
  barisTabel: { flexDirection: "row", justifyContent: "space-between", gap: spacing.md },
  kiri: { flex: 1, fontSize: 13, color: colors.text },
  kanan: { fontSize: 13, color: colors.text, textAlign: "right" },
  tebal: { fontWeight: "800", color: colors.textStrong },
  totalBaris: { flexDirection: "row", alignItems: "baseline", justifyContent: "space-between", gap: spacing.md },
  totalLabel: { fontSize: 12, color: colors.textSoft },
  habis: { fontSize: 12, lineHeight: 18, color: colors.danger, textAlign: "center", marginTop: spacing.sm },
  qrisWadah: { alignItems: "center", gap: spacing.sm, marginTop: spacing.sm },
  qris: { width: 220, height: 220 },
  qrisKosong: {
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    borderWidth: 1.5,
    borderStyle: "dashed",
    borderColor: colors.border,
    borderRadius: radius.lg,
  },
  qrisKosongTeks: { fontSize: 11, color: colors.muted },
  qrisKet: { fontSize: 12, color: colors.textSoft },
  cod: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    backgroundColor: colors.accentSoft,
    borderRadius: radius.md,
    padding: spacing.md,
    marginTop: spacing.sm,
  },
  codTeks: { flex: 1, fontSize: 12, lineHeight: 18, color: colors.text },
});
