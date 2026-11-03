import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors, radius, spacing } from "@/theme";
import { TEKS } from "@/data/teks";
import { kapital } from "@/utils/produk";
import Stepper from "@/components/ui/stepper";

type Props = {
  satuan: string;
  pilihan: readonly number[]; // tombol jumlah cepat
  jumlah: number;
  maks: number;
  onUbah: (n: number) => void;
  onCustom: () => void;
};

// Baris "Varian": tombol jumlah cepat + Custom di kiri, stepper di kanan.
// Tombol yang cocok dengan jumlah saat ini menyala; jumlah lain dianggap Custom.
export default function PilihJumlah({ satuan, pilihan, jumlah, maks, onUbah, onCustom }: Props) {
  const adaCocok = pilihan.includes(jumlah);

  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>{TEKS.produk.varian}</Text>

      <View style={styles.baris}>
        <View style={styles.chips}>
          {pilihan.map((n) => {
            const aktif = n === jumlah;
            const mati = n > maks;
            return (
              <Pressable
                key={n}
                style={[styles.chip, aktif && styles.chipAktif, mati && styles.chipMati]}
                disabled={mati}
                onPress={() => onUbah(n)}
              >
                <Text style={[styles.chipText, aktif && styles.teksAktif]}>{n}</Text>
                <Text style={[styles.chipText, aktif && styles.teksAktif]}>{kapital(satuan)}</Text>
              </Pressable>
            );
          })}
          <Pressable style={[styles.chip, styles.chipCustom, !adaCocok && styles.chipAktif]} onPress={onCustom}>
            <Text style={[styles.chipText, !adaCocok && styles.teksAktif]}>{TEKS.produk.custom}</Text>
          </Pressable>
        </View>

        <Stepper value={jumlah} onChange={onUbah} min={1} max={maks} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: spacing.sm },
  label: { fontSize: 13, color: colors.textSoft },
  baris: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: spacing.sm },
  chips: { flexDirection: "row", gap: 6, flexShrink: 1 },
  chip: {
    minWidth: 44,
    height: 40,
    paddingHorizontal: 6,
    borderRadius: radius.sm,
    backgroundColor: colors.accentSoft,
    alignItems: "center",
    justifyContent: "center",
  },
  chipCustom: { minWidth: 58 },
  chipAktif: { backgroundColor: colors.dark },
  chipMati: { opacity: 0.4 },
  chipText: { fontSize: 12, fontWeight: "600", color: colors.text, lineHeight: 15 },
  teksAktif: { color: colors.white },
});
