import { Pressable, ScrollView, StyleSheet, Text } from "react-native";
import BottomSheet from "@/components/ui/bottomsheet";
import Radio from "@/components/ui/radio";
import { TEKS } from "@/data/teks";
import { colors, spacing } from "@/theme";

export type OpsiBulan = { kunci: string | null; label: string }; // kunci null = semua waktu

type Props = {
  opsi: readonly OpsiBulan[];
  dipilih: string | null;
  onPilih: (kunci: string | null) => void;
  onTutup: () => void;
};

// Lembar pemilih bulan: satu pilihan, isinya dari `opsi`
export default function PilihBulanSheet({ opsi, dipilih, onPilih, onTutup }: Props) {
  return (
    <BottomSheet title={TEKS.riwayat.pilihBulan} onClose={onTutup}>
      <ScrollView style={styles.daftar} showsVerticalScrollIndicator={false}>
        {opsi.map((o) => (
          <Pressable key={o.kunci ?? "semua"} style={styles.baris} onPress={() => onPilih(o.kunci)}>
            <Text style={[styles.label, o.kunci === dipilih && styles.labelAktif]}>{o.label}</Text>
            <Radio dipilih={o.kunci === dipilih} />
          </Pressable>
        ))}
      </ScrollView>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  daftar: { maxHeight: 320, marginTop: spacing.sm },
  baris: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  label: { fontSize: 14, color: colors.text },
  labelAktif: { fontWeight: "700", color: colors.dark },
});
