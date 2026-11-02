import { useState } from "react";
import { Alert, ScrollView, StyleSheet, View } from "react-native";
import { colors, spacing } from "@/theme";
import { TEKS } from "@/data/teks";
import { HARI_SIKLUS } from "@/data/poin";
import { usePoin } from "@/context/poin";
import { useSekarang } from "@/hooks/usesekarang";
import { ringkasKlaim } from "@/utils/poin";
import HeaderHijau from "@/components/ui/headerhijau";
import ScreenState from "@/components/ui/screenstate";
import KartuPoin from "@/components/poin/kartupoin";
import KlaimHarian from "@/components/poin/klaimharian";

export default function PoinScreen() {
  const { status, total, memuat, klaim } = usePoin();
  const sekarang = useSekarang();
  const [mengklaim, setMengklaim] = useState(false);

  const ringkasan = ringkasKlaim(status, sekarang);

  const segera = () => Alert.alert(TEKS.poin.segera.judul, TEKS.poin.segera.pesan);

  const onKlaim = async () => {
    if (mengklaim) return;
    setMengklaim(true);
    try {
      const hasil = await klaim();
      if (!hasil) return;
      const selesai = hasil.hari === HARI_SIKLUS;
      Alert.alert(
        TEKS.poin.klaim.berhasil.judul,
        selesai
          ? `${TEKS.poin.klaim.berhasil.pesan(hasil.poin)}\n${TEKS.poin.klaim.berhasil.siklusSelesai}`
          : TEKS.poin.klaim.berhasil.pesan(hasil.poin)
      );
    } catch {
      Alert.alert(TEKS.poin.klaim.gagal.judul, TEKS.poin.klaim.gagal.pesan);
    } finally {
      setMengklaim(false);
    }
  };

  return (
    <View style={styles.screen}>
      <HeaderHijau judul={TEKS.poin.judul} />

      {memuat ? (
        <ScreenState loading />
      ) : (
        <ScrollView contentContainerStyle={styles.isi}>
          <KartuPoin total={total} onPressTukar={segera} onPressRiwayat={segera} />
          <KlaimHarian ringkasan={ringkasan} mengklaim={mengklaim} onKlaim={onKlaim} />
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.surface },
  isi: { padding: spacing.lg, gap: spacing.lg, paddingBottom: spacing.xl },
});
