import { useMemo, useState } from "react";
import { Alert, ScrollView, StyleSheet, View } from "react-native";
import { useRouter } from "expo-router";
import HeaderAddress from "@/components/beranda/headeraddress";
import { useAlamat } from "@/context/alamat";
import { JUMLAH_NOTIFIKASI_BARU } from "@/data/notifikasi";
import SearchField from "@/components/ui/searchfield";
import ScreenState from "@/components/ui/screenstate";
import KartuPesanan from "@/components/pesanan/kartupesanan";
import KartuNgebelanjainSelesai from "@/components/pesanan/kartungebelanjainselesai";
import SegmenStatus from "@/components/pesanan/segmenstatus";
import PilihBulanSheet, { OpsiBulan } from "@/components/riwayat/pilihbulansheet";
import { useKeranjang } from "@/context/keranjang";
import { usePesanan } from "@/context/pesanan";
import { useNgebelanjain } from "@/context/ngebelanjain";
import { TAB_PESANAN } from "@/data/pesanan";
import { TEKS } from "@/data/teks";
import { usePesanUlang } from "@/hooks/usepesanulang";
import { colors, spacing } from "@/theme";
import { Pesanan, StatusPesanan } from "@/types/pesanan";
import { saringPesanan } from "@/utils/pesanan";
import { daftarBulan } from "@/utils/riwayat";
import { kunciBulanWib, labelBulanTahun } from "@/utils/waktu";

const T = TEKS.pesanan;
const TR = TEKS.riwayat;

export default function PesananScreen() {
  const router = useRouter();
  const { terpilih, memuat: alamatMemuat } = useAlamat();
  const alamatHeader = alamatMemuat
    ? TEKS.header.memuat
    : terpilih
      ? terpilih.jalan
      : TEKS.header.kosong;

  const { jumlahBaris } = useKeranjang();
  const { pesanan, memuat, majukan } = usePesanan();
  const { pesanan: daftarNgebelanjain, memuat: ngebelanjainMemuat } = useNgebelanjain();
  const pesanUlang = usePesanUlang();

  const [tab, setTab] = useState<StatusPesanan>("disiapkan");
  const [cari, setCari] = useState("");
  const [bulanPilihan, setBulanPilihan] = useState<string | null>(null);
  const [sheetTerbuka, setSheetTerbuka] = useState(false);

  const bisaCari = tab === "selesai";
  const kata = bisaCari ? cari : "";
  const bulan = bisaCari ? bulanPilihan : null;

  const daftar = useMemo(
    () => saringPesanan(pesanan, tab, kata, bulan),
    [pesanan, tab, kata, bulan]
  );

  const daftarNgebelanjainSelesai = useMemo(() => {
    if (tab !== "selesai") return [];
    const q = kata.trim().toLowerCase().replace(/^#/, "");
    return daftarNgebelanjain.filter((p) => {
      if (p.status !== "selesai") return false;
      const waktu = p.dibayarPada ?? p.dibuatPada;
      if (bulan !== null && kunciBulanWib(waktu) !== bulan) return false;
      if (!q) return true;
      return p.nomor.toLowerCase().includes(q) || p.daftar.toLowerCase().includes(q);
    });
  }, [daftarNgebelanjain, tab, kata, bulan]);

  const daftarSelesaiGabungan = useMemo(() => [
    ...daftar.map((p) => ({ jenis: "pesanan" as const, waktu: p.diterimaPada ?? p.dibayarPada, data: p })),
    ...daftarNgebelanjainSelesai.map((p) => ({ jenis: "ngebelanjain" as const, waktu: p.dibayarPada ?? p.dibuatPada, data: p })),
  ].sort((a, b) => b.waktu - a.waktu), [daftar, daftarNgebelanjainSelesai]);

  const opsiBulan = useMemo<OpsiBulan[]>(
    () => [
      { kunci: null, label: TR.semuaWaktu },
      ...[...new Set([
        ...daftarBulan(pesanan),
        ...daftarNgebelanjain.filter((p) => p.status === "selesai").map((p) => kunciBulanWib(p.dibayarPada ?? p.dibuatPada)),
      ])].sort().reverse().map((k) => ({ kunci: k, label: labelBulanTahun(k) })),
    ],
    [pesanan, daftarNgebelanjain]
  );

  const sekarang = Date.now();

  const keDetail = (p: Pesanan) =>
    router.push({ pathname: "/pesanan/[invoice]", params: { invoice: p.invoice } });

  const keDetailNgebelanjain = (nomor: string) =>
    router.push({ pathname: "/ngebelanjain/[nomor]", params: { nomor } });

  const segera = (pesan: string) => Alert.alert(T.segera.judul, pesan);

  return (
    <View style={styles.screen}>
      <HeaderAddress
        address={alamatHeader}
        cartCount={jumlahBaris}
        hasNotification={JUMLAH_NOTIFIKASI_BARU > 0}
        onPressAddress={() => router.push("/alamat")}
        onPressCart={() => router.push("/keranjang")}
        onPressNotification={() => router.push("/notifikasi")}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.content}
      >
        <View style={styles.atas}>
          <SegmenStatus items={TAB_PESANAN} selectedId={tab} onSelect={setTab} />
          {bisaCari ? (
            <SearchField
              value={cari}
              onChangeText={setCari}
              onSubmit={() => undefined}
              placeholder={T.cari}
              icon="search-outline"
              aksi={{
                icon: "calendar-outline",
                onPress: () => setSheetTerbuka(true),
                aksesibilitas: TR.filterBulan,
                aktif: bulan !== null,
              }}
            />
          ) : null}
        </View>

        {memuat || (bisaCari && ngebelanjainMemuat) ? (
          <ScreenState loading />
        ) : bisaCari ? daftarSelesaiGabungan.length > 0 ? (
          <View style={styles.daftar}>
            {daftarSelesaiGabungan.map((item) => item.jenis === "pesanan" ? (
              <KartuPesanan
                key={item.data.invoice}
                pesanan={item.data}
                sekarang={sekarang}
                onDetail={() => keDetail(item.data)}
                onChat={() => segera(T.segera.chat)}
                onNilai={() => router.push({ pathname: "/penilaian/[id]", params: { id: item.data.invoice, jenis: "produk" } })}
                onLihatFoto={() => segera(T.segera.foto)}
                onPesanUlang={() => void pesanUlang(item.data)}
                onMajukan={__DEV__ ? () => void majukan(item.data.invoice) : undefined}
              />
            ) : (
              <KartuNgebelanjainSelesai
                key={item.data.nomor}
                pesanan={item.data}
                onDetail={() => keDetailNgebelanjain(item.data.nomor)}
                onNilai={() => router.push({ pathname: "/penilaian/[id]", params: { id: item.data.nomor, jenis: "ngebelanjain" } })}
                onPesanUlang={() => router.push({ pathname: "/ngebelanjain/daftar", params: { isiUlang: item.data.daftar } })}
              />
            ))}
          </View>
        ) : (
          <View style={styles.kosong}>
            <ScreenState message={kata.trim() || bulan ? T.kosong.cari : T.kosong[tab]} />
          </View>
        ) : daftar.length > 0 ? (
          <View style={styles.daftar}>
            {daftar.map((p) => (
              <KartuPesanan
                key={p.invoice}
                pesanan={p}
                sekarang={sekarang}
                onDetail={() => keDetail(p)}
                onChat={() => segera(T.segera.chat)}
                onNilai={() => segera(T.segera.nilai)}
                onLihatFoto={() => segera(T.segera.foto)}
                onPesanUlang={() => void pesanUlang(p)}
                onMajukan={__DEV__ ? () => void majukan(p.invoice) : undefined}
              />
            ))}
          </View>
        ) : (
          <View style={styles.kosong}>
            <ScreenState message={kata.trim() || bulan ? T.kosong.cari : T.kosong[tab]} />
          </View>
        )}
      </ScrollView>

      {sheetTerbuka ? (
        <PilihBulanSheet
          opsi={opsiBulan}
          dipilih={bulanPilihan}
          onPilih={(kunci) => {
            setBulanPilihan(kunci);
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
  atas: { paddingHorizontal: 14, paddingTop: spacing.md, gap: spacing.md },
  daftar: { paddingHorizontal: 14, paddingTop: spacing.md, gap: spacing.md },
  kosong: { minHeight: 240 },
});
