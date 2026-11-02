import { useMemo, useState } from "react";
import { Alert, FlatList, StyleSheet, View } from "react-native";
import { useRouter } from "expo-router";
import { colors, spacing } from "@/theme";
import { TEKS } from "@/data/teks";
import { KATALOG_VOUCHER, TINGKAT_MEMBER } from "@/data/voucher";
import { usePoin } from "@/context/poin";
import { useVoucher } from "@/context/voucher";
import { StatusMilik, Voucher, VoucherMilik } from "@/types/voucher";
import { formatRibuan } from "@/utils/angka";
import { statusMilik, sudahKedaluwarsa } from "@/utils/voucher";
import HeaderHijau from "@/components/ui/headerhijau";
import ScreenState from "@/components/ui/screenstate";
import HeroVoucher from "@/components/voucher/herovoucher";
import TabVoucher, { IdTabVoucher } from "@/components/voucher/tabvoucher";
import KartuVoucher from "@/components/voucher/kartuvoucher";
import KuponSaya from "@/components/voucher/kuponsaya";
import FilterStatus from "@/components/voucher/filterstatus";
import SyaratKetentuan from "@/components/voucher/syaratketentuan";

type ItemMilik = { milik: VoucherMilik; voucher: Voucher; status: StatusMilik };

const T = TEKS.voucher;

export default function VoucherScreen() {
  const router = useRouter();
  const { total, memuat: memuatPoin } = usePoin();
  const { milik, memuat: memuatVoucher, tukar } = useVoucher();
  const [tab, setTab] = useState<IdTabVoucher>("tukar");
  const [filter, setFilter] = useState<StatusMilik>("aktif");
  const [menukarId, setMenukarId] = useState<string | null>(null);

  // Voucher milik pengguna + statusnya (dapat digunakan / terpakai / kedaluwarsa)
  const itemMilik = useMemo<ItemMilik[]>(() => {
    const sekarang = Date.now();
    return milik.flatMap((m) => {
      const voucher = KATALOG_VOUCHER.find((v) => v.id === m.voucherId);
      return voucher ? [{ milik: m, voucher, status: statusMilik(m, voucher, sekarang) }] : [];
    });
  }, [milik]);

  const jumlah = useMemo(() => {
    const hitung: Record<StatusMilik, number> = { aktif: 0, terpakai: 0, kedaluwarsa: 0 };
    itemMilik.forEach((i) => (hitung[i.status] += 1));
    return hitung;
  }, [itemMilik]);

  const dataMilik = useMemo(() => itemMilik.filter((i) => i.status === filter), [itemMilik, filter]);

  const proses = async (v: Voucher) => {
    setMenukarId(v.id);
    try {
      const hasil = await tukar(v.id);
      if (hasil === "berhasil") {
        Alert.alert(T.berhasil.judul, T.berhasil.pesan(v.judul), [
          { text: T.berhasil.nanti, style: "cancel" },
          {
            text: T.berhasil.lihat,
            onPress: () => {
              setFilter("aktif");
              setTab("saya");
            },
          },
        ]);
      } else if (hasil === "poinKurang") {
        const g = T.gagal.poinKurang(formatRibuan(v.biaya - total));
        Alert.alert(g.judul, g.pesan);
      } else if (hasil === "kedaluwarsa") {
        Alert.alert(T.gagal.kedaluwarsa.judul, T.gagal.kedaluwarsa.pesan);
      }
    } catch {
      Alert.alert(T.gagal.umum.judul, T.gagal.umum.pesan);
    } finally {
      setMenukarId(null);
    }
  };

  const konfirmasi = (v: Voucher) => {
    if (total < v.biaya) {
      const g = T.gagal.poinKurang(formatRibuan(v.biaya - total));
      Alert.alert(g.judul, g.pesan);
      return;
    }
    Alert.alert(T.konfirmasi.judul, T.konfirmasi.pesan(v.judul, formatRibuan(v.biaya)), [
      { text: T.konfirmasi.batal, style: "cancel" },
      { text: T.konfirmasi.ya, onPress: () => void proses(v) },
    ]);
  };

  // TODO: ganti ke penerapan voucher di checkout setelah fitur pesanan ada
  const pakai = () =>
    Alert.alert(T.milik.caraPakai.judul, T.milik.caraPakai.pesan, [
      { text: T.milik.caraPakai.tutup, style: "cancel" },
      { text: T.milik.caraPakai.belanja, onPress: () => router.navigate("/") },
    ]);

  const segera = () => Alert.alert(TEKS.poin.segera.judul, TEKS.poin.segera.pesan);

  const kepala = (
    <View style={styles.kepala}>
      {tab === "tukar" ? (
        <HeroVoucher
          total={total}
          tingkat={TINGKAT_MEMBER}
          onPressRiwayat={segera}
          onPressKlaim={() => router.navigate("/poin")}
        />
      ) : (
        <FilterStatus aktif={filter} jumlah={jumlah} onChange={setFilter} />
      )}
      <TabVoucher aktif={tab} jumlahMilik={jumlah.aktif} onChange={setTab} />
    </View>
  );

  const pemisah = () => <View style={{ height: spacing.md }} />;

  return (
    <View style={styles.screen}>
      <HeaderHijau judul={T.judul} />

      {memuatPoin || memuatVoucher ? (
        <ScreenState loading />
      ) : tab === "tukar" ? (
        <FlatList
          data={KATALOG_VOUCHER}
          keyExtractor={(v) => v.id}
          renderItem={({ item }) => (
            <KartuVoucher
              voucher={item}
              kedaluwarsa={sudahKedaluwarsa(item)}
              menukar={menukarId === item.id}
              onTukar={() => konfirmasi(item)}
            />
          )}
          ListHeaderComponent={kepala}
          ItemSeparatorComponent={pemisah}
          contentContainerStyle={styles.isi}
        />
      ) : (
        <FlatList
          data={dataMilik}
          keyExtractor={(i) => i.milik.uid}
          renderItem={({ item }) => (
            <KuponSaya
              voucher={item.voucher}
              milik={item.milik}
              sekarang={Date.now()}
              onPakai={pakai}
            />
          )}
          ListHeaderComponent={kepala}
          ListEmptyComponent={
            <ScreenState message={milik.length === 0 ? T.milik.kosong : T.milik.kosongFilter} />
          }
          ListFooterComponent={<SyaratKetentuan />}
          ItemSeparatorComponent={pemisah}
          contentContainerStyle={styles.isi}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.surface },
  isi: { padding: spacing.lg, paddingBottom: spacing.xl },
  kepala: { gap: spacing.md, marginBottom: spacing.md },
});
