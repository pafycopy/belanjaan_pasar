import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing } from "@/theme";
import { TEKS } from "@/data/teks";
import { HADIAH_HARIAN, JENDELA_KLAIM } from "@/data/poin";
import { RingkasanKlaim } from "@/types/poin";
import { statusHari } from "@/utils/poin";
import Button from "@/components/ui/button";
import HariKlaim from "@/components/poin/hariklaim";

type Props = {
  ringkasan: RingkasanKlaim;
  mengklaim: boolean;
  onKlaim: () => void;
};

const pad = (n: number) => String(n).padStart(2, "0");
const jam = (menit: number) => `${pad(Math.floor(menit / 60))}.${pad(menit % 60)}`;
const durasi = (menit: number) => `${pad(Math.floor(menit / 60))} jam ${pad(menit % 60)} mnt`;

const T = TEKS.poin.klaim;

export default function KlaimHarian({ ringkasan, mengklaim, onKlaim }: Props) {
  const { fase, hitungMundur } = ringkasan;

  const labelTombol =
    fase === "bisa"
      ? T.tombol.bisa
      : fase === "sudah"
        ? T.tombol.sudah
        : fase === "sebelum"
          ? T.tombol.sebelum(jam(JENDELA_KLAIM.mulai))
          : T.tombol.terlewat;

  return (
    <View style={styles.card}>
      <Text style={styles.judul}>{T.judul}</Text>
      <Text style={styles.deskripsi}>
        {T.deskripsi(jam(JENDELA_KLAIM.mulai), jam(JENDELA_KLAIM.selesai))}
      </Text>

      <View style={styles.grid}>
        {HADIAH_HARIAN.map((h) => (
          <HariKlaim key={h.hari} item={h} status={statusHari(h.hari, ringkasan)} />
        ))}
      </View>

      <Button
        label={labelTombol}
        onPress={onKlaim}
        disabled={fase !== "bisa"}
        loading={mengklaim}
        style={styles.tombol}
      />

      <View style={styles.hitung}>
        <Ionicons name="hourglass" size={14} color="#c62828" />
        <Text style={styles.hitungLabel}>
          {TEKS.poin.klaim.hitungMundur[hitungMundur.jenis]}{" "}
          <Text style={styles.hitungNilai}>{durasi(hitungMundur.menit)}</Text>
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: spacing.lg,
    elevation: 1,
    shadowColor: colors.shadow,
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  judul: { fontSize: 20, fontWeight: "800", color: colors.text },
  deskripsi: { fontSize: 13, lineHeight: 18, color: colors.textSoft, marginTop: 4 },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 8,
    paddingTop: 36, // ruang untuk lencana "Hari Ini!" yang melayang di atas kotak
    marginBottom: spacing.lg,
  },
  tombol: {
    height: 50,
    borderRadius: 14,
    elevation: 3,
    shadowColor: colors.dark,
    shadowOpacity: 0.25,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  hitung: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    marginTop: spacing.md,
  },
  hitungLabel: { fontSize: 13, color: colors.muted },
  hitungNilai: { fontWeight: "800", color: colors.text },
});
