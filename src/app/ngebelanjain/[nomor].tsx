import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Button from "@/components/ui/button";
import HeaderHijau from "@/components/ui/headerhijau";
import Nominal from "@/components/ui/nominal";
import ScreenState from "@/components/ui/screenstate";
import { useNgebelanjain } from "@/context/ngebelanjain";
import { OPSI_PENGIRIMAN, TARIF_ONGKIR } from "@/data/keranjang";
import { TEKS_NGEBELANJAIN } from "@/data/teksngebelanjain";
import { JENDELA_ANTAR, KIOS_PEMOTONGAN } from "@/data/pembayaran";
import { formatRibuan } from "@/utils/angka";
import { colors, radius, spacing } from "@/theme";
import { pecahDaftar } from "@/utils/ngebelanjain";
import { formatTanggalJamWib } from "@/utils/waktu";

const D = TEKS_NGEBELANJAIN.halamanDetail;

export default function DetailNgebelanjain() {
  const { nomor } = useLocalSearchParams<{ nomor?: string }>();
  const router = useRouter();
  const { pesanan, memuat } = useNgebelanjain();
  const p = pesanan.find((x) => x.nomor === nomor);
  const daftar = p ? pecahDaftar(p.daftar) : [];
  const waktuPesan = p ? formatTanggalJamWib(p.dibuatPada) : "-";
  const waktuBayar = p?.dibayarPada ? formatTanggalJamWib(p.dibayarPada) : "-";
  const pengiriman = p ? OPSI_PENGIRIMAN.find((o) => o.id === p.pengiriman) : undefined;
  const metode = p?.metode === "transfer" ? "BCA Virtual Account" : p?.metode === "qris" ? "QRIS" : p?.metode === "cod" ? "COD" : "-";
  const selesai = p?.status === "selesai";

  return (
    <View style={styles.screen}>
      <HeaderHijau judul={D.judul} />
      {memuat ? <ScreenState loading /> : !p ? <ScreenState message={D.tidakDitemukan} /> : (
        <>
          <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
            <View style={styles.statusSelesai}>
              <View style={styles.ikonSelesai}>
                <Ionicons name={selesai ? "checkmark" : pengiriman?.icon ?? "cart-outline"} size={24} color={colors.white} />
              </View>
              <View style={styles.statusTeksWrap}>
                <Text style={styles.statusJudul}>{selesai ? "Pesanan selesai" : TEKS_NGEBELANJAIN.badge[p.status]}</Text>
                <Text style={styles.statusSub}>{selesai ? `Diterima: ${p.selesaiPada ? formatTanggalJamWib(p.selesaiPada) : waktuBayar}` : p.estimasiSelesai ? `Estimasi selesai: ${p.estimasiSelesai}` : `Dipesan: ${waktuPesan}`}</Text>
              </View>
            </View>

            <View style={styles.kartu}>
              <View style={styles.judulBaris}>
                <Text style={styles.judul}>Ringkasan Pesanan</Text>
                <Text style={styles.invoice}>Invoice: #{p.nomor}</Text>
              </View>
              {daftar.length ? <View style={styles.daftar}>{daftar.map((baris, index) => (
                <View key={`${index}-${baris.teks}`} style={styles.barisBarang}>
                  <View style={styles.nomorBarang}><Text style={styles.nomorBarangTeks}>{index + 1}</Text></View>
                  <View style={styles.detailBarang}>
                    <Text style={styles.namaBarang}>{baris.nama}</Text>
                    {baris.jumlah ? <Text style={styles.jumlahBarang}>{baris.jumlah}</Text> : null}
                  </View>
                </View>
              ))}</View> : <Text style={styles.teksKosong}>Daftar belanja tidak tersedia.</Text>}
            </View>

            <View style={styles.kartu}>
              <Text style={styles.judul}>Informasi Pengiriman</Text>
              {p.pengiriman === "antar" ? (
                <View style={styles.pengirimanBox}>
                  <View style={styles.ikonPengiriman}><Ionicons name="bicycle" size={27} color={colors.dark} /></View>
                  <View style={styles.pengirimanIsi}>
                    <Text style={styles.pengirimanJudul}>Ongkos Kurir</Text>
                    <Text style={styles.pengirimanCatatan}>{TARIF_ONGKIR[0]?.label ?? "Biaya pengantaran"}</Text>
                  </View>
                  <Text style={styles.hargaPengiriman}>Rp {formatRibuan(p.tagihan?.ongkir ?? 0)}</Text>
                </View>
              ) : null}
              <View style={styles.jadwalBox}>
                <Ionicons name={p.pengiriman === "antar" ? "bicycle" : "storefront-outline"} size={21} color={colors.dark} />
                <View style={styles.pengirimanIsi}>
                  <Text style={styles.pengirimanJudul}>{p.pengiriman === "antar" ? `Pengantaran (${JENDELA_ANTAR})` : `Pengambilan (${JENDELA_ANTAR})`}</Text>
                  <Text style={styles.alamat}>{p.pengiriman === "antar" ? (p.alamat ?? "Alamat pengantaran belum tersedia.") : `Ambil pesanan langsung di ${KIOS_PEMOTONGAN.nama}.`}</Text>
                </View>
              </View>
            </View>

            {selesai && p.tagihan ? <View style={styles.kartu}>
              <Text style={styles.judul}>Rincian Pembayaran</Text>
              <BarisUang label="Subtotal Produk" nilai={p.tagihan.totalProduk} />
              <BarisUang label="Jasa Helper" nilai={p.tagihan.jasaHelper} />
              {p.tagihan.ongkir > 0 ? <BarisUang label="Ongkos Kurir" nilai={p.tagihan.ongkir} /> : null}
              <View style={styles.pemisah} />
              <View style={styles.totalBaris}><Text style={styles.totalLabel}>Total Pembayaran</Text><Nominal nilai={p.tagihan.total} ukuran={20} warna={colors.dark} /></View>
            </View> : null}

            <View style={styles.kartu}>
              <Text style={styles.judul}>Informasi Pesanan</Text>
              <Info label="No. Pesanan" nilai={`#${p.nomor}`} />
              <Info label="Waktu Pemesanan" nilai={waktuPesan} />
              {selesai ? <>
                <Info label="Waktu Pembayaran" nilai={waktuBayar} />
                <Info label="Metode Pembayaran" nilai={`${metode} · Lunas`} />
              </> : null}
            </View>
          </ScrollView>
          {selesai ? <View style={styles.footer}><Button label="Penilaian Produk" variant="light" size="lg" style={styles.footerButton} onPress={() => Alert.alert("Penilaian Produk", "Fitur penilaian produk Ngebelanjain belum tersedia.")} /><Button label="Ngebelanjain Lagi" size="lg" style={styles.footerButton} onPress={() => router.push({ pathname: "/ngebelanjain/daftar", params: { isiUlang: p.daftar } })} /></View> : p.status === "dibelanjain" ? <View style={styles.footer}><Button label={TEKS_NGEBELANJAIN.chatWa} size="lg" onPress={() => router.push("/ngebelanjain")} /></View> : null}
        </>
      )}
    </View>
  );
}

function Info({ label, nilai }: { label: string; nilai: string }) {
  return <View style={styles.info}><Text style={styles.infoLabel}>{label}</Text><Text style={styles.infoNilai}>{nilai}</Text></View>;
}
function BarisUang({ label, nilai }: { label: string; nilai: number }) {
  return <View style={styles.barisUang}><Text style={styles.labelUang}>{label}</Text><Nominal nilai={nilai} ukuran={15} warna={colors.textStrong} /></View>;
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.canvas },
  content: { padding: 14, paddingBottom: spacing.xl, gap: spacing.md },
  statusSelesai: { flexDirection: "row", alignItems: "center", gap: spacing.md, backgroundColor: colors.accentSoftStrong, marginHorizontal: -14, marginTop: -14, paddingHorizontal: 20, paddingVertical: 22 },
  ikonSelesai: { width: 42, height: 42, borderRadius: radius.pill, alignItems: "center", justifyContent: "center", backgroundColor: colors.dark },
  statusTeksWrap: { flex: 1, gap: 4 },
  statusJudul: { fontSize: 19, fontWeight: "800", color: colors.dark },
  statusSub: { fontSize: 13, lineHeight: 19, color: colors.textSoft },
  kartu: { backgroundColor: colors.white, borderRadius: radius.xl, padding: spacing.lg, gap: spacing.md, shadowColor: colors.shadow, shadowOpacity: 0.05, shadowRadius: 7, shadowOffset: { width: 0, height: 2 }, elevation: 1 },
  judulBaris: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: spacing.sm },
  judul: { fontSize: 16, fontWeight: "800", color: colors.textStrong },
  invoice: { fontSize: 12, color: colors.muted },
  daftar: { gap: spacing.sm },
  barisBarang: { minHeight: 64, flexDirection: "row", alignItems: "center", gap: spacing.md, padding: spacing.md, borderRadius: radius.lg, backgroundColor: colors.accentSoft },
  nomorBarang: { width: 34, height: 34, borderRadius: radius.md, alignItems: "center", justifyContent: "center", backgroundColor: colors.primarySoft },
  nomorBarangTeks: { fontSize: 14, fontWeight: "800", color: colors.dark },
  detailBarang: { flex: 1, gap: 4 },
  namaBarang: { fontSize: 14, lineHeight: 20, fontWeight: "700", color: colors.textStrong },
  jumlahBarang: { fontSize: 13, color: colors.dark, fontWeight: "700" },
  teksKosong: { fontSize: 13, color: colors.muted },
  pengirimanBox: { flexDirection: "row", alignItems: "center", gap: spacing.md, padding: spacing.md, borderRadius: radius.lg, backgroundColor: colors.accentSoft },
  ikonPengiriman: { width: 58, height: 58, borderRadius: radius.md, alignItems: "center", justifyContent: "center", backgroundColor: colors.primarySoft },
  pengirimanIsi: { flex: 1, gap: 5 },
  pengirimanJudul: { fontSize: 14, fontWeight: "800", color: colors.textStrong },
  alamat: { fontSize: 13, lineHeight: 19, color: colors.textSoft },
  pengirimanCatatan: { fontSize: 12, color: colors.dark, fontWeight: "700" },
  hargaPengiriman: { fontSize: 14, fontWeight: "800", color: colors.textStrong },
  jadwalBox: { flexDirection: "row", alignItems: "flex-start", gap: spacing.md, padding: spacing.md, borderRadius: radius.lg, backgroundColor: colors.accentSoft },
  info: { flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between", gap: spacing.md },
  infoLabel: { flex: 1, fontSize: 13, color: colors.textSoft },
  infoNilai: { flex: 1.3, fontSize: 13, lineHeight: 19, fontWeight: "700", color: colors.textStrong, textAlign: "right" },
  barisUang: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: spacing.md },
  labelUang: { fontSize: 13, color: colors.textSoft },
  pemisah: { height: 1, backgroundColor: colors.border, marginVertical: 2 },
  totalBaris: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: spacing.md },
  totalLabel: { fontSize: 14, fontWeight: "800", color: colors.textStrong },
  footer: { flexDirection: "row", gap: spacing.sm, paddingHorizontal: 14, paddingTop: spacing.sm, paddingBottom: spacing.xl, marginBottom: spacing.xl, backgroundColor: colors.barBg },
  footerButton: { flex: 1 },
});
