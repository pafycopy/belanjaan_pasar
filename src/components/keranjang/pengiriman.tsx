import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors, radius, spacing } from "@/theme";

type Props = { antar: boolean; onChange: (antar: boolean) => void };

export default function OpsiPengiriman({ antar, onChange }: Props) {
  return (
    <View>
      <Text style={styles.title}>Opsi Pengiriman</Text>
      <View style={styles.group}>
        <Pressable style={[styles.option, antar && styles.active]} onPress={() => onChange(true)}>
          <Ionicons name="bicycle" size={14} color={antar ? colors.white : colors.text} />
          <Text style={[styles.text, antar && styles.activeText]}>Antar ke Rumah</Text>
        </Pressable>
        <Pressable style={[styles.option, !antar && styles.active]} onPress={() => onChange(false)}>
          <Ionicons name="storefront-outline" size={14} color={!antar ? colors.white : colors.text} />
          <Text style={[styles.text, !antar && styles.activeText]}>Ambil di Toko</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 12, fontWeight: "700", color: colors.text, marginBottom: 7 },
  group: { flexDirection: "row", backgroundColor: colors.white, borderRadius: radius.md, overflow: "hidden" },
  option: { flex: 1, minHeight: 36, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 5 },
  active: { backgroundColor: colors.primary },
  text: { fontSize: 10, color: colors.text, fontWeight: "600" },
  activeText: { color: colors.white },
});
