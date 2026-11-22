import { StyleSheet, Text, View } from "react-native";
import { TEKS_NGEBELANJAIN } from "@/data/teksngebelanjain";
import { colors, radius, spacing } from "@/theme";
import { PesananNgebelanjain, StatusNgebelanjain } from "@/types/ngebelanjain";
import { formatJamWib } from "@/utils/waktu";

const T = TEKS_NGEBELANJAIN;

const WARNA_BADGE: Record<StatusNgebelanjain, string> = {
  diproses: colors.orange,
  dibelanjain: colors.primaryDeep,
  pembayaran: colors.orange,
  dibayar: colors.dark,
  selesai: colors.dark,
};

// "04.30 WIB": zona waktu dibuat lebih kecil dan pudar
function Waktu({ teks }: { teks: string }) {
  const wib = teks.endsWith(" WIB");
  return (
    <Text style={styles.waktuNilai}>
      {wib ? teks.slice(0, -4) : teks}
      {wib ? <Text style={styles.zona}> WIB</Text> : null}
    </Text>
  );
}

// Bagian atas kartu pesanan: badge status, nomor pesanan, dan waktu (dipakai kartu daftar dan halaman detail)
export default function KepalaPesanan({ pesanan: p }: { pesanan: PesananNgebelanjain }) {
  const dibelanjain = p.status === "dibelanjain";

  return (
    <View style={styles.atas}>
      <View style={styles.atasKiri}>
        <View style={[styles.badge, { backgroundColor: WARNA_BADGE[p.status] }]}>
          <Text style={styles.badgeTeks}>{T.badge[p.status]}</Text>
        </View>
        <Text style={styles.noPesanan}>{T.noPesanan(p.nomor)}</Text>
      </View>
      <View style={styles.atasKanan}>
        <Text style={styles.waktuLabel}>{dibelanjain ? T.estimasiSelesai : T.dipesanPukul}</Text>
        <Waktu teks={dibelanjain ? (p.estimasiSelesai ?? "-") : `${formatJamWib(p.dibuatPada)} WIB`} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  atas: { flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between", gap: spacing.md },
  atasKiri: { gap: 6, flexShrink: 1 },
  badge: { alignSelf: "flex-start", borderRadius: radius.xl, paddingHorizontal: spacing.md, paddingVertical: 3 },
  badgeTeks: { fontSize: 11, fontWeight: "800", color: colors.white },
  noPesanan: { fontSize: 11, color: colors.textSoft },
  atasKanan: { alignItems: "flex-end", gap: 2 },
  waktuLabel: { fontSize: 11, fontWeight: "800", color: colors.textStrong },
  waktuNilai: { fontSize: 15, fontWeight: "800", color: colors.textStrong },
  zona: { fontSize: 11, fontWeight: "500", color: colors.muted },
});
