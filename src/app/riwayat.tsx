import { useEffect, useMemo, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { useRouter } from "expo-router";
import HeaderHijau from "@/components/ui/headerhijau";
import ScreenState from "@/components/ui/screenstate";
import SearchField from "@/components/ui/searchfield";
import TombolFilter from "@/components/ui/tombolfilter";
import KartuRiwayat from "@/components/riwayat/karturiwayat";
import PilihBulanSheet, { OpsiBulan } from "@/components/riwayat/pilihbulansheet";
import { TEKS } from "@/data/teks";
import { usePesanan } from "@/context/pesanan";
import { useNgebelanjain } from "@/context/ngebelanjain";
import { NAMA_METODE_NGEBELANJAIN } from "@/data/ngebelanjain";
import { transaksiRepository } from "@/services/transaksirepository";
import { colors, spacing } from "@/theme";
import { Transaksi } from "@/types/transaksi";
import { daftarBulanTransaksi, saringTransaksi } from "@/utils/transaksi";
import { labelBulanTahun } from "@/utils/waktu";

const T = TEKS.riwayat;

export default function RiwayatTransaksi() {
  const router = useRouter();
  const { pesanan, memuat: pesananMemuat } = usePesanan();
  const { pesanan: daftarNgebelanjain, memuat: ngebelanjainMemuat } = useNgebelanjain();
  const [transaksi, setTransaksi] = useState<Transaksi[]>([]);
  const [memuat, setMemuat] = useState(true);
  const [cari, setCari] = useState("");
  const [bulan, setBulan] = useState<string | null | undefined>(undefined);
  const [sheetTerbuka, setSheetTerbuka] = useState(false);

  useEffect(() => {
    if (pesananMemuat || ngebelanjainMemuat) return;
    let aktif = true;
    const muat = async () => {
      // Migrasi sekali untuk transaksi sukses yang sudah tersimpan pada versi aplikasi sebelumnya.
      await Promise.all(pesanan.map((p) => transaksiRepository.sinkronkanPembayaranLama({
        invoice: p.invoice,
        metode: p.metode,
        dibuatPada: p.dibuatPada,
        dibayarPada: p.dibayarPada,
        batasBayar: p.dibayarPada,
        baris: p.baris,
        pengiriman: p.pengiriman,
        alamat: p.alamat,
        subtotal: p.subtotal,
        ongkir: p.ongkir,
        labelOngkir: p.labelOngkir,
        total: p.total,
      })));
      // Sinkronkan log Ngebelanjain: hanya pesanan yang sudah memiliki tagihan.
      await Promise.all(daftarNgebelanjain.filter((p) => p.tagihan && (p.status === "pembayaran" || p.status === "dibayar" || p.status === "selesai" || p.pembayaranKedaluwarsa)).map((p) => {
        const statusTransaksi = p.pembayaranKedaluwarsa ? "kedaluwarsa" as const :
          p.status === "pembayaran" ? "menunggu" as const : "berhasil" as const;
        const metode = p.metode === "transfer" ? "bca" as const : p.metode === "cod" ? "cod" as const : "qris" as const;
        const waktu = p.dibayarPada ?? p.batasBayar ?? p.dibuatPada;
        const totalProdukDanJasa = p.tagihan!.totalProduk + p.tagihan!.jasaHelper;
        return transaksiRepository.sinkronkanNgebelanjain({
          invoice: p.nomor,
          metode,
          metodeLabel: p.metode ? NAMA_METODE_NGEBELANJAIN[p.metode] : "-",
          dibuatPada: p.dibuatPada,
          dibayarPada: p.dibayarPada,
          batasBayar: p.batasBayar ?? p.dibuatPada,
          baris: [],
          pengiriman: p.pengiriman,
          alamat: p.alamat,
          subtotal: totalProdukDanJasa,
          ongkir: p.pengiriman === "antar" ? p.tagihan!.ongkir : null,
          total: p.tagihan!.total,
          deskripsi: p.daftar,
          jenisTransaksi: "ngebelanjain",
          statusTransaksi,
          dibuatLogPada: waktu,
          diperbaruiPada: p.dibayarPada ?? waktu,
        });
      }));
      const daftar = await transaksiRepository.ambilSemua();
      const teraz = Date.now();
      const wygasle = daftar.filter((t) => t.statusTransaksi === "menunggu" && t.batasBayar <= teraz);
      await Promise.all(wygasle.map((t) => transaksiRepository.perbarui(t.invoice, "kedaluwarsa", t.batasBayar)));
      const terbaru = await transaksiRepository.ambilSemua();
      if (aktif) {
        setTransaksi(terbaru);
      }
    };
    void muat().finally(() => { if (aktif) setMemuat(false); });
    return () => { aktif = false; };
  }, [pesanan, pesananMemuat, daftarNgebelanjain, ngebelanjainMemuat]);

  const bulanAktif = bulan === undefined ? (daftarBulanTransaksi(transaksi)[0] ?? null) : bulan;
  const daftar = useMemo(() => saringTransaksi(transaksi, { cari, bulan: bulanAktif }), [transaksi, cari, bulanAktif]);
  const opsiBulan = useMemo<OpsiBulan[]>(() => [
    { kunci: null, label: T.semuaWaktu },
    ...daftarBulanTransaksi(transaksi).map((k) => ({ kunci: k, label: labelBulanTahun(k) })),
  ], [transaksi]);

  return (
    <View style={styles.screen}>
      <HeaderHijau judul={T.judul} />
      <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled" contentContainerStyle={styles.content}>
        <View style={styles.filter}>
          <View style={styles.cari}>
            <SearchField value={cari} onChangeText={setCari} onSubmit={() => undefined} placeholder={T.cari} icon="search-outline" />
          </View>
          <TombolFilter label={bulanAktif ? labelBulanTahun(bulanAktif) : T.semuaWaktu} icon="calendar-outline" aksesibilitas={T.filterBulan} onPress={() => setSheetTerbuka(true)} />
        </View>
        {memuat ? <ScreenState loading /> : daftar.length ? (
          <View style={styles.daftar}>
            {daftar.map((t) => <KartuRiwayat key={t.invoice} transaksi={t} onPress={() => router.push({ pathname: "/riwayat/[invoice]", params: { invoice: t.invoice } })} />)}
          </View>
        ) : <View style={styles.kosong}><ScreenState message={cari.trim() ? T.kosongCari : T.kosong} /></View>}
      </ScrollView>
      {sheetTerbuka ? <PilihBulanSheet opsi={opsiBulan} dipilih={bulanAktif} onPilih={(k) => { setBulan(k); setSheetTerbuka(false); }} onTutup={() => setSheetTerbuka(false)} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.canvas },
  content: { paddingBottom: spacing.xl },
  filter: { flexDirection: "row", alignItems: "center", gap: spacing.sm, padding: spacing.lg },
  cari: { flex: 1 },
  daftar: { paddingHorizontal: spacing.lg, gap: spacing.md },
  kosong: { minHeight: 240 },
});
