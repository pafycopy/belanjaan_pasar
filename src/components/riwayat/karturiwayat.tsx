import { Pressable, StyleSheet, Text, View } from "react-native";
import GambarProduk from "@/components/produk/gambarproduk";
import Button from "@/components/ui/button";
import { GAYA_STATUS_RIWAYAT } from "@/data/riwayat";
import { TEKS } from "@/data/teks";
import { colors, radius, spacing } from "@/theme";
import { Pesanan } from "@/types/pesanan";
import { jumlahBarang, ringkasRiwayat } from "@/utils/riwayat";
import { cariProduk, formatHarga } from "@/utils/produk";

type Props = {
  pesanan: Pesanan;
  onDetail: () => void;
  onBeliLagi: () => void;
  onNilai: () => void;
};

// Kartu transaksi: toko + status, produk pertama, lalu total dan tombol Beli Lagi / Nilai
export default function KartuRiwayat({ pesanan: p, onDetail, onBeliLagi, onNilai }: Props) {
  const produk = p.baris[0] ? cariProduk(p.baris[0].produkId) : undefined;
  const ringkas = ringkasRiwayat(p);
  const gaya = GAYA_STATUS_RIWAYAT[p.status];
  const selesai = p.status === "selesai";

  return (
    <View style={styles.kartu}>
      <View style={styles.atas}>
        <Text style={styles.toko} numberOfLines={1}>
          {produk?.toko ?? TEKS.riwayat.tokoBawaan}
        </Text>
        <View style={[styles.lencana, { backgroundColor: gaya.bg }]}>
          <Text style={[styles.lencanaTeks, { color: gaya.fg }]}>{TEKS.pesanan.status[p.status]}</Text>
        </View>
      </View>

      <Pressable style={styles.produk} onPress={onDetail} accessibilityRole="button">
        <GambarProduk gambar={produk?.gambar} style={styles.gambar} fit="contain" />
        <View style={styles.info}>
          <Text style={styles.nama} numberOfLines={2}>
            {ringkas.nama}
          </Text>
          {ringkas.keterangan ? <Text style={styles.keterangan}>{ringkas.keterangan}</Text> : null}
        </View>
        <Text style={styles.jumlah}>x{ringkas.jumlah}</Text>
      </Pressable>

      <View style={styles.bawah}>
        <View style={styles.total}>
          <Text style={styles.totalLabel}>{TEKS.riwayat.jumlahBelanjaan(jumlahBarang(p))}</Text>
          <Text style={styles.totalNilai}>{formatHarga(p.total)}</Text>
        </View>

        <View style={styles.aksi}>
          <Button label={TEKS.riwayat.beliLagi} size="xs" onPress={onBeliLagi} style={styles.tombol} />
          {selesai ? (
            <Button label={TEKS.riwayat.nilai} size="xs" variant="soft" onPress={onNilai} style={styles.tombol} />
          ) : null}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  kartu: { backgroundColor: colors.white, borderRadius: radius.lg, padding: spacing.md, gap: spacing.md },
  atas: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: spacing.md },
  toko: { flex: 1, fontSize: 13, fontWeight: "700", color: colors.text },
  lencana: { borderRadius: radius.xl, paddingHorizontal: spacing.md, paddingVertical: 3 },
  lencanaTeks: { fontSize: 11, fontWeight: "700" },
  produk: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.md,
    backgroundColor: colors.accentSoft,
    borderRadius: radius.md,
    padding: spacing.sm,
  },
  gambar: { width: 64, height: 64, borderRadius: radius.sm, backgroundColor: colors.white },
  info: { flex: 1, gap: 2, paddingTop: spacing.xs },
  nama: { fontSize: 14, fontWeight: "700", color: colors.text, lineHeight: 19 },
  keterangan: { fontSize: 12, color: colors.textSoft },
  jumlah: { fontSize: 12, color: colors.muted, paddingTop: spacing.xs },
  bawah: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: spacing.sm },
  total: { flexShrink: 1, gap: 2 },
  totalLabel: { fontSize: 10, color: colors.muted },
  totalNilai: { fontSize: 14, fontWeight: "800", color: colors.text },
  aksi: { flexDirection: "row", gap: spacing.sm },
  tombol: { paddingHorizontal: spacing.lg },
});
