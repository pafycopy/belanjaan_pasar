import { StyleSheet, Text, View } from "react-native";
import Button from "@/components/ui/button";
import { TEKS_NGEBELANJAIN } from "@/data/teksngebelanjain";
import { colors, radius, spacing } from "@/theme";
import { PesananNgebelanjain } from "@/types/ngebelanjain";
import { pecahDaftar } from "@/utils/ngebelanjain";
import { formatJamWib } from "@/utils/waktu";

type Props = {
  pesanan: PesananNgebelanjain;
  onChat: () => void; // dipakai saat status "dibelanjain"
};

const T = TEKS_NGEBELANJAIN;

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

// Kartu pesanan untuk tahap "Sedang Diproses" dan "Sedang Dibelanjain"
export default function KartuNgebelanjain({ pesanan: p, onChat }: Props) {
  const dibelanjain = p.status === "dibelanjain";
  const baris = pecahDaftar(p.daftar);

  return (
    <View style={styles.kartu}>
      <View style={styles.atas}>
        <View style={styles.atasKiri}>
          <View style={[styles.badge, { backgroundColor: dibelanjain ? colors.primaryDeep : colors.orange }]}>
            <Text style={styles.badgeTeks}>{dibelanjain ? T.badge.dibelanjain : T.badge.diproses}</Text>
          </View>
          <Text style={styles.noPesanan}>{T.noPesanan(p.nomor)}</Text>
        </View>
        <View style={styles.atasKanan}>
          <Text style={styles.waktuLabel}>{dibelanjain ? T.estimasiSelesai : T.dipesanPukul}</Text>
          <Waktu teks={dibelanjain ? (p.estimasiSelesai ?? "-") : `${formatJamWib(p.dibuatPada)} WIB`} />
        </View>
      </View>

      <View style={styles.daftar}>
        <Text style={styles.judul}>{T.pesananAnda}</Text>
        {baris.map((b, i) => (
          <Text key={i} style={styles.baris}>
            {b.teks}
          </Text>
        ))}
      </View>

      {dibelanjain ? <Button label={T.chatWa} size="lg" onPress={onChat} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  kartu: {
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    padding: spacing.lg,
    gap: spacing.lg,
    shadowColor: colors.shadow,
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  atas: { flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between", gap: spacing.md },
  atasKiri: { gap: 6, flexShrink: 1 },
  badge: { alignSelf: "flex-start", borderRadius: radius.xl, paddingHorizontal: spacing.md, paddingVertical: 3 },
  badgeTeks: { fontSize: 11, fontWeight: "800", color: colors.white },
  noPesanan: { fontSize: 11, color: colors.textSoft },
  atasKanan: { alignItems: "flex-end", gap: 2 },
  waktuLabel: { fontSize: 11, fontWeight: "800", color: colors.textStrong },
  waktuNilai: { fontSize: 15, fontWeight: "800", color: colors.textStrong },
  zona: { fontSize: 11, fontWeight: "500", color: colors.muted },
  daftar: { gap: 3 },
  judul: { fontSize: 15, fontWeight: "800", color: colors.textStrong, marginBottom: 2 },
  baris: { fontSize: 13, lineHeight: 19, color: colors.text },
});
