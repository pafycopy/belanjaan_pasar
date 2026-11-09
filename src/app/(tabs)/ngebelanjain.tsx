import { Alert, StyleSheet, Text, View } from "react-native";
import HeaderTab from "@/components/ui/headertab";
import Button from "@/components/ui/button";
import IlustrasiKosong from "@/components/ngebelanjain/ilustrasikosong";
import StatusPesananNgebelanjain from "@/components/ngebelanjain/statuspesanan";
import { ILUSTRASI_NGEBELANJAIN_KOSONG, STATUS_NGEBELANJAIN } from "@/data/ngebelanjain";
import { TEKS } from "@/data/teks";
import { colors, spacing } from "@/theme";

const T = TEKS.ngebelanjain;

// Layanan titip belanja pasar: pelanggan menitip daftar belanjaan, pesanan dibelanjakan lalu tagihannya tersedia.
// Belum ada alur pemesanannya, jadi untuk sekarang hanya tampilan awal (kosong).
export default function NgebelanjainScreen() {
  const segera = () => Alert.alert(T.segera.judul, T.segera.pesan);

  return (
    <View style={styles.screen}>
      <HeaderTab judul={T.judul} />

      <View style={styles.status}>
        <Text style={styles.statusJudul}>{T.pesananSaya}</Text>
        <StatusPesananNgebelanjain items={STATUS_NGEBELANJAIN} onPress={segera} />
      </View>

      <View style={styles.kosong}>
        <IlustrasiKosong gambar={ILUSTRASI_NGEBELANJAIN_KOSONG} />
        <Text style={styles.kosongJudul}>{T.kosongJudul}</Text>
        <Text style={styles.kosongPesan}>{T.kosongPesan}</Text>
      </View>

      <View style={styles.footer}>
        <Button label={T.mulai} size="lg" onPress={segera} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.white },
  status: {
    paddingHorizontal: 14,
    paddingTop: spacing.lg,
    paddingBottom: spacing.lg,
    gap: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  statusJudul: { fontSize: 14, fontWeight: "800", color: colors.textStrong },
  kosong: { flex: 1, alignItems: "center", justifyContent: "center", gap: spacing.sm, paddingHorizontal: spacing.xl },
  kosongJudul: { fontSize: 14, fontWeight: "800", color: colors.textStrong, marginTop: spacing.md },
  kosongPesan: { fontSize: 12, lineHeight: 18, color: colors.textSoft, textAlign: "center" },
  footer: { paddingHorizontal: 14, paddingBottom: spacing.lg },
});
