import { StyleSheet, Text, TextInput, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, radius, spacing } from "@/theme";
import { TEKS } from "@/data/teks";

type Props = { value: string; onChangeText: (v: string) => void };

export default function CatatanPelanggan({ value, onChangeText }: Props) {
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
          maxLength={300}
        />
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
  input: { minHeight: 76, backgroundColor: colors.white, borderRadius: radius.md, padding: spacing.md, fontSize: 14, color: colors.text, textAlignVertical: "top" },
});
