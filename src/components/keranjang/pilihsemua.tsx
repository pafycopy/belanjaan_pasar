import { Pressable, StyleSheet, Text } from "react-native";
import Radio from "@/components/ui/radio";
import { TEKS } from "@/data/teks";
import { colors, radius, spacing } from "@/theme";

type Props = {
  semua: boolean;          // semua produk sedang dipilih
  jumlahDipilih: number;
  onPress: () => void;
};

const T = TEKS.keranjang;

// Baris "Pilih Semua" di atas daftar belanjaan
export default function PilihSemua({ semua, jumlahDipilih, onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={styles.baris}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: semua }}
      accessibilityLabel={T.pilihSemua}
    >
      <Radio dipilih={semua} />
      <Text style={styles.label}>{T.pilihSemua}</Text>
      <Text style={styles.hitung}>{T.dipilih(jumlahDipilih)}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  baris: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  label: { flex: 1, fontSize: 13, fontWeight: "700", color: colors.text },
  hitung: { fontSize: 12, color: colors.muted },
});
