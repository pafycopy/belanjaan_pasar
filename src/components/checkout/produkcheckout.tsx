import { StyleSheet, Text, View } from "react-native";
import GambarProduk from "@/components/produk/gambarproduk";
import { colors, radius, spacing } from "@/theme";
import { BarisKeranjang, formatKg } from "@/utils/keranjang";
import { formatHarga } from "@/utils/produk";

type Props = { baris: readonly BarisKeranjang[] };

function formatBerat(gram: number): string {
  if (gram >= 1000) return `${formatKg(gram / 1000)} kg`;
  return `${gram} g`;
}

export default function ProdukCheckout({ baris }: Props) {
  return (
    <View style={styles.kartu}>
      <Text style={styles.judul}>Ringkasan Pesanan</Text>
      <View style={styles.daftar}>
        {baris.map(({ item, produk }) => {
          const berat = (produk.beratBersihGram ?? 0) * item.jumlah;
          return (
            <View key={item.uid} style={styles.itemKartu}>
              <GambarProduk gambar={produk.gambar} style={styles.gambar} fit="contain" />
              <View style={styles.info}>
                <Text style={styles.nama}>{produk.nama}</Text>
                <Text style={styles.detail}>{item.jumlah} {produk.satuan ?? "pcs"} · {formatBerat(berat)}</Text>
                {item.catatan?.trim() ? <Text style={styles.catatan}>Catatan: {item.catatan.trim()}</Text> : null}
                <Text style={styles.harga}>{formatHarga(item.hargaSatuan * item.jumlah)}</Text>
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  kartu: { backgroundColor: colors.white, borderRadius: radius.lg, padding: spacing.md, gap: spacing.md },
  judul: { fontSize: 14, fontWeight: "700", color: colors.text },
  daftar: { gap: spacing.md },
  itemKartu: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radius.lg,
    backgroundColor: colors.accentSoft,
  },
  gambar: { width: 88, height: 96, borderRadius: radius.sm, backgroundColor: colors.white },
  info: { flex: 1, gap: 3 },
  nama: { fontSize: 13, lineHeight: 18, fontWeight: "600", color: colors.text },
  detail: { fontSize: 12, color: colors.muted },
  catatan: { fontSize: 12, color: colors.dark },
  harga: { fontSize: 14, fontWeight: "700", color: colors.dark, marginTop: 2 },
});
