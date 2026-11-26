import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Nominal from "@/components/ui/nominal";
import { colors, radius, spacing } from "@/theme";
import { PesananNgebelanjain } from "@/types/ngebelanjain";
import { pecahDaftar } from "@/utils/ngebelanjain";
import { formatTanggalJamWib } from "@/utils/waktu";

type Props = {
  pesanan: PesananNgebelanjain;
  onDetail: () => void;
  onNilai: () => void;
  onPesanUlang: () => void;
};

/** Kartu Ngebelanjain pada tab Pesanan > Selesai. */
export default function KartuNgebelanjainSelesai({
  pesanan: p,
  onDetail,
  onNilai,
  onPesanUlang,
}: Props) {
  const [daftarTerbuka, setDaftarTerbuka] = useState(false);
  const daftar = pecahDaftar(p.daftar);
  const batasBaris = 3;
  const terpotong = daftar.length > batasBaris;
  const barisTampil = terpotong && !daftarTerbuka ? daftar.slice(0, batasBaris) : daftar;
  const waktu = p.selesaiPada ?? p.dibayarPada ?? p.dibuatPada;
  const metode =
    p.metode === "transfer"
      ? "Transfer BCA"
      : p.metode === "qris"
        ? "QRIS"
        : p.metode === "cod"
          ? "COD"
          : "Pembayaran";

  return (
    <View style={styles.kartu}>
      <Pressable onPress={onDetail} style={styles.atas} accessibilityRole="button">
        <View style={styles.atasKiri}>
          <View style={styles.badge}>
            <Text style={styles.badgeTeks}>Selesai</Text>
          </View>
          <Text style={styles.nomor}>No. Pesanan: #{p.nomor}</Text>
        </View>
        <View style={styles.atasKanan}>
          <Text style={styles.jenis}>Ngebelanjain</Text>
          <Text style={styles.waktu}>{formatTanggalJamWib(waktu)}</Text>
        </View>
      </Pressable>

      <Pressable onPress={onDetail} style={styles.isi} accessibilityRole="button">
        <Text style={styles.judul}>Pesanan Anda</Text>
        <View style={styles.daftar}>
          {barisTampil.map((baris, index) => (
            <Text key={`${baris.teks}-${index}`} style={styles.baris}>
              {baris.teks}
            </Text>
          ))}
        </View>
        {terpotong ? (
          <Pressable
            onPress={(event) => {
              event.stopPropagation();
              setDaftarTerbuka((terbuka) => !terbuka);
            }}
            hitSlop={8}
            style={styles.tautan}
            accessibilityRole="button"
          >
            <Text style={styles.tautanTeks}>
              {daftarTerbuka ? "Lebih sedikit" : "Baca selengkapnya…"}
            </Text>
          </Pressable>
        ) : null}
      </Pressable>

      <Pressable onPress={onDetail} style={styles.bayar} accessibilityRole="button">
        <Text style={styles.metode}>{metode}</Text>
        <Nominal nilai={p.tagihan?.total ?? 0} ukuran={20} warna={colors.textStrong} />
      </Pressable>

      <View style={styles.aksi}>
        <Pressable onPress={onNilai} style={[styles.tombol, styles.tombolLembut]} accessibilityRole="button">
          <Text style={[styles.tombolTeks, styles.teksGelap]}>Penilaian Produk</Text>
        </Pressable>
        <Pressable onPress={onPesanUlang} style={[styles.tombol, styles.tombolHijau]} accessibilityRole="button">
          <Text style={[styles.tombolTeks, styles.teksPutih]}>Ngebelanjain Lagi</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  kartu: {
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    padding: spacing.md,
    gap: spacing.md,
    shadowColor: colors.shadow,
    shadowOpacity: 0.12,
    shadowRadius: 7,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  atas: { flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between", gap: spacing.md },
  atasKiri: { gap: 6, flexShrink: 1 },
  badge: { alignSelf: "flex-start", borderRadius: radius.xl, paddingHorizontal: spacing.md, paddingVertical: 3, backgroundColor: colors.primaryDeep },
  badgeTeks: { fontSize: 11, fontWeight: "800", color: colors.white },
  nomor: { fontSize: 11, fontWeight: "600", color: colors.textSoft },
  atasKanan: { alignItems: "flex-end", gap: 2, flexShrink: 1 },
  jenis: { fontSize: 12, fontWeight: "800", color: colors.textStrong },
  waktu: { fontSize: 14, fontWeight: "700", color: colors.textStrong, textAlign: "right" },
  isi: { gap: 8 },
  judul: { fontSize: 14, fontWeight: "800", color: colors.text },
  daftar: { gap: 1 },
  baris: { fontSize: 14, lineHeight: 18, color: colors.text },
  tautan: { alignSelf: "flex-start", marginTop: 2 },
  tautanTeks: { fontSize: 13, fontWeight: "800", color: colors.textStrong },
  bayar: { flexDirection: "row", alignItems: "baseline", justifyContent: "space-between", gap: spacing.md, marginTop: 1 },
  metode: { flexShrink: 1, fontSize: 12, color: colors.textSoft },
  aksi: { flexDirection: "row", gap: spacing.sm },
  tombol: { flex: 1, minHeight: 48, borderRadius: radius.lg, alignItems: "center", justifyContent: "center", paddingHorizontal: spacing.sm },
  tombolLembut: { backgroundColor: colors.accentSoftStrong },
  tombolHijau: { backgroundColor: colors.primaryDeep },
  tombolTeks: { fontSize: 12, fontWeight: "700", textAlign: "center" },
  teksGelap: { color: colors.dark },
  teksPutih: { color: colors.white },
});
