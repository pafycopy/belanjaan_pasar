import { StyleSheet, Text, View } from "react-native";
import Nominal from "@/components/ui/nominal";
import { TEKS_NGEBELANJAIN } from "@/data/teksngebelanjain";
import { colors, spacing } from "@/theme";
import { PesananNgebelanjain } from "@/types/ngebelanjain";
import { formatRibuan } from "@/utils/angka";
import { pecahDaftar } from "@/utils/ngebelanjain";

const T = TEKS_NGEBELANJAIN;
const T2 = T.menunggu;
const rp = (n: number) => `Rp${formatRibuan(n)}`; // gaya tabel: "Rp80.000"

type Props = {
  pesanan: PesananNgebelanjain;
  tampilJumlah?: boolean; // tulis "3 produk" di kanan judul "Pesanan Anda"
};

function Baris({ kiri, kanan, tebal }: { kiri: string; kanan?: string; tebal?: boolean }) {
  return (
    <View style={styles.baris}>
      <Text style={[styles.kiri, tebal && styles.tebal]}>{kiri}</Text>
      {kanan ? <Text style={[styles.kanan, tebal && styles.tebal]}>{kanan}</Text> : null}
    </View>
  );
}

// Daftar pesanan + rincian biaya + total pembayaran (dipakai halaman tagihan, layar COD, dan Pembayaran Kedaluwarsa)
export default function RincianTagihan({ pesanan: p, tampilJumlah }: Props) {
  const baris = pecahDaftar(p.daftar);
  const t = p.tagihan;

  return (
    <View style={styles.wadah}>
      <View style={styles.bagian}>
        <Baris kiri={T.pesananAnda} kanan={tampilJumlah ? T.dibayar.produk(baris.length) : undefined} tebal />
        {baris.map((b, i) => (
          <Baris key={i} kiri={b.nama} kanan={b.jumlah} />
        ))}
      </View>

      {t ? (
        <>
          <View style={styles.bagian}>
            <Baris kiri={T2.rincian} kanan={T2.nominal} tebal />
            <Baris kiri={T2.totalProduk} kanan={rp(t.totalProduk)} />
            <Baris kiri={T2.jasaHelper} kanan={rp(t.jasaHelper)} />
            {p.pengiriman === "antar" ? <Baris kiri={T2.ongkir} kanan={rp(t.ongkir)} /> : null}
          </View>

          <View style={styles.totalBaris}>
            <Text style={styles.totalLabel}>{T2.totalBayar}</Text>
            <Nominal nilai={t.total} ukuran={20} warna={colors.textStrong} />
          </View>
        </>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wadah: { gap: spacing.lg },
  bagian: { gap: 6 },
  baris: { flexDirection: "row", justifyContent: "space-between", gap: spacing.md },
  kiri: { flex: 1, fontSize: 13, color: colors.text },
  kanan: { fontSize: 13, color: colors.text, textAlign: "right" },
  tebal: { fontWeight: "800", color: colors.textStrong },
  totalBaris: { flexDirection: "row", alignItems: "baseline", justifyContent: "space-between", gap: spacing.md },
  totalLabel: { fontSize: 12, color: colors.textSoft },
});
