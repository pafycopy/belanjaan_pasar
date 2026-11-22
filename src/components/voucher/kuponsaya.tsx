import { Pressable, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { colors, spacing, alpha } from "@/theme";
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
  aktif: [colors.heroB, colors.couponMid, colors.heroB],
  terpakai: [colors.couponInactive, colors.couponInactiveLight, colors.couponInactive],
  kedaluwarsa: [colors.couponInactive, colors.couponInactiveLight, colors.couponInactive],
};

// Kupon hijau di tab "Voucher Saya"
export default function KuponSaya({ voucher, milik, sekarang, onPakai }: Props) {
  const status = statusMilik(milik, voucher, sekarang);
  const aktif = status === "aktif";
  const berakhir = waktuKedaluwarsa(voucher);

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
      <View style={styles.teks}>
        <Text style={styles.judul}>{voucher.judulKupon ?? voucher.judul}</Text>
        {voucher.syaratKupon ? <Text style={styles.syarat}>{voucher.syaratKupon}</Text> : null}
      </View>

      <View style={styles.pemisah}>
        <PemisahTiket warnaGaris={alpha.white45} />
      </View>

      {voucher.rincianKupon ? (
        <View style={styles.rincian}>
          <Text style={styles.info}>{voucher.rincianKupon.kiri}</Text>
          <Text style={styles.info}>{voucher.rincianKupon.kanan}</Text>
        </View>
      ) : null}
      <View style={styles.bawah}>
        <Text style={[styles.info, styles.infoWaktu]}>{infoWaktu}</Text>

        <Pressable
          style={[styles.pakai, !aktif && styles.pakaiMati]}
          onPress={onPakai}
          disabled={!aktif}
        >
          <Text style={[styles.pakaiTeks, !aktif && styles.pakaiTeksMati]}>{labelTombol}</Text>
        </Pressable>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: 14, padding: spacing.lg, gap: 6 },
  teks: { gap: 2 },
  judul: { fontSize: 19, lineHeight: 25, fontWeight: "800", color: colors.white },
  syarat: { fontSize: 12, color: alpha.white85 },
  bawah: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: spacing.md },
  infoWaktu: { flex: 1 },
  pakai: {
    minWidth: 64,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: colors.white,
    alignItems: "center",
  },
  pakaiMati: { backgroundColor: alpha.white35 },
  pakaiTeks: { fontSize: 14, fontWeight: "800", color: colors.dark },
  pakaiTeksMati: { fontSize: 12, color: colors.white },
  pemisah: { marginTop: 6 },
  rincian: { flexDirection: "row", justifyContent: "space-between", gap: spacing.md },
  info: { fontSize: 11, fontWeight: "700", color: colors.white },
});
