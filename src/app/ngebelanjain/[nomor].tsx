import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import Button from "@/components/ui/button";
import HeaderHijau from "@/components/ui/headerhijau";
import ScreenState from "@/components/ui/screenstate";
import KepalaPesanan from "@/components/ngebelanjain/kepalapesanan";
import { useNgebelanjain } from "@/context/ngebelanjain";
import { OPSI_PENGIRIMAN } from "@/data/keranjang";
import { TEKS_NGEBELANJAIN } from "@/data/teksngebelanjain";
import { useChatNgebelanjain } from "@/hooks/usechatngebelanjain";
import { colors, radius, spacing } from "@/theme";
import { pecahDaftar } from "@/utils/ngebelanjain";
import { formatTanggalJamWib } from "@/utils/waktu";

const T = TEKS_NGEBELANJAIN;
const D = T.halamanDetail;

// Halaman detail satu pesanan Ngebelanjain: daftar belanja lengkap, pengiriman, dan waktu pemesanan
export default function DetailNgebelanjain() {
  const { nomor } = useLocalSearchParams<{ nomor?: string }>();
  const { pesanan, memuat } = useNgebelanjain();
  const chat = useChatNgebelanjain();

  const p = pesanan.find((x) => x.nomor === nomor);

  return (
    <View style={styles.screen}>
      <HeaderHijau judul={D.judul} />

      {memuat ? (
        <ScreenState loading />
      ) : !p ? (
        <ScreenState message={D.tidakDitemukan} />
      ) : (
        <>
          <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
            <View style={styles.kartu}>
              <KepalaPesanan pesanan={p} />
            </View>

            <View style={styles.kartu}>
              <View style={styles.judulBaris}>
                <Text style={styles.judul}>{D.daftarBelanja}</Text>
                <Text style={styles.hitung}>{D.jumlahBarang(pecahDaftar(p.daftar).length)}</Text>
              </View>

              {pecahDaftar(p.daftar).map((b, i) => (
                <View key={i} style={[styles.barang, i > 0 && styles.barangGaris]}>
                  <Text style={styles.nomorBarang}>{i + 1}.</Text>
                  <Text style={styles.namaBarang}>{b.nama}</Text>
                  {b.jumlah ? <Text style={styles.jumlahBarang}>{b.jumlah}</Text> : null}
                </View>
              ))}
            </View>

            <View style={styles.kartu}>
              <Info label={D.pengiriman} nilai={OPSI_PENGIRIMAN.find((o) => o.id === p.pengiriman)?.label ?? "-"} />
              {p.alamat ? <Info label={D.alamat} nilai={p.alamat} /> : null}
              <Info label={D.waktuPesan} nilai={formatTanggalJamWib(p.dibuatPada)} />
            </View>
          </ScrollView>

          {p.status === "dibelanjain" ? (
            <View style={styles.footer}>
              <Button label={T.chatWa} size="lg" onPress={() => void chat(p)} />
            </View>
          ) : null}
        </>
      )}
    </View>
  );
}

function Info({ label, nilai }: { label: string; nilai: string }) {
  return (
    <View style={styles.info}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoNilai}>{nilai}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.canvas },
  content: { padding: 14, gap: spacing.md },
  kartu: {
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    padding: spacing.lg,
    gap: spacing.md,
    shadowColor: colors.shadow,
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  judulBaris: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  judul: { fontSize: 15, fontWeight: "800", color: colors.textStrong },
  hitung: { fontSize: 12, color: colors.muted },
  barang: { flexDirection: "row", alignItems: "flex-start", gap: spacing.sm },
  barangGaris: { borderTopWidth: 1, borderTopColor: colors.border, paddingTop: spacing.md },
  nomorBarang: { width: 22, fontSize: 13, color: colors.muted },
  namaBarang: { flex: 1, fontSize: 13, lineHeight: 19, color: colors.text },
  jumlahBarang: { fontSize: 13, fontWeight: "800", color: colors.dark, textAlign: "right", flexShrink: 0 },
  info: { gap: 2 },
  infoLabel: { fontSize: 11, color: colors.muted },
  infoNilai: { fontSize: 13, lineHeight: 19, fontWeight: "600", color: colors.text },
  footer: { paddingHorizontal: 14, paddingTop: spacing.sm, paddingBottom: spacing.lg, backgroundColor: colors.canvas },
});
