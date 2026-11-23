import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import HeaderHijau from "@/components/ui/headerhijau";
import Nominal from "@/components/ui/nominal";
import ScreenState from "@/components/ui/screenstate";
import { useNgebelanjain } from "@/context/ngebelanjain";
import { OPSI_PENGIRIMAN } from "@/data/keranjang";
import { TEKS_NGEBELANJAIN } from "@/data/teksngebelanjain";
import { colors, radius, spacing } from "@/theme";
import { pecahDaftar } from "@/utils/ngebelanjain";
import { formatTanggalJamWib } from "@/utils/waktu";

const T = TEKS_NGEBELANJAIN;
const D = T.halamanDetail;

export default function BuktiFotoNgebelanjain() {
  const { nomor } = useLocalSearchParams<{ nomor?: string }>();
  const { pesanan, memuat } = useNgebelanjain();
  const p = pesanan.find((x) => x.nomor === nomor && x.status === "selesai");
  const barang = p ? pecahDaftar(p.daftar) : [];

  return (
    <View style={styles.screen}>
      <HeaderHijau judul="Bukti Belanja" />

      {memuat ? (
        <ScreenState loading />
      ) : !p ? (
        <ScreenState message={D.tidakDitemukan} />
      ) : (
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.kartu}>
            <View style={styles.kepala}>
              <View style={styles.kepalaIkon}>
                <Ionicons name="receipt-outline" size={20} color={colors.primaryDeep} />
              </View>
              <View style={styles.kepalaIsi}>
                <Text style={styles.judul}>Bukti Belanja Ngebelanjain</Text>
                <Text style={styles.subjudul}>Pesanan #{p.nomor}</Text>
              </View>
              <View style={styles.badge}>
                <Text style={styles.badgeTeks}>Selesai</Text>
              </View>
            </View>

            {p.fotoBuktiUri ? (
              <Image source={{ uri: p.fotoBuktiUri }} style={styles.foto} resizeMode="contain" />
            ) : (
              <View style={styles.fotoKosong}>
                <Ionicons name="camera-outline" size={34} color={colors.muted} />
                <Text style={styles.fotoKosongJudul}>Foto bukti belum tersedia</Text>
                <Text style={styles.fotoKosongKet}>Kurir akan mengunggah foto bukti belanja setelah pesanan selesai.</Text>
              </View>
            )}
            <View style={styles.waktu}>
              <Ionicons name="time-outline" size={15} color={colors.textSoft} />
              <Text style={styles.waktuTeks}>
                Diselesaikan: {formatTanggalJamWib(p.selesaiPada ?? p.dibayarPada ?? p.dibuatPada)}
              </Text>
            </View>
          </View>

          <View style={styles.kartu}>
            <View style={styles.judulBaris}>
              <Text style={styles.judul}>Rincian Belanja</Text>
              <Text style={styles.jumlah}>{barang.length} barang</Text>
            </View>
            {barang.map((b, i) => (
              <View key={`${i}-${b.teks}`} style={[styles.barang, i > 0 && styles.garis]}>
                <View style={styles.nomorBarang}><Text style={styles.nomorTeks}>{i + 1}</Text></View>
                <View style={styles.barangIsi}>
                  <Text style={styles.namaBarang}>{b.nama}</Text>
                  {b.jumlah ? <Text style={styles.jumlahBarang}>{b.jumlah}</Text> : null}
                </View>
              </View>
            ))}
          </View>

          <View style={styles.kartu}>
            <Text style={styles.judul}>Rincian Pembelian</Text>
            <Baris label="Total Produk" nilai={p.tagihan?.totalProduk ?? 0} />
            <Baris label="Jasa Helper" nilai={p.tagihan?.jasaHelper ?? 0} />
            <Baris label="Ongkir" nilai={p.tagihan?.ongkir ?? 0} />
            <View style={styles.total}>
              <Text style={styles.totalLabel}>Total Dibayar</Text>
              <Nominal nilai={p.tagihan?.total ?? 0} ukuran={21} warna={colors.primaryDeep} />
            </View>
          </View>

          <View style={styles.kartu}>
            <Text style={styles.judul}>Informasi Pengantaran</Text>
            <Info label="Metode Pengiriman" nilai={OPSI_PENGIRIMAN.find((o) => o.id === p.pengiriman)?.label ?? "-"} />
            {p.alamat ? <Info label="Alamat Pengantaran" nilai={p.alamat} /> : null}
            <Info label="Waktu Pemesanan" nilai={formatTanggalJamWib(p.dibuatPada)} />
          </View>
        </ScrollView>
      )}
    </View>
  );
}

function Baris({ label, nilai }: { label: string; nilai: number }) {
  return (
    <View style={styles.barisTagihan}>
      <Text style={styles.labelTagihan}>{label}</Text>
      <Nominal nilai={nilai} ukuran={13} warna={colors.text} />
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
  content: { padding: 14, gap: spacing.md, paddingBottom: spacing.xl },
  kartu: { backgroundColor: colors.white, borderRadius: radius.xl, padding: spacing.lg, gap: spacing.md, shadowColor: colors.shadow, shadowOpacity: 0.07, shadowRadius: 7, shadowOffset: { width: 0, height: 2 }, elevation: 2 },
  kepala: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  kepalaIkon: { width: 40, height: 40, borderRadius: radius.md, backgroundColor: colors.mintFade, alignItems: "center", justifyContent: "center" },
  kepalaIsi: { flex: 1, gap: 2 },
  judul: { fontSize: 15, fontWeight: "800", color: colors.textStrong },
  subjudul: { fontSize: 11, color: colors.textSoft },
  badge: { backgroundColor: colors.mintFade, borderRadius: radius.xl, paddingHorizontal: 10, paddingVertical: 5 },
  badgeTeks: { fontSize: 10, fontWeight: "800", color: colors.primaryDeep },
  foto: { width: "100%", height: 230, borderRadius: radius.md, backgroundColor: colors.canvas },
  fotoKosong: { minHeight: 190, borderRadius: radius.md, backgroundColor: colors.canvas, alignItems: "center", justifyContent: "center", padding: spacing.xl, gap: spacing.sm },
  fotoKosongJudul: { fontSize: 13, fontWeight: "800", color: colors.textStrong, textAlign: "center" },
  fotoKosongKet: { fontSize: 11, lineHeight: 17, color: colors.textSoft, textAlign: "center" },
  waktu: { flexDirection: "row", alignItems: "center", gap: 6 },
  waktuTeks: { fontSize: 11, color: colors.textSoft },
  judulBaris: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  jumlah: { fontSize: 11, color: colors.textSoft },
  barang: { flexDirection: "row", alignItems: "center", gap: spacing.md },
  garis: { borderTopWidth: 1, borderTopColor: colors.border, paddingTop: spacing.md },
  nomorBarang: { width: 25, height: 25, borderRadius: 13, backgroundColor: colors.accentSoft, alignItems: "center", justifyContent: "center" },
  nomorTeks: { fontSize: 11, fontWeight: "800", color: colors.primaryDeep },
  barangIsi: { flex: 1, gap: 2 },
  namaBarang: { fontSize: 13, fontWeight: "700", color: colors.text },
  jumlahBarang: { fontSize: 11, color: colors.textSoft },
  barisTagihan: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  labelTagihan: { fontSize: 12, color: colors.textSoft },
  total: { borderTopWidth: 1, borderTopColor: colors.border, paddingTop: spacing.md, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  totalLabel: { fontSize: 13, fontWeight: "800", color: colors.textStrong },
  info: { gap: 3 },
  infoLabel: { fontSize: 11, color: colors.textSoft },
  infoNilai: { fontSize: 12, lineHeight: 18, fontWeight: "600", color: colors.text },
});
