import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, radius, spacing } from "@/theme";
import { TEKS } from "@/data/teks";

type Props = {
  value: string;
  onChangeText: (v: string) => void;
  saran: readonly string[]; // tombol saran: ketuk untuk menambahkan ke catatan
};

// Bagian "Catatan Khusus Pemotong": kolom catatan + tombol saran
export default function CatatanPemotong({ value, onChangeText, saran }: Props) {
  // "+ Tanpa kepala" -> tambahkan "Tanpa kepala" ke catatan (dilewati bila sudah ada)
  const tambahSaran = (s: string) => {
    const teks = s.replace(/^\+\s*/, "");
    if (value.toLowerCase().includes(teks.toLowerCase())) return;
    onChangeText(value.trim() ? `${value.trim()}, ${teks}` : teks);
  };

  return (
    <View style={styles.wrap}>
      <View style={styles.judulBaris}>
        <Text style={styles.judul}>{TEKS.produk.catatan.judul}</Text>
        <Text style={styles.opsional}>{TEKS.opsional}</Text>
      </View>

      <View style={styles.kartu}>
        <View style={styles.label}>
          <Ionicons name="reader-outline" size={14} color={colors.text} />
          <Text style={styles.labelText}>{TEKS.produk.catatan.label}</Text>
        </View>

        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={TEKS.produk.catatan.placeholder}
          placeholderTextColor={colors.placeholder}
          multiline
        />

        <View style={styles.saran}>
          {saran.map((s) => (
            <Pressable key={s} style={styles.chip} onPress={() => tambahSaran(s)}>
              <Text style={styles.chipText}>{s}</Text>
            </Pressable>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: spacing.md },
  judulBaris: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  judul: { fontSize: 18, fontWeight: "700", color: colors.text },
  opsional: { fontSize: 12, fontWeight: "700", color: colors.textSoft },
  kartu: { backgroundColor: colors.accentSoft, borderRadius: radius.lg, padding: spacing.md, gap: 10 },
  label: { flexDirection: "row", alignItems: "center", gap: 6 },
  labelText: { fontSize: 12, fontWeight: "600", color: colors.text },
  input: {
    minHeight: 76,
    backgroundColor: colors.white,
    borderRadius: radius.md,
    padding: spacing.md,
    fontSize: 14,
    color: colors.text,
    textAlignVertical: "top",
  },
  saran: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  chip: { backgroundColor: colors.accentSoftStrong, borderRadius: radius.xl, paddingHorizontal: 12, paddingVertical: 6 },
  chipText: { fontSize: 12, color: colors.textSoft },
});
