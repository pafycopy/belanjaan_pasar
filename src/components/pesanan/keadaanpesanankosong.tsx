import { Image } from "expo-image";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors, radius, spacing } from "@/theme";
import { StatusPesanan } from "@/types/pesanan";

type Props = {
  status: StatusPesanan;
  onLihatProduk: () => void;
};

const KONTEN = {
  disiapkan: {
    gambar: require("../../assets/images/pesanan/disiapkan.svg"),
    judul: "Belum Ada Pesanan yang Sedang Disiapkan",
    deskripsi: "Kebutuhan dapur Anda belum dipesan. Pesan sekarang untuk pengantaran esok hari.",
  },
  dikirim: {
    gambar: require("../../assets/images/pesanan/dikirim.svg"),
    judul: "Belum Ada Pesanan yang Sedang Dikirim",
    deskripsi: "Kurir kami belum dalam perjalanan ke alamat Anda. Pesan sekarang!",
  },
  selesai: {
    gambar: require("../../assets/images/pesanan/selesai.svg"),
    judul: "Belum Ada Pesanan yang Selesai",
    deskripsi: "Riwayat pesanan Anda masih kosong. Yuk, mulai belanja untuk pengalaman belanjaan pasar.",
  },
} as const;

export default function KeadaanPesananKosong({ status, onLihatProduk }: Props) {
  const konten = KONTEN[status];

  return (
    <View style={styles.container}>
      <Image source={konten.gambar} style={styles.gambar} contentFit="contain" />
      <Text style={styles.judul}>{konten.judul}</Text>
      <Text style={styles.deskripsi}>{konten.deskripsi}</Text>
      <Pressable
        onPress={onLihatProduk}
        style={({ pressed }) => [styles.tombol, pressed && styles.tombolTekan]}
        accessibilityRole="button"
        accessibilityLabel="Lihat Promo dan Produk Terlaris"
      >
        <Text style={styles.teksTombol}>Lihat Promo &amp; Produk Terlaris</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minHeight: 500,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  gambar: { width: 300, height: 300, marginBottom: 12 },
  judul: {
    maxWidth: 250,
    color: colors.textStrong,
    fontSize: 16,
    lineHeight: 16,
    fontWeight: "700",
    textAlign: "center",
  },
  deskripsi: {
    maxWidth: 230,
    marginTop: 6,
    color: colors.muted,
    fontSize: 11,
    lineHeight: 16,
    textAlign: "center",
  },
  tombol: {
    marginTop: 8,
    minHeight: 23,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 12,
    borderRadius: 7,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.canvas,
  },
  tombolTekan: { opacity: 0.7 },
  teksTombol: { color: colors.primary, fontSize: 12, fontWeight: "700" },
});
