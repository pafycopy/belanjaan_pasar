import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { OPSI_METODE_NGEBELANJAIN } from "@/data/ngebelanjain";
import { TEKS_NGEBELANJAIN } from "@/data/teksngebelanjain";
import { colors, radius, spacing } from "@/theme";
import { MetodeNgebelanjain } from "@/types/ngebelanjain";

type Props = {
  dipilih: MetodeNgebelanjain;
  onPilih: (id: MetodeNgebelanjain) => void;
};

// Pilihan cara bayar (QRIS / COD) dengan tombol radio
export default function MetodeBayar({ dipilih, onPilih }: Props) {
  return (
    <View style={styles.wadah}>
      <Text style={styles.judul}>{TEKS_NGEBELANJAIN.metode.judul}</Text>
      <View style={styles.daftar}>
        {OPSI_METODE_NGEBELANJAIN.map((o) => {
          const aktif = o.id === dipilih;
          return (
            <Pressable
              key={o.id}
              onPress={() => onPilih(o.id)}
              style={styles.baris}
              accessibilityRole="radio"
              accessibilityState={{ selected: aktif }}
            >
              <View style={styles.ikon}>
                <Ionicons name={o.ikon} size={22} color={colors.dark} />
              </View>
              <View style={styles.teks}>
                <Text style={styles.nama}>{o.nama}</Text>
                <Text style={styles.ket}>{o.keterangan}</Text>
              </View>
              <View style={[styles.radio, aktif && styles.radioAktif]}>{aktif ? <View style={styles.titik} /> : null}</View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wadah: { padding: 14, gap: spacing.md },
  judul: { fontSize: 12, fontWeight: "700", color: colors.textSoft },
  daftar: { gap: spacing.sm },
  baris: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: spacing.md,
  },
  ikon: { width: 36, height: 36, alignItems: "center", justifyContent: "center" },
  teks: { flex: 1, gap: 1 },
  nama: { fontSize: 14, fontWeight: "800", color: colors.text },
  ket: { fontSize: 11, color: colors.textSoft },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  radioAktif: { borderColor: colors.dark },
  titik: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.dark },
});
