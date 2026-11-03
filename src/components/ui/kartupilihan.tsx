import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, radius, spacing } from "@/theme";
import { IconName } from "@/types/ui";

type Props = {
  ikon: IconName;
  judul: string;
  deskripsi: string;
  dipilih: boolean;
  warnaIkon: string; // warna ikon saat belum dipilih
  onPress: () => void;
};

// Kartu pilihan tunggal (2 kolom): ikon, judul, deskripsi, dan penanda radio di kanan atas
export default function KartuPilihan({ ikon, judul, deskripsi, dipilih, warnaIkon, onPress }: Props) {
  return (
    <Pressable style={[styles.kartu, dipilih && styles.kartuAktif]} onPress={onPress}>
      <View style={styles.atas}>
        <Ionicons name={ikon} size={22} color={dipilih ? colors.white : warnaIkon} />
        <View style={[styles.radio, dipilih && styles.radioAktif]}>
          {dipilih ? <Ionicons name="checkmark" size={14} color={colors.dark} /> : null}
        </View>
      </View>
      <Text style={[styles.judul, dipilih && styles.teksAktif]}>{judul}</Text>
      <Text style={[styles.deskripsi, dipilih && styles.teksAktif]}>{deskripsi}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  kartu: {
    width: "48.5%",
    backgroundColor: colors.accentSoft,
    borderRadius: radius.lg,
    padding: 14,
    gap: 6,
  },
  kartuAktif: { backgroundColor: colors.dark },
  atas: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: spacing.xs },
  radio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.accentSoftStrong,
    alignItems: "center",
    justifyContent: "center",
  },
  radioAktif: { backgroundColor: colors.white },
  judul: { fontSize: 15, fontWeight: "700", color: colors.text },
  deskripsi: { fontSize: 12, lineHeight: 17, color: colors.textSoft },
  teksAktif: { color: colors.white },
});
