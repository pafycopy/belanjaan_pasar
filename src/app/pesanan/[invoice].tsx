import { ReactNode } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Button from "@/components/ui/button";
import FooterBar from "@/components/ui/footerbar";
import HeaderHijau from "@/components/ui/headerhijau";
import ScreenState from "@/components/ui/screenstate";
import RingkasanPesanan from "@/components/pembayaran/ringkasanpesanan";
import { usePesanan } from "@/context/pesanan";
import { TEKS } from "@/data/teks";
import { usePesanUlang } from "@/hooks/usepesanulang";
import { useSalin } from "@/hooks/usesalin";
import { colors, radius, spacing } from "@/theme";
import { Pesanan, StatusPesanan } from "@/types/pesanan";
import { infoWaktu, labelPembayaran } from "@/utils/pesanan";
import { formatHarga } from "@/utils/produk";
import { formatWaktuLengkapWib } from "@/utils/waktu";

const T = TEKS.pesanan.detail;

const GAYA_BANNER: Record<StatusPesanan, { bg: string; ikon: "time-outline" | "bicycle" | "checkmark-circle"; warna: string }> = {
  disiapkan: { bg: colors.goldSoft, ikon: "time-outline", warna: colors.brown },
  dikirim: { bg: colors.primarySoft, ikon: "bicycle", warna: colors.dark },
  selesai: { bg: colors.accentSoftStrong, ikon: "checkmark-circle", warna: colors.dark },
};

/* ---------- pembungkus: cari pesanan dari daftar ---------- */

// Layar baca-saja: hanya menampilkan isi pesanan. Memesan lagi lewat tombol "Pesan Ulang" (pesanan selesai).
export default function DetailPesanan() {
  const { invoice } = useLocalSearchParams<{ invoice: string }>();
  const { pesanan, memuat } = usePesanan();
  const p = pesanan.find((x) => x.invoice === invoice);

  return (
    <View style={styles.screen}>
      <HeaderHijau judul={T.judul} />
      {memuat ? <ScreenState loading /> : p ? <IsiDetail pesanan={p} /> : <ScreenState message={T.tidakDitemukan} />}
    </View>
  );
}

/* ---------- isi ---------- */

function BarisInfo({ label, nilai, kanan }: { label: string; nilai: string; kanan?: ReactNode }) {
  return (
    <View style={styles.barisInfo}>
      <Text style={styles.infoLabel}>{label}</Text>
      <View style={styles.infoKanan}>
        <Text style={styles.infoNilai}>{nilai}</Text>
        {kanan}
      </View>
    </View>
  );
}

function BarisRincian({ label, nilai, tebal }: { label: string; nilai: string; tebal?: boolean }) {
  return (
    <View style={styles.barisInfo}>
      <Text style={[styles.rincianLabel, tebal && styles.rincianTebal]}>{label}</Text>
      <Text style={[styles.rincianNilai, tebal && styles.rincianTotal]}>{nilai}</Text>
    </View>
  );
}

function IsiDetail({ pesanan: p }: { pesanan: Pesanan }) {
  const pesanUlang = usePesanUlang();
  const { tersalin, salin } = useSalin<"invoice">();
  const waktu = infoWaktu(p);
  const banner = GAYA_BANNER[p.status];
  const segera = (pesan: string) => Alert.alert(TEKS.pesanan.segera.judul, pesan);

  return (
    <>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={[styles.banner, { backgroundColor: banner.bg }]}>
          <Ionicons name={banner.ikon} size={28} color={banner.warna} />
          <View style={styles.bannerIsi}>
            <Text style={[styles.bannerJudul, { color: banner.warna }]}>{T.statusJudul[p.status]}</Text>
            <Text style={styles.bannerWaktu}>{`${waktu.label}: ${waktu.nilai}`}</Text>
          </View>
        </View>

        <View style={styles.seksi}>
          <RingkasanPesanan tagihan={p} />
        </View>

        <View style={styles.seksi}>
          <View style={styles.kartu}>
            <Text style={styles.kartuJudul}>{T.rincian.judul}</Text>
            <BarisRincian label={T.rincian.subtotal} nilai={formatHarga(p.subtotal)} />
            <BarisRincian
              label={T.rincian.ongkir}
              nilai={p.ongkir === null ? T.rincian.ambil : formatHarga(p.ongkir)}
            />
            <View style={styles.garis} />
            <BarisRincian label={T.rincian.total} nilai={formatHarga(p.total)} tebal />
          </View>
        </View>

        <View style={styles.seksi}>
          <View style={styles.kartu}>
            <Text style={styles.kartuJudul}>{T.info.judul}</Text>
            <BarisInfo
              label={T.info.noPesanan}
              nilai={`#${p.invoice}`}
              kanan={
                <Pressable
                  onPress={() => void salin("invoice", p.invoice)}
                  hitSlop={8}
                  accessibilityRole="button"
                  accessibilityLabel={T.info.salin}
                >
                  <Ionicons name={tersalin ? "checkmark" : "copy-outline"} size={16} color={colors.dark} />
                </Pressable>
              }
            />
            <BarisInfo label={T.info.waktuBayar} nilai={formatWaktuLengkapWib(p.dibayarPada)} />
            <BarisInfo label={T.info.metode} nilai={labelPembayaran(p)} />
          </View>
        </View>
      </ScrollView>

      {/* Tombol aksi hanya untuk pesanan yang sedang dikirim atau sudah selesai */}
      {p.status === "dikirim" ? (
        <FooterBar bordered={false} background={colors.barBg}>
          <Button label={TEKS.pesanan.aksi.chat} size="lg" onPress={() => segera(TEKS.pesanan.segera.chat)} />
        </FooterBar>
      ) : null}

      {p.status === "selesai" ? (
        <FooterBar bordered={false} background={colors.barBg}>
          <View style={styles.footerBaris}>
            <Button
              label={TEKS.pesanan.aksi.nilai}
              variant="light"
              size="lg"
              onPress={() => segera(TEKS.pesanan.segera.nilai)}
              style={styles.footerTombol}
            />
            <Button
              label={TEKS.pesanan.aksi.ulang}
              size="lg"
              onPress={() => void pesanUlang(p)}
              style={styles.footerTombol}
            />
          </View>
        </FooterBar>
      ) : null}
    </>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.canvas },
  content: { paddingBottom: spacing.lg },
  banner: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
  },
  bannerIsi: { flex: 1, gap: 2 },
  bannerJudul: { fontSize: 16, fontWeight: "800" },
  bannerWaktu: { fontSize: 12, color: colors.textSoft },
  seksi: { paddingHorizontal: spacing.lg, marginTop: spacing.md },
  kartu: { backgroundColor: colors.white, borderRadius: radius.lg, padding: spacing.lg, gap: spacing.md },
  kartuJudul: { fontSize: 15, fontWeight: "800", color: colors.text },
  barisInfo: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: spacing.md },
  infoLabel: { fontSize: 12, color: colors.textSoft },
  infoKanan: { flexShrink: 1, flexDirection: "row", alignItems: "center", gap: spacing.sm },
  infoNilai: { flexShrink: 1, fontSize: 12, fontWeight: "700", color: colors.text, textAlign: "right" },
  rincianLabel: { fontSize: 13, color: colors.textSoft },
  rincianTebal: { fontWeight: "800", color: colors.text },
  rincianNilai: { fontSize: 13, fontWeight: "700", color: colors.text },
  rincianTotal: { fontSize: 15, fontWeight: "800", color: colors.dark },
  garis: { height: 1, backgroundColor: colors.border },
  footerBaris: { flexDirection: "row", gap: spacing.md },
  footerTombol: { flex: 1 },
});
