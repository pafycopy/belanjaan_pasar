import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { colors, spacing } from "@/theme";
import { TEKS } from "@/data/teks";
import { StatusMilik } from "@/types/voucher";

type Props = {
  aktif: StatusMilik;
  jumlah: Record<StatusMilik, number>;
  onChange: (status: StatusMilik) => void;
};

const URUTAN: StatusMilik[] = ["aktif", "terpakai", "kedaluwarsa"];

// Chip filter di tab "Voucher Saya": jumlah tampil sebagai lencana di chip aktif, "(n)" di chip lain
export default function FilterStatus({ aktif, jumlah, onChange }: Props) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.baris}
    >
      {URUTAN.map((status) => {
        const dipilih = status === aktif;
        const label = TEKS.voucher.milik.filter[status];
        return (
          <Pressable
            key={status}
            style={[styles.chip, dipilih && styles.chipAktif]}
            onPress={() => onChange(status)}
          >
            <Text style={[styles.teks, dipilih && styles.teksAktif]}>
              {dipilih ? label : `${label} (${jumlah[status]})`}
            </Text>
            {dipilih ? (
              <View style={styles.lencana}>
                <Text style={styles.lencanaTeks}>{jumlah[status]}</Text>
              </View>
            ) : null}
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  baris: { flexDirection: "row", gap: spacing.sm, paddingVertical: 2, paddingRight: spacing.lg },
  chip: {
    height: 34,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    borderRadius: 17,
    backgroundColor: colors.accentSoft,
  },
  chipAktif: { backgroundColor: "#1e7a39" },
  teks: { fontSize: 12, fontWeight: "600", color: colors.text },
  teksAktif: { color: colors.white },
  lencana: {
    minWidth: 18,
    height: 18,
    paddingHorizontal: 5,
    borderRadius: 9,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
  },
  lencanaTeks: { fontSize: 10, fontWeight: "800", color: colors.dark },
});
