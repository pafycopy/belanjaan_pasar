import { StyleSheet, View } from "react-native";
import { colors } from "@/theme";

const UKURAN = 16;

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
    borderWidth: 1,
    borderColor: "#9ca3af",
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
  },
  cincinAktif: { borderColor: "#006b35", borderWidth: 1.5 },
  titik: { width: 8, height: 8, borderRadius: 4, backgroundColor: "#006b35" },
});
