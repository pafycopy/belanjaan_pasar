import { useEffect, useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import HeaderHijau from "@/components/ui/headerhijau";
import Button from "@/components/ui/button";
import FooterBar from "@/components/ui/footerbar";
import ScreenState from "@/components/ui/screenstate";
import { LABEL_METODE_PESANAN } from "@/data/pesanan";
import { transaksiRepository } from "@/services/transaksirepository";
import { colors, radius, spacing } from "@/theme";
import { Transaksi } from "@/types/transaksi";
import { formatHarga } from "@/utils/produk";
import { formatTanggalJamWib } from "@/utils/waktu";

const STATUS = {
  menunggu: { label: "Menunggu Pembayaran", ikon: "time-outline" as const, warna: colors.orange, latar: colors.peachSoft, pesan: "Selesaikan pembayaran sebelum batas waktu berakhir." },
  berhasil: { label: "Pembayaran Berhasil!", ikon: "checkmark" as const, warna: "#FFFFFF", latar: "#168348", pesan: "Pembayaran sudah diterima. Pesanan akan segera disiapkan untuk proses pengantaran." },
  gagal: { label: "Pembayaran Gagal", ikon: "close" as const, warna: "#FFFFFF", latar: "#C62828", pesan: "Pembayaran tidak berhasil diproses." },
  kedaluwarsa: { label: "Pembayaran Kedaluwarsa", ikon: "time-outline" as const, warna: colors.muted, latar: colors.canvas, pesan: "Batas waktu pembayaran telah berakhir." },
  dibatalkan: { label: "Transaksi Dibatalkan", ikon: "close" as const, warna: "#FFFFFF", latar: colors.muted, pesan: "Transaksi ini telah dibatalkan." },
};

export default function DetailRiwayatTransaksi() {
  const { invoice } = useLocalSearchParams<{ invoice: string }>();
  const [transaksi, setTransaksi] = useState<Transaksi | null>(null);
  const [memuat, setMemuat] = useState(true);

  useEffect(() => {
    let aktif = true;
    transaksiRepository.ambil(invoice).then(async (t) => {
      if (t?.statusTransaksi === "menunggu" && t.batasBayar <= Date.now()) {
        t = await transaksiRepository.perbarui(t.invoice, "kedaluwarsa", t.batasBayar);
      }
      if (aktif) setTransaksi(t);
    }).finally(() => { if (aktif) setMemuat(false); });
    return () => { aktif = false; };
  }, [invoice]);

  return (
    <View style={styles.screen}>
      <HeaderHijau judul="Rincian Pembayaran" />
      {memuat ? <ScreenState loading /> : transaksi ? <Isi transaksi={transaksi} onUbah={setTransaksi} /> : <ScreenState message="Transaksi tidak ditemukan." />}
    </View>
  );
}

function BarisInfo({ label, nilai }: { label: string; nilai: string }) {
  return <View style={styles.baris}><Text style={styles.label}>{label}</Text><Text style={styles.nilai}>{nilai}</Text></View>;
}

function Isi({ transaksi: t, onUbah }: { transaksi: Transaksi; onUbah: (t: Transaksi) => void }) {
  const batalkan = () => Alert.alert("Batalkan transaksi?", "Transaksi yang dibatalkan tidak dapat dilanjutkan.", [
    { text: "Kembali", style: "cancel" },
    { text: "Batalkan", style: "destructive", onPress: () => {
      void transaksiRepository.perbarui(t.invoice, "dibatalkan").then((hasil) => { if (hasil) onUbah(hasil); });
    } },
  ]);
  const gaya = STATUS[t.statusTransaksi];
  const waktu = t.dibayarPada ?? t.diperbaruiPada;
  const metode = t.metodeLabel ?? LABEL_METODE_PESANAN[t.metode] ?? String(t.metode).toUpperCase();
  return (
    <>
    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.hero}>
        <View style={[styles.ikon, { backgroundColor: gaya.latar }]}>
          <Ionicons name={gaya.ikon} size={34} color={gaya.warna} />
        </View>
        <Text style={styles.judul}>{gaya.label}</Text>
        <View style={styles.informasi}>
          <BarisInfo label="Metode Pembayaran" nilai={metode} />
          <BarisInfo label={t.statusTransaksi === "berhasil" ? "Tanggal Pembayaran" : "Tanggal Transaksi"} nilai={formatTanggalJamWib(waktu).split(",")[0]} />
          <BarisInfo label={t.statusTransaksi === "berhasil" ? "Waktu Pembayaran" : "Waktu Transaksi"} nilai={formatTanggalJamWib(waktu).split(",")[1]?.trim() ?? "-"} />
        </View>
        <Text style={styles.totalLabel}>{t.statusTransaksi === "berhasil" ? "Total Dibayar" : "Total Pembayaran"}</Text>
        <Text style={styles.total}>{formatHarga(t.total)}</Text>
        {t.deskripsi ? <Text style={styles.deskripsi}>{t.deskripsi}</Text> : null}
        <Text style={styles.pesan}>{gaya.pesan}</Text>
      </View>
      <View style={styles.invoice}><Text style={styles.invoiceLabel}>Nomor Transaksi</Text><Text style={styles.invoiceValue}>#{t.invoice}</Text></View>
    </ScrollView>
    {t.statusTransaksi === "menunggu" ? <FooterBar bordered={false} background={colors.barBg}><Button label="Batalkan Transaksi" variant="soft" onPress={batalkan} /></FooterBar> : null}
    </>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.canvas },
  content: { flexGrow: 1, padding: spacing.lg },
  hero: { flex: 1, minHeight: 520, backgroundColor: colors.white, borderRadius: radius.lg, alignItems: "center", paddingHorizontal: spacing.lg, paddingTop: 48 },
  ikon: { width: 72, height: 72, borderRadius: 36, alignItems: "center", justifyContent: "center", marginBottom: 28 },
  judul: { fontSize: 18, fontWeight: "800", color: colors.dark, marginBottom: spacing.xl },
  informasi: { width: "100%", gap: spacing.md, marginBottom: 34 },
  baris: { flexDirection: "row", justifyContent: "space-between", gap: spacing.md },
  label: { fontSize: 12, fontWeight: "600", color: colors.text },
  nilai: { fontSize: 12, fontWeight: "700", color: colors.dark, textAlign: "right", flexShrink: 1 },
  totalLabel: { fontSize: 12, color: colors.textSoft },
  total: { fontSize: 30, lineHeight: 38, fontWeight: "800", color: colors.dark, marginBottom: spacing.sm },
  pesan: { fontSize: 12, lineHeight: 18, color: colors.text, textAlign: "center", maxWidth: 280 },
  deskripsi: { fontSize: 11, lineHeight: 17, color: colors.textSoft, textAlign: "center", maxWidth: 280, marginBottom: spacing.sm },
  invoice: { paddingVertical: spacing.md, alignItems: "center", gap: 3 },
  invoiceLabel: { fontSize: 11, color: colors.textSoft },
  invoiceValue: { fontSize: 12, fontWeight: "700", color: colors.text },
});
