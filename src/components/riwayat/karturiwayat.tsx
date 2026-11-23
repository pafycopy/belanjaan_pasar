import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, radius, spacing } from "@/theme";
import { Transaksi, StatusTransaksi } from "@/types/transaksi";
import { formatHarga } from "@/utils/produk";
import { formatJamWib } from "@/utils/waktu";

type Props = { transaksi: Transaksi; onPress: () => void };

const GAYA: Record<StatusTransaksi, { label: string; bg: string; fg: string }> = {
  menunggu: { label: "Menunggu", bg: colors.peachSoft, fg: colors.orange },
  berhasil: { label: "Berhasil", bg: colors.mintFade, fg: colors.dark },
  gagal: { label: "Gagal", bg: "#FCE8E8", fg: "#C62828" },
  kedaluwarsa: { label: "Kedaluwarsa", bg: colors.canvas, fg: colors.muted },
  dibatalkan: { label: "Dibatalkan", bg: colors.canvas, fg: colors.muted },
};

export default function KartuRiwayat({ transaksi: t, onPress }: Props) {
  const gaya = GAYA[t.statusTransaksi];
  const jenis = t.jenisTransaksi === "ngebelanjain" ? "Pembayaran – Ngebelanjain" : "Pembayaran – Pesanan";
  const tanggal = new Date(t.dibuatLogPada + 7 * 60 * 60 * 1000);
  const hari = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"][tanggal.getUTCDay()];
  const bulan = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"][tanggal.getUTCMonth()];
  return (
    <Pressable style={styles.kartu} onPress={onPress} accessibilityRole="button">
      <View style={styles.atas}>
        <Text style={styles.judul} numberOfLines={1}>{jenis}</Text>
        <View style={[styles.badge, { backgroundColor: gaya.bg }]}>
          <Text style={[styles.badgeTeks, { color: gaya.fg }]}>{gaya.label}</Text>
        </View>
      </View>
      <View style={styles.bawah}>
        <View style={styles.kiri}>
          <Text style={styles.tanggal}>{`${hari}, ${tanggal.getUTCDate()} ${bulan}`}</Text>
          <View style={styles.waktu}>
            <Ionicons name="time-outline" size={12} color={colors.textSoft} />
            <Text style={styles.jam}>{formatJamWib(t.dibuatLogPada)}</Text>
          </View>
        </View>
        <View style={styles.kanan}>
          <Text style={styles.total}>{formatHarga(t.total)}</Text>
          <View style={styles.rincian}>
            <Text style={styles.rincianTeks}>Rincian Pembayaran</Text>
            <Ionicons name="chevron-forward" size={13} color={colors.textSoft} />
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  kartu: { backgroundColor: colors.white, borderRadius: radius.lg, padding: spacing.md, gap: spacing.md },
  atas: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  judul: { flex: 1, fontSize: 12, fontWeight: "600", color: colors.text },
  badge: { borderRadius: radius.xl, paddingHorizontal: spacing.sm, paddingVertical: 3 },
  badgeTeks: { fontSize: 10, fontWeight: "700" },
  bawah: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end" },
  kiri: { gap: spacing.xs },
  tanggal: { color: colors.dark, fontSize: 12, fontWeight: "700" },
  waktu: { flexDirection: "row", alignItems: "center", gap: 4 },
  jam: { fontSize: 10, color: colors.textSoft },
  kanan: { alignItems: "flex-end", gap: 3 },
  total: { fontSize: 16, fontWeight: "800", color: colors.dark },
  rincian: { flexDirection: "row", alignItems: "center", gap: 2 },
  rincianTeks: { fontSize: 10, color: colors.textSoft },
});
