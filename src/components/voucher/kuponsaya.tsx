import { Pressable, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { colors, spacing } from "@/theme";
import { TEKS } from "@/data/teks";
import { StatusMilik, Voucher, VoucherMilik } from "@/types/voucher";
import { statusMilik, teksBerlaku, waktuKedaluwarsa } from "@/utils/voucher";
import { formatTanggal, tanggalWIB } from "@/utils/waktu";
import PemisahTiket from "@/components/voucher/pemisahtiket";

type Props = {
  voucher: Voucher;
  milik: VoucherMilik;
  sekarang: number;
  onPakai: () => void;
};

const T = TEKS.voucher.milik;

const GRADASI: Record<StatusMilik, [string, string, string]> = {
  aktif: [colors.heroB, "#1f8038", colors.heroB],
  terpakai: ["#7d8a80", "#98a49c", "#7d8a80"],
  kedaluwarsa: ["#7d8a80", "#98a49c", "#7d8a80"],
};

// Kupon hijau di tab "Voucher Saya"
export default function KuponSaya({ voucher, milik, sekarang, onPakai }: Props) {
  const status = statusMilik(milik, voucher, sekarang);
  const aktif = status === "aktif";
  const berakhir = waktuKedaluwarsa(voucher, milik.ditukarPada);

  const infoWaktu =
    status === "aktif"
      ? teksBerlaku(berakhir, sekarang)
      : status === "terpakai"
        ? T.sudahDipakai
        : T.berakhirPada(formatTanggal(tanggalWIB(berakhir)));

  const labelTombol = aktif ? T.pakai : status === "terpakai" ? T.terpakai : T.berakhir;

  return (
    <LinearGradient
      colors={GRADASI[status]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.card}
    >
      <View style={styles.atas}>
        <View style={styles.teks}>
          <Text style={styles.judul}>{voucher.judulKupon ?? voucher.judul}</Text>
          {voucher.syaratKupon ? <Text style={styles.syarat}>{voucher.syaratKupon}</Text> : null}
        </View>

        <Pressable
          style={[styles.pakai, !aktif && styles.pakaiMati]}
          onPress={onPakai}
          disabled={!aktif}
        >
          <Text style={[styles.pakaiTeks, !aktif && styles.pakaiTeksMati]}>{labelTombol}</Text>
        </Pressable>
      </View>

      <View style={styles.pemisah}>
        <PemisahTiket warnaGaris="rgba(255,255,255,0.45)" />
      </View>

      {voucher.rincianKupon ? (
        <View style={styles.rincian}>
          <Text style={styles.info}>{voucher.rincianKupon.kiri}</Text>
          <Text style={styles.info}>{voucher.rincianKupon.kanan}</Text>
        </View>
      ) : null}
      <Text style={styles.info}>{infoWaktu}</Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: 14, padding: spacing.lg, gap: 6 },
  atas: { flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between", gap: spacing.md },
  teks: { flex: 1, gap: 2 },
  judul: { fontSize: 19, lineHeight: 25, fontWeight: "800", color: colors.white },
  syarat: { fontSize: 12, color: "rgba(255,255,255,0.85)" },
  pakai: {
    minWidth: 64,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: colors.white,
    alignItems: "center",
  },
  pakaiMati: { backgroundColor: "rgba(255,255,255,0.35)" },
  pakaiTeks: { fontSize: 14, fontWeight: "800", color: colors.dark },
  pakaiTeksMati: { fontSize: 12, color: colors.white },
  pemisah: { marginTop: 6 },
  rincian: { flexDirection: "row", justifyContent: "space-between", gap: spacing.md },
  info: { fontSize: 11, fontWeight: "700", color: colors.white },
});
