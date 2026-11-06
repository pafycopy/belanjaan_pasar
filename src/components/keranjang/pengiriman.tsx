import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors, radius } from "@/theme";
import { IdPengiriman, OPSI_PENGIRIMAN } from "@/data/keranjang";
import { TEKS } from "@/data/teks";

type Props = { dipilih: IdPengiriman; onChange: (id: IdPengiriman) => void };

// Pilihan pengiriman (antar / ambil); isinya dari OPSI_PENGIRIMAN
export default function OpsiPengiriman({ dipilih, onChange }: Props) {
  return (
    <View>
      <Text style={styles.title}>{TEKS.keranjang.pengiriman}</Text>
      <View style={styles.group}>
        {OPSI_PENGIRIMAN.map((opsi) => {
          const aktif = opsi.id === dipilih;
          return (
            <Pressable
              key={opsi.id}
              style={[styles.option, aktif && styles.active]}
              onPress={() => onChange(opsi.id)}
            >
              <Ionicons name={opsi.icon} size={14} color={aktif ? colors.white : colors.text} />
              <Text style={[styles.text, aktif && styles.activeText]}>{opsi.label}</Text>
            </Pressable>
          );
        })}
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
