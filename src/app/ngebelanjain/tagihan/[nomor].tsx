import { useEffect, useState } from "react";
import { Alert, StyleSheet, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import Button from "@/components/ui/button";
import HeaderHijau from "@/components/ui/headerhijau";
import ScreenState from "@/components/ui/screenstate";
import MenungguBayar from "@/components/ngebelanjain/menunggubayar";
import { useNgebelanjain } from "@/context/ngebelanjain";
import { TEKS_NGEBELANJAIN } from "@/data/teksngebelanjain";
import { useSekarang } from "@/hooks/usesekarang";
import { colors, spacing } from "@/theme";
import { kedaluwarsaMetode } from "@/utils/ngebelanjain";
import { sisaDetik } from "@/utils/pembayaran";

const T = TEKS_NGEBELANJAIN.menunggu;

// Halaman "Menunggu Pembayaran" untuk QRIS dan BCA Virtual Account.
// Dibayar -> tab Sudah Dibayar. Waktu habis -> tab Pembayaran Tersedia (tampil "Pembayaran Kedaluwarsa").
export default function TagihanNgebelanjain() {
  const router = useRouter();
  const { nomor } = useLocalSearchParams<{ nomor?: string }>();
  const { pesanan, memuat, perbarui } = useNgebelanjain();
  const sekarang = useSekarang();
  const [memproses, setMemproses] = useState(false);

  const pesananAktif = pesanan.find((p) => p.nomor === nomor && p.status === "pembayaran");
  const metode = pesananAktif?.metode;
  const batas = pesananAktif?.batasBayar;
  const habis = Boolean(batas && sisaDetik(batas, sekarang) === 0);

  useEffect(() => {
    if (!pesananAktif || !habis || memproses) return;
    setMemproses(true);
    perbarui(pesananAktif.nomor, kedaluwarsaMetode)
      .then(() =>
        router.replace({ pathname: "/(tabs)/ngebelanjain", params: { tab: "pembayaran", ts: String(Date.now()) } })
      )
      .catch(() => {
        setMemproses(false);
        Alert.alert(T.gagalPerbarui.judul, T.gagalPerbarui.pesan);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pesananAktif?.nomor, habis, memproses]);

  // Hanya mode pengembangan: aslinya pembayaran dikonfirmasi payment gateway
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
      Alert.alert(T.gagalLunas.judul, T.gagalLunas.pesan);
    }
  };

  return (
    <View style={styles.screen}>
      <HeaderHijau judul={T.judul} />

      {memuat ? (
        <ScreenState loading />
      ) : !pesananAktif || (metode !== "qris" && metode !== "transfer") ? (
        <ScreenState message={T.tidakDitemukan} />
      ) : (
        <>
          <MenungguBayar pesanan={pesananAktif} bar={false} />

          {__DEV__ ? (
            <View style={styles.footer}>
              <Button label={T.simulasiLunas} size="lg" loading={memproses} onPress={() => void simulasiLunas()} />
            </View>
          ) : null}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.canvas },
  footer: { padding: spacing.md, backgroundColor: colors.white },
});
