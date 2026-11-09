import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import TeksTebal from "@/components/ui/tekstebal";
import { JADWAL_PEMOTONGAN, JENDELA_ANTAR, KIOS_PEMOTONGAN } from "@/data/pembayaran";
import { TEKS } from "@/data/teks";
import { colors, radius, spacing } from "@/theme";
import { TagihanTransfer } from "@/types/pembayaran";
import { potonganUnik } from "@/utils/pembayaran";

type Props = { tagihan: TagihanTransfer };

const T = TEKS.berhasil.jadwal;

// Kartu "Jadwal Pesanan": jam pemotongan, kios, potongan terpilih, dan target tiba
export default function JadwalPesanan({ tagihan }: Props) {
  const antar = tagihan.pengiriman === "antar";
  const potongan = potonganUnik(tagihan.baris);

  return (
    <View style={styles.kartu}>
      <View style={styles.judulBaris}>
        <Ionicons name="time-outline" size={16} color={colors.brown} />
        <Text style={styles.judul}>{T.judul}</Text>
      </View>

      <Text style={styles.pesanan}>{T.pesanan(JADWAL_PEMOTONGAN.urutan, JADWAL_PEMOTONGAN.jam)}</Text>

      <View style={styles.kios}>
        <Text style={styles.kiosNama} numberOfLines={1}>
          {KIOS_PEMOTONGAN.nama}
        </Text>
        <View style={styles.blok}>
          <Text style={styles.blokTeks}>{KIOS_PEMOTONGAN.blok}</Text>
        </View>
      </View>

      {potongan.length > 0 ? (
        <View style={styles.kustom}>
          <Text style={styles.kustomLabel}>{T.kustomisasi}</Text>
          <View style={styles.chipBaris}>
            {potongan.map((p) => (
              <View key={p} style={styles.chip}>
                <Ionicons name="cut-outline" size={14} color={colors.white} />
                <Text style={styles.chipTeks}>{p}</Text>
              </View>
            ))}
          </View>
        </View>
      ) : null}

      <View style={styles.target}>
        <TeksTebal
          teks={`**${antar ? T.targetTiba : T.targetSiap} ${JENDELA_ANTAR}**`}
          style={styles.targetJudul}
          warnaTebal={colors.text}
        />
        <Text style={styles.targetAlamat}>{antar ? (tagihan.alamat ?? "") : T.ambilDi(KIOS_PEMOTONGAN.nama)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  kartu: { backgroundColor: colors.white, borderRadius: radius.lg, padding: spacing.lg, gap: spacing.md },
  judulBaris: { flexDirection: "row", alignItems: "center", gap: 6 },
  judul: { fontSize: 12, fontWeight: "700", color: colors.brown },
  pesanan: { fontSize: 18, fontWeight: "800", color: colors.text },
  kios: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.md,
    backgroundColor: colors.accentSoft,
    borderRadius: radius.md,
    padding: spacing.md,
  },
  kiosNama: { flex: 1, fontSize: 13, fontWeight: "700", color: colors.text },
  blok: { backgroundColor: colors.accentSoftDeep, borderRadius: radius.sm, paddingHorizontal: spacing.sm, paddingVertical: 3 },
  blokTeks: { fontSize: 11, fontWeight: "700", color: colors.textSoft },
  kustom: { gap: spacing.sm },
  kustomLabel: { fontSize: 10, fontWeight: "700", letterSpacing: 0.4, textTransform: "uppercase", color: colors.textSoft },
  chipBaris: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: colors.dark,
    borderRadius: radius.xl,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
  },
  chipTeks: { fontSize: 12, fontWeight: "700", color: colors.white },
  target: { gap: 2 },
  targetJudul: { fontSize: 13, color: colors.text },
  targetAlamat: { fontSize: 12, lineHeight: 18, color: colors.textSoft },
});
