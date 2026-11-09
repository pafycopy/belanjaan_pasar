import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";
import GambarProduk from "@/components/produk/gambarproduk";
import { JENDELA_ANTAR } from "@/data/pembayaran";
import { TEKS } from "@/data/teks";
import { colors, radius, spacing } from "@/theme";
import { BarisTagihan, TagihanTransfer } from "@/types/pembayaran";
import { cariProduk, formatHarga } from "@/utils/produk";

type Props = { tagihan: TagihanTransfer };

const T = TEKS.pembayaran.ringkasan;

export function BarisProduk({ baris }: { baris: BarisTagihan }) {
  const produk = cariProduk(baris.produkId);
  return (
    <View style={styles.baris}>
      <GambarProduk gambar={produk?.gambar} style={styles.gambar} fit="contain" />
      <View style={styles.info}>
        <Text style={styles.nama} numberOfLines={2}>
          {baris.nama}
        </Text>
        <Text style={styles.keterangan}>{baris.potongan ?? TEKS.keranjang.produkSegar}</Text>
        {baris.jumlah > 1 ? (
          <Text style={styles.jumlah}>{T.jumlah(baris.jumlah, formatHarga(baris.hargaSatuan))}</Text>
        ) : null}
      </View>
      <Text style={styles.harga}>{formatHarga(baris.hargaSatuan * baris.jumlah)}</Text>
    </View>
  );
}

// Kartu "Ringkasan Pesanan": daftar produk, ongkos kurir, dan info pengantaran / ambil di toko
export default function RingkasanPesanan({ tagihan }: Props) {
  const antar = tagihan.pengiriman === "antar";

  return (
    <View style={styles.kartu}>
      <View style={styles.judulBaris}>
        <Text style={styles.judul}>{T.judul}</Text>
        <Text style={styles.invoice}>{T.invoice(tagihan.invoice)}</Text>
      </View>

      <View style={styles.daftar}>
        {tagihan.baris.map((b, i) => (
          <BarisProduk key={`${b.produkId}-${i}`} baris={b} />
        ))}

        {tagihan.ongkir !== null ? (
          <View style={styles.baris}>
            <View style={[styles.gambar, styles.ikonKurir]}>
              <Ionicons name="bicycle" size={28} color={colors.dark} />
            </View>
            <View style={styles.info}>
              <Text style={styles.nama}>{T.ongkir}</Text>
              {tagihan.labelOngkir ? <Text style={styles.keterangan}>{tagihan.labelOngkir}</Text> : null}
            </View>
            <Text style={styles.harga}>{formatHarga(tagihan.ongkir)}</Text>
          </View>
        ) : null}

        <View style={styles.antar}>
          <Ionicons
            name={antar ? "bicycle" : "storefront-outline"}
            size={20}
            color={colors.dark}
            style={styles.antarIkon}
          />
          <View style={styles.info}>
            <Text style={styles.antarJudul}>{antar ? T.antar(JENDELA_ANTAR) : T.ambil}</Text>
            <Text style={styles.antarAlamat}>{antar ? (tagihan.alamat ?? "") : T.ambilPesan}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  kartu: { backgroundColor: colors.white, borderRadius: radius.lg, padding: spacing.lg, gap: spacing.md },
  judulBaris: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: spacing.md },
  judul: { fontSize: 15, fontWeight: "800", color: colors.text },
  invoice: { fontSize: 12, color: colors.muted },
  daftar: { gap: spacing.sm },
  baris: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    backgroundColor: colors.accentSoft,
    borderRadius: radius.md,
    padding: spacing.sm,
  },
  gambar: { width: 64, height: 64, borderRadius: radius.sm, backgroundColor: colors.white },
  ikonKurir: { alignItems: "center", justifyContent: "center", backgroundColor: colors.primarySoft },
  info: { flex: 1, gap: 2 },
  nama: { fontSize: 13, lineHeight: 18, fontWeight: "700", color: colors.text },
  keterangan: { fontSize: 12, fontWeight: "700", color: colors.dark },
  jumlah: { fontSize: 11, color: colors.muted },
  harga: { fontSize: 13, fontWeight: "800", color: colors.text },
  antar: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.sm,
    backgroundColor: colors.accentSoftStrong,
    borderRadius: radius.md,
    padding: spacing.md,
  },
  antarIkon: { marginTop: 1 },
  antarJudul: { fontSize: 13, fontWeight: "700", color: colors.text },
  antarAlamat: { fontSize: 12, lineHeight: 18, color: colors.textSoft },
});
