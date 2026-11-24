import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import RincianTagihan from "@/components/ngebelanjain/rinciantagihan";
import { TEKS_NGEBELANJAIN } from "@/data/teksngebelanjain";
import { colors, radius, spacing } from "@/theme";
import { PesananNgebelanjain } from "@/types/ngebelanjain";

const T = TEKS_NGEBELANJAIN;

type Props = {
  pesanan: PesananNgebelanjain;
  onTutup: () => void; // tutup pemberitahuan, kembali ke kartu "Bayar Sekarang"
};

// Tampilan di tab "Pembayaran Tersedia" saat waktu bayar QRIS / Virtual Account habis.
// Tombol "Pembayaran Baru" ada di footer tab.
export default function PembayaranKedaluwarsa({ pesanan: p, onTutup }: Props) {
  return (
    <View style={styles.wadah}>
      <View style={styles.bar}>
        <Pressable onPress={onTutup} hitSlop={10} accessibilityRole="button" accessibilityLabel={T.kedaluwarsa.tutup}>
          <Ionicons name="close" size={22} color={colors.textStrong} />
        </Pressable>
        <Text style={styles.judul}>{T.kedaluwarsa.judul}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.isi} showsVerticalScrollIndicator={false}>
        <View style={styles.kartu}>
          <Text style={styles.noPesanan}>{T.noPesanan(p.nomor)}</Text>
          <RincianTagihan pesanan={p} tampilJumlah />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wadah: { flex: 1 },
  bar: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.lg,
    backgroundColor: colors.white,
    paddingHorizontal: 14,
    paddingVertical: spacing.md,
  },
  judul: { fontSize: 15, fontWeight: "800", color: colors.danger },
  isi: { padding: 14, paddingBottom: spacing.xl },
  kartu: { backgroundColor: colors.white, borderRadius: radius.xl, padding: spacing.lg, gap: spacing.md },
  noPesanan: { fontSize: 11, color: colors.textSoft },
});
