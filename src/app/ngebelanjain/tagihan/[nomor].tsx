import { useEffect, useMemo, useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import Button from "@/components/ui/button";
import HeaderHijau from "@/components/ui/headerhijau";
import ScreenState from "@/components/ui/screenstate";
import Nominal from "@/components/ui/nominal";
import { GAMBAR_QRIS } from "@/data/ngebelanjain";
import { BATAS_BAYAR_MENIT } from "@/data/pembayaran";
import { TEKS_NGEBELANJAIN } from "@/data/teksngebelanjain";
import { useNgebelanjain } from "@/context/ngebelanjain";
import { useSekarang } from "@/hooks/usesekarang";
import { colors, radius, spacing } from "@/theme";
import { kedaluwarsaMetode } from "@/utils/ngebelanjain";
import { formatRibuan } from "@/utils/angka";
import { formatSisaWaktu, sisaDetik } from "@/utils/pembayaran";

const T = TEKS_NGEBELANJAIN;
const rupiah = (nilai: number) => `Rp${formatRibuan(nilai)}`;

export default function TagihanNgebelanjain() {
  const router = useRouter();
  const { nomor } = useLocalSearchParams<{ nomor?: string }>();
  const { pesanan, memuat, perbarui } = useNgebelanjain();
  const sekarang = useSekarang();
  const [memproses, setMemproses] = useState(false);
  const pesananAktif = pesanan.find((p) => p.nomor === nomor && p.status === "pembayaran");
  const metode = pesananAktif?.metode;
  const batas = pesananAktif?.batasBayar;
  const sisa = batas ? sisaDetik(batas, sekarang) : 0;
  const habis = Boolean(batas && sisa === 0);
  const total = pesananAktif?.tagihan?.total ?? 0;
  const nomorVA = useMemo(() => `8808${(nomor ?? "").replace(/\D/g, "").padStart(10, "0")}`, [nomor]);

  useEffect(() => {
    if (!pesananAktif || !habis || memproses) return;
    setMemproses(true);
    perbarui(pesananAktif.nomor, kedaluwarsaMetode)
      .then(() => router.replace({ pathname: "/(tabs)/ngebelanjain", params: { tab: "pembayaran", ts: String(Date.now()) } }))
      .catch(() => {
        setMemproses(false);
        Alert.alert("Gagal memperbarui pesanan", "Silakan kembali ke Pembayaran Tersedia.");
      });
  }, [pesananAktif?.nomor, habis, memproses]);

  const simulasiLunas = async () => {
    if (!pesananAktif || memproses) return;
    setMemproses(true);
    try {
      await perbarui(pesananAktif.nomor, (p) => ({
        ...p,
        status: "dibayar",
        dibayarPada: Date.now(),
        batasBayar: undefined,
        pembayaranKedaluwarsa: false,
      }));
      router.replace({ pathname: "/(tabs)/ngebelanjain", params: { tab: "dibayar", ts: String(Date.now()) } });
    } catch {
      setMemproses(false);
      Alert.alert("Pembayaran belum dapat diperbarui", "Coba lagi.");
    }
  };

  return (
    <View style={styles.screen}>
      <HeaderHijau judul="Menunggu Pembayaran" />
      {memuat ? <ScreenState loading /> : !pesananAktif || (metode !== "qris" && metode !== "transfer") ? (
        <ScreenState message="Tagihan pembayaran tidak ditemukan." />
      ) : (
        <>
          <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
            <View style={styles.card}>
              <View style={styles.rowBetween}>
                <Text style={styles.heading}>Batas waktu pembayaran</Text>
                <View style={[styles.timer, habis && styles.timerHabis]}>
                  <Text style={styles.timerText}>{formatSisaWaktu(sisa)} MENIT</Text>
                </View>
              </View>
              <Text style={styles.muted}>No. Pesanan: #{pesananAktif.nomor}</Text>
              <Text style={styles.sectionTitle}>Pesanan Anda</Text>
              <Text style={styles.body}>{pesananAktif.daftar}</Text>
              <Text style={styles.sectionTitle}>Rincian</Text>
              <View style={styles.rowBetween}><Text style={styles.body}>Total Produk</Text><Text style={styles.body}>{rupiah(pesananAktif.tagihan?.totalProduk ?? 0)}</Text></View>
              <View style={styles.rowBetween}><Text style={styles.body}>Jasa Helper</Text><Text style={styles.body}>{rupiah(pesananAktif.tagihan?.jasaHelper ?? 0)}</Text></View>
              {pesananAktif.pengiriman === "antar" ? <View style={styles.rowBetween}><Text style={styles.body}>Ongkir</Text><Text style={styles.body}>{rupiah(pesananAktif.tagihan?.ongkir ?? 0)}</Text></View> : null}
              <View style={[styles.rowBetween, styles.total]}><Text style={styles.muted}>Total Pembayaran:</Text><Nominal nilai={total} ukuran={20} warna={colors.textStrong} /></View>

              {metode === "qris" ? (
                <View style={styles.paymentBox}>
                  {GAMBAR_QRIS ? <Image source={GAMBAR_QRIS} style={styles.qrImage} contentFit="contain" /> : (
                    <View style={styles.qrPlaceholder}>
                      <Ionicons name="qr-code" size={174} color={colors.textStrong} />
                      <Text style={styles.placeholderText}>QRIS DEMO</Text>
                    </View>
                  )}
                  <Text style={styles.paymentName}>Powered by QRIS</Text>
                  <Text style={styles.muted}>Tagihan #{pesananAktif.nomor}</Text>
                </View>
              ) : (
                <View style={styles.vaBox}>
                  <Text style={styles.muted}>BCA Virtual Account</Text>
                  <Text selectable style={styles.vaNumber}>{nomorVA}</Text>
                  <Text style={styles.muted}>Nomor VA simulasi untuk pengembangan</Text>
                </View>
              )}
            </View>
          </ScrollView>
          {__DEV__ ? (
            <View style={styles.footer}>
              <Button label="DEV: Simulasikan Pembayaran Berhasil" size="lg" loading={memproses} onPress={() => void simulasiLunas()} />
            </View>
          ) : null}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.canvas },
  scroll: { padding: 12, paddingBottom: 20 },
  card: { backgroundColor: colors.white, borderRadius: radius.xl, padding: spacing.lg, gap: spacing.md },
  rowBetween: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: spacing.md },
  heading: { fontSize: 13, fontWeight: "800", color: colors.textStrong },
  timer: { backgroundColor: colors.dark, borderRadius: radius.md, paddingHorizontal: 10, paddingVertical: 5 },
  timerHabis: { backgroundColor: colors.danger },
  timerText: { color: colors.white, fontSize: 11, fontWeight: "800", fontVariant: ["tabular-nums"] },
  muted: { color: colors.textSoft, fontSize: 11 },
  sectionTitle: { color: colors.textStrong, fontWeight: "800", fontSize: 14, marginTop: spacing.xs },
  body: { color: colors.text, fontSize: 12, lineHeight: 18 },
  total: { borderTopWidth: 1, borderTopColor: colors.border, paddingTop: spacing.md, marginTop: spacing.xs },
  paymentBox: { alignItems: "center", gap: spacing.sm, paddingTop: spacing.md },
  qrImage: { width: 220, height: 220 },
  qrPlaceholder: { width: 220, height: 220, alignItems: "center", justifyContent: "center", backgroundColor: colors.white },
  placeholderText: { fontSize: 10, fontWeight: "800", color: colors.textStrong },
  paymentName: { fontSize: 12, fontWeight: "800", color: colors.textStrong },
  vaBox: { alignItems: "center", gap: spacing.md, paddingVertical: spacing.xl, paddingHorizontal: spacing.md, backgroundColor: colors.canvas, borderRadius: radius.lg },
  vaNumber: { fontSize: 22, fontWeight: "900", letterSpacing: 1, color: colors.textStrong },
  footer: { padding: 12, backgroundColor: colors.white },
});
