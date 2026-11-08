import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors, radius, spacing } from "@/theme";
import { IdPengiriman, OPSI_PENGIRIMAN } from "@/data/keranjang";
import { TEKS } from "@/data/teks";

type Props = { dipilih: IdPengiriman; onChange: (id: IdPengiriman) => void };

// Pilihan pengiriman (antar / ambil) berbentuk kontrol segmen; isinya dari OPSI_PENGIRIMAN
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
              <Ionicons name={opsi.icon} size={16} color={aktif ? colors.white : colors.text} />
              <Text style={[styles.text, aktif && styles.activeText]}>{opsi.label}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 14, fontWeight: "700", color: colors.text, marginBottom: spacing.sm },
  group: {
    flexDirection: "row",
    gap: spacing.xs,
    padding: spacing.xs,
    backgroundColor: colors.accentSoftStrong,
    borderRadius: radius.lg,
  },
  option: {
    flex: 1,
    minHeight: 38,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    borderRadius: radius.md,
  },
  active: { backgroundColor: colors.dark },
  text: { fontSize: 12, fontWeight: "700", color: colors.text },
  activeText: { color: colors.white },
});
