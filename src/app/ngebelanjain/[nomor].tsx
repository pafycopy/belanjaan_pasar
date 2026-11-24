import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Button from "@/components/ui/button";
import HeaderHijau from "@/components/ui/headerhijau";
import Nominal from "@/components/ui/nominal";
import ScreenState from "@/components/ui/screenstate";
import KepalaPesanan from "@/components/ngebelanjain/kepalapesanan";
import { useNgebelanjain } from "@/context/ngebelanjain";
import { OPSI_PENGIRIMAN } from "@/data/keranjang";
import { TEKS_NGEBELANJAIN } from "@/data/teksngebelanjain";
import { colors, radius, spacing } from "@/theme";
import { pecahDaftar } from "@/utils/ngebelanjain";
import { formatTanggalJamWib } from "@/utils/waktu";

const T = TEKS_NGEBELANJAIN;
const D = T.halamanDetail;

export default function DetailNgebelanjain() {
  const { nomor } = useLocalSearchParams<{ nomor?: string }>();
  const router = useRouter();
  const { pesanan, memuat } = useNgebelanjain();
  const p = pesanan.find((x) => x.nomor === nomor);

  const daftar = p ? pecahDaftar(p.daftar) : [];
  const waktuPesan = p ? formatTanggalJamWib(p.dibuatPada) : "-";
  const waktuBayar = p?.dibayarPada ? formatTanggalJamWib(p.dibayarPada) : "-";
  const pengiriman =
    p ? OPSI_PENGIRIMAN.find((o) => o.id === p.pengiriman)?.label ?? "-" : "-";
  const metode =
    p?.metode === "transfer"
      ? "Transfer BCA"
      : p?.metode === "qris"
        ? "QRIS"
        : p?.metode === "cod"
          ? "COD"
          : "-";

  const selesai = p?.status === "selesai";

  return (
    <View style={styles.screen}>
      <HeaderHijau judul={D.judul} />

      {memuat ? (
        <ScreenState loading />
      ) : !p ? (
        <ScreenState message={D.tidakDitemukan} />
      ) : (
        <>
          <ScrollView
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
          >
            {selesai ? (
              <View style={styles.statusSelesai}>
                <View style={styles.ikonSelesai}>
                  <Ionicons name="checkmark" size={24} color={colors.white} />
                </View>
                <View style={styles.statusTeksWrap}>
                  <Text style={styles.statusJudul}>Pesanan selesai</Text>
                  <Text style={styles.statusSub}>
                    {p.selesaiPada
                      ? `Diselesaikan: ${formatTanggalJamWib(p.selesaiPada)}`
                      : `Dibayar: ${waktuBayar}`}
                  </Text>
                </View>
              </View>
            ) : (
              <View style={styles.kartu}>
                <KepalaPesanan pesanan={p} />
              </View>
            )}

            <View style={styles.kartu}>
              <View style={styles.judulBaris}>
                <Text style={styles.judul}>Daftar Belanja</Text>
                <Text style={styles.hitung}>{D.jumlahBarang(daftar.length)}</Text>
              </View>

              {daftar.length > 0 ? (
                <View style={styles.daftar}>
                  {daftar.map((baris, index) => (
                    <View
                      key={`${index}-${baris.teks}`}
                      style={[styles.barisBarang, index > 0 && styles.garisBarang]}
                    >
                      <Text style={styles.nomorBarang}>{index + 1}.</Text>
                      <Text style={styles.namaBarang}>{baris.nama}</Text>
                      {baris.jumlah ? (
                        <Text style={styles.jumlahBarang}>{baris.jumlah}</Text>
                      ) : null}
                    </View>
                  ))}
                </View>
              ) : (
                <Text style={styles.teksKosong}>Daftar belanja tidak tersedia.</Text>
              )}
            </View>

            <View style={styles.kartu}>
              <Text style={styles.judul}>Informasi Pengiriman</Text>
              <Info label={D.pengiriman} nilai={pengiriman} />
              {p.alamat ? <Info label={D.alamat} nilai={p.alamat} /> : null}
              {p.estimasiSelesai ? (
                <Info label="Estimasi selesai" nilai={p.estimasiSelesai} />
              ) : null}
            </View>

            {selesai && p.tagihan ? (
              <View style={styles.kartu}>
                <Text style={styles.judul}>Rincian Pembayaran</Text>
                <BarisUang label="Total Produk" nilai={p.tagihan.totalProduk} />
                <BarisUang label="Jasa Helper" nilai={p.tagihan.jasaHelper} />
                {p.tagihan.ongkir > 0 ? (
                  <BarisUang label="Ongkos Kirim" nilai={p.tagihan.ongkir} />
                ) : null}
                <View style={styles.pemisah} />
                <View style={styles.totalBaris}>
                  <Text style={styles.totalLabel}>Total Pembayaran</Text>
                  <Nominal nilai={p.tagihan.total} ukuran={20} warna={colors.dark} />
                </View>
              </View>
            ) : null}

            <View style={styles.kartu}>
              <Text style={styles.judul}>Informasi Pesanan</Text>
              <Info label="No. Pesanan" nilai={`#${p.nomor}`} />
              <Info label="Waktu Pemesanan" nilai={waktuPesan} />
              {selesai ? (
                <>
                  <Info label="Waktu Pembayaran" nilai={waktuBayar} />
                  <Info label="Metode Pembayaran" nilai={metode} />
                </>
              ) : null}
            </View>
          </ScrollView>

          {selesai ? (
            <View style={styles.footer}>
              <Button
                label="Ngebelanjain Lagi"
                size="lg"
                onPress={() =>
                  router.push({
                    pathname: "/ngebelanjain/daftar",
                    params: { isiUlang: p.daftar },
                  })
                }
              />
            </View>
          ) : p.status === "dibelanjain" ? (
            <View style={styles.footer}>
              <Button label={T.chatWa} size="lg" onPress={() => router.push("/ngebelanjain")} />
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

function BarisUang({ label, nilai }: { label: string; nilai: number }) {
  return (
    <View style={styles.barisUang}>
      <Text style={styles.labelUang}>{label}</Text>
      <Nominal nilai={nilai} ukuran={15} warna={colors.textStrong} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.canvas },
  content: { padding: 14, paddingBottom: spacing.xl, gap: spacing.md },
  statusSelesai: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    backgroundColor: colors.primarySoft,
    marginHorizontal: -14,
    marginTop: -14,
    paddingHorizontal: 20,
    paddingVertical: 22,
  },
  ikonSelesai: {
    width: 42,
    height: 42,
    borderRadius: radius.pill,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.dark,
  },
  statusTeksWrap: { flex: 1, gap: 4 },
  statusJudul: { fontSize: 19, fontWeight: "800", color: colors.dark },
  statusSub: { fontSize: 13, lineHeight: 19, color: colors.textSoft },
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
  judulBaris: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.md,
  },
  judul: { fontSize: 16, fontWeight: "800", color: colors.textStrong },
  hitung: { fontSize: 12, color: colors.muted },
  daftar: { gap: 0 },
  barisBarang: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.sm,
    paddingVertical: spacing.sm,
  },
  garisBarang: { borderTopWidth: 1, borderTopColor: colors.border },
  nomorBarang: { width: 22, fontSize: 13, color: colors.muted },
  namaBarang: { flex: 1, fontSize: 14, lineHeight: 20, color: colors.text },
  jumlahBarang: {
    maxWidth: "42%",
    fontSize: 13,
    lineHeight: 20,
    fontWeight: "700",
    color: colors.dark,
    textAlign: "right",
  },
  teksKosong: { fontSize: 13, color: colors.muted },
  info: { gap: 3 },
  infoLabel: { fontSize: 11, color: colors.muted },
  infoNilai: { fontSize: 13, lineHeight: 20, fontWeight: "600", color: colors.text },
  barisUang: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.md,
  },
  labelUang: { fontSize: 13, color: colors.textSoft },
  pemisah: { height: 1, backgroundColor: colors.border, marginVertical: 2 },
  totalBaris: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.md,
  },
  totalLabel: { fontSize: 14, fontWeight: "800", color: colors.textStrong },
  footer: {
    paddingHorizontal: 14,
    paddingTop: spacing.sm,
    paddingBottom: spacing.lg,
    backgroundColor: colors.barBg,
  },
});
