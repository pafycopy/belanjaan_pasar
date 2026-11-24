import { useEffect, useRef, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Image } from "expo-image";
import * as Clipboard from "expo-clipboard";
import { Ionicons } from "@expo/vector-icons";
import RincianTagihan from "@/components/ngebelanjain/rinciantagihan";
import { GAMBAR_QRIS, NMID_QRIS } from "@/data/ngebelanjain";
import { TEKS_NGEBELANJAIN } from "@/data/teksngebelanjain";
import { useSekarang } from "@/hooks/usesekarang";
import { colors, radius, spacing } from "@/theme";
import { PesananNgebelanjain } from "@/types/ngebelanjain";
import { formatRibuan } from "@/utils/angka";
import { buatNomorVa, formatNomorVa } from "@/utils/ngebelanjain";
import { formatSisaWaktu, sisaDetik } from "@/utils/pembayaran";

type Props = {
  pesanan: PesananNgebelanjain;
  onKembali?: () => void; // kembali memilih metode pembayaran (hanya bila bar ditampilkan)
  bar?: boolean;          // false = tanpa bar judul, bila sudah ada header halaman
};

const T = TEKS_NGEBELANJAIN;
const T2 = T.menunggu;

// Isi "Menunggu Pembayaran": rincian tagihan, lalu QRIS atau Virtual Account (dengan hitung mundur) atau info COD
export default function MenungguBayar({ pesanan: p, onKembali, bar = true }: Props) {
  const sekarang = useSekarang();
  const [tersalin, setTersalin] = useState(false);
  const timerSalin = useRef<ReturnType<typeof setTimeout> | null>(null);

  const qris = p.metode === "qris";
  const va = p.metode === "transfer";
  const berbatas = qris || va;
  const sisa = berbatas && p.batasBayar ? sisaDetik(p.batasBayar, sekarang) : 0;
  const habis = berbatas && sisa === 0;
  const t = p.tagihan;
  const nomorVa = buatNomorVa(p.nomor);

  useEffect(() => () => {
    if (timerSalin.current) clearTimeout(timerSalin.current);
  }, []);

  const salin = async () => {
    await Clipboard.setStringAsync(nomorVa);
    setTersalin(true);
    if (timerSalin.current) clearTimeout(timerSalin.current);
    timerSalin.current = setTimeout(() => setTersalin(false), 2000);
  };

  return (
    <View style={styles.wadah}>
      {bar ? (
        <Pressable
          onPress={onKembali}
          style={styles.bar}
          accessibilityRole="button"
          accessibilityLabel={T2.kembali}
        >
          <Ionicons name="arrow-back" size={20} color={colors.textStrong} />
          <Text style={styles.barJudul}>{T2.judul}</Text>
        </Pressable>
      ) : null}

      <ScrollView contentContainerStyle={styles.isi} showsVerticalScrollIndicator={false}>
        <View style={styles.kartu}>
          <View style={styles.batasBaris}>
            <Text style={styles.batas}>{berbatas ? T2.batas : T2.cod}</Text>
            {berbatas ? (
              <View style={[styles.pil, habis && styles.pilHabis]}>
                <Text style={styles.pilTeks}>{T2.menit(formatSisaWaktu(sisa))}</Text>
              </View>
            ) : null}
          </View>
          <Text style={styles.noPesanan}>{T.noPesanan(p.nomor)}</Text>

          <RincianTagihan pesanan={p} />

          {habis ? (
            <Text style={styles.habis}>{T2.habis}</Text>
          ) : qris ? (
            <View style={styles.qrisWadah}>
              {GAMBAR_QRIS ? (
                <Image source={GAMBAR_QRIS} style={styles.qris} contentFit="contain" />
              ) : (
                <View style={[styles.qris, styles.qrisKosong]}>
                  <Ionicons name="qr-code" size={150} color={colors.textStrong} />
                  <Text style={styles.qrisKosongTeks}>{T2.qrisKosong}</Text>
                </View>
              )}
              <Text style={styles.poweredBy}>{T2.poweredBy}</Text>
              {NMID_QRIS ? <Text style={styles.nmid}>{T2.nmid(NMID_QRIS)}</Text> : null}
            </View>
          ) : va ? (
            <View style={styles.va}>
              <Text style={styles.vaLabel}>{T2.va.label}</Text>
              <Text selectable style={styles.vaNomor}>
                {formatNomorVa(nomorVa)}
              </Text>
              <Pressable onPress={() => void salin()} style={styles.salin} accessibilityRole="button">
                <Ionicons name={tersalin ? "checkmark" : "copy-outline"} size={14} color={colors.dark} />
                <Text style={styles.salinTeks}>{tersalin ? T2.va.tersalin : T2.va.salin}</Text>
              </Pressable>
              <Text style={styles.vaKet}>{T2.va.ket(t ? `Rp ${formatRibuan(t.total)}` : T2.sesuaiTagihan)}</Text>
              <Text style={styles.vaSimulasi}>{T2.va.simulasi}</Text>
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
  habis: { fontSize: 12, lineHeight: 18, color: colors.danger, textAlign: "center", marginTop: spacing.sm },
  qrisWadah: { alignItems: "center", gap: spacing.sm, marginTop: spacing.sm },
  qris: { width: 220, height: 220 },
  qrisKosong: { alignItems: "center", justifyContent: "center", gap: spacing.xs, backgroundColor: colors.white },
  qrisKosongTeks: { fontSize: 10, fontWeight: "800", color: colors.textStrong },
  poweredBy: { fontSize: 12, fontWeight: "800", color: colors.textStrong },
  nmid: { fontSize: 11, color: colors.textSoft },
  va: {
    alignItems: "center",
    gap: spacing.sm,
    backgroundColor: colors.accentSoft,
    borderRadius: radius.lg,
    padding: spacing.lg,
  },
  vaLabel: { fontSize: 12, color: colors.textSoft },
  vaNomor: { fontSize: 22, fontWeight: "900", letterSpacing: 1, color: colors.textStrong },
  salin: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    paddingHorizontal: spacing.md,
    paddingVertical: 5,
  },
  salinTeks: { fontSize: 12, fontWeight: "700", color: colors.dark },
  vaKet: { fontSize: 12, lineHeight: 18, color: colors.text, textAlign: "center" },
  vaSimulasi: { fontSize: 10, color: colors.muted },
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
