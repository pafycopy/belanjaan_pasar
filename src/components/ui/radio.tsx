import { StyleSheet, View } from "react-native";
import { colors } from "@/theme";

const UKURAN = 24;

// Penanda pilihan tunggal: lingkaran kosong, atau lingkaran hijau tua berisi titik bila dipilih
export default function Radio({ dipilih }: { dipilih: boolean }) {
  return (
    <View style={[styles.cincin, dipilih && styles.cincinAktif]}>
      {dipilih ? <View style={styles.titik} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  cincin: {
    width: UKURAN,
    height: UKURAN,
    borderRadius: UKURAN / 2,
    borderWidth: 1.5,
    borderColor: colors.textSoft,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
  },
  cincinAktif: { borderColor: colors.dark },
  titik: { width: 12, height: 12, borderRadius: 6, backgroundColor: colors.dark },
});
