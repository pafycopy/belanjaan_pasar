import { useMemo, useState } from "react";
import { Alert, ScrollView, StyleSheet, View } from "react-native";
import { useRouter } from "expo-router";
import HeaderHijau from "@/components/ui/headerhijau";
import ScreenState from "@/components/ui/screenstate";
import SearchField from "@/components/ui/searchfield";
import TombolFilter from "@/components/ui/tombolfilter";
import KartuRiwayat from "@/components/riwayat/karturiwayat";
import PilihBulanSheet, { OpsiBulan } from "@/components/riwayat/pilihbulansheet";
import { usePesanan } from "@/context/pesanan";
import { TEKS } from "@/data/teks";
import { usePesanUlang } from "@/hooks/usepesanulang";
import { useSekarang } from "@/hooks/usesekarang";
import { colors, spacing } from "@/theme";
import { Pesanan } from "@/types/pesanan";
import { bulanEfektif, daftarBulan, KunciBulan, saringRiwayat } from "@/utils/riwayat";
import { labelBulanTahun } from "@/utils/waktu";

const T = TEKS.riwayat;

export default function RiwayatTransaksi() {
  const router = useRouter();
  const { pesanan, memuat } = usePesanan();
  const pesanUlang = usePesanUlang();
  const sekarang = useSekarang(60_000);

  const [cari, setCari] = useState("");
  // undefined = belum dipilih user (bawaan: bulan ini bila ada transaksinya)
  const [pilihanBulan, setPilihanBulan] = useState<KunciBulan | null | undefined>(undefined);
  const [sheetTerbuka, setSheetTerbuka] = useState(false);

  const bulan = bulanEfektif(pilihanBulan, pesanan, sekarang);
  const daftar = useMemo(() => saringRiwayat(pesanan, { cari, bulan }), [pesanan, cari, bulan]);

  const opsiBulan = useMemo<OpsiBulan[]>(
    () => [
      { kunci: null, label: T.semuaWaktu },
      ...daftarBulan(pesanan).map((k) => ({ kunci: k, label: labelBulanTahun(k) })),
    ],
    [pesanan]
  );

  const keDetail = (p: Pesanan) =>
    router.push({ pathname: "/pesanan/[invoice]", params: { invoice: p.invoice } });

  return (
    <View style={styles.screen}>
      <HeaderHijau judul={T.judul} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.content}
      >
        <View style={styles.filter}>
          <View style={styles.cari}>
            <SearchField
              value={cari}
              onChangeText={setCari}
              onSubmit={() => undefined}
              placeholder={T.cari}
              icon="search-outline"
            />
          </View>
          <TombolFilter
            label={bulan ? labelBulanTahun(bulan) : T.semuaWaktu}
            icon="calendar-outline"
            aksesibilitas={T.filterBulan}
            onPress={() => setSheetTerbuka(true)}
          />
        </View>

        {memuat ? (
          <ScreenState loading />
        ) : daftar.length > 0 ? (
          <View style={styles.daftar}>
            {daftar.map((p) => (
              <KartuRiwayat
                key={p.invoice}
                pesanan={p}
                onDetail={() => keDetail(p)}
                onBeliLagi={() => void pesanUlang(p)}
                onNilai={() => Alert.alert(TEKS.pesanan.segera.judul, TEKS.pesanan.segera.nilai)}
              />
            ))}
          </View>
        ) : (
          <View style={styles.kosong}>
            <ScreenState message={cari.trim() ? T.kosongCari : T.kosong} />
          </View>
        )}
      </ScrollView>

      {sheetTerbuka ? (
        <PilihBulanSheet
          opsi={opsiBulan}
          dipilih={bulan}
          onPilih={(kunci) => {
            setPilihanBulan(kunci);
            setSheetTerbuka(false);
          }}
          onTutup={() => setSheetTerbuka(false)}
        />
      ) : null}
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
