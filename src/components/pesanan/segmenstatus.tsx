import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors, radius } from "@/theme";

type Item<T extends string> = { id: T; label: string };

type Props<T extends string> = {
  items: readonly Item<T>[];
  selectedId: T;
  onSelect: (id: T) => void;
};

// Tab status berbentuk kapsul: yang aktif putih dengan titik hijau di depan labelnya
export default function SegmenStatus<T extends string>({ items, selectedId, onSelect }: Props<T>) {
  return (
    <View style={styles.wadah} accessibilityRole="tablist">
      {items.map((it) => {
        const aktif = it.id === selectedId;
        return (
          <Pressable
            key={it.id}
            onPress={() => onSelect(it.id)}
            style={[styles.segmen, aktif && styles.segmenAktif]}
            accessibilityRole="tab"
            accessibilityState={{ selected: aktif }}
          >
            {aktif ? <View style={styles.titik} /> : null}
            <Text style={[styles.label, aktif && styles.labelAktif]} numberOfLines={1}>
              {it.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wadah: {
    flexDirection: "row",
    backgroundColor: colors.accentSoftStrong,
    borderRadius: radius.lg,
    padding: 4,
  },
  segmen: {
    flex: 1,
    minHeight: 36,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    borderRadius: radius.md,
  },
  segmenAktif: {
    backgroundColor: colors.white,
    shadowColor: colors.shadow,
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
  titik: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.dark },
  label: { fontSize: 12, fontWeight: "600", color: colors.textSoft },
  labelAktif: { fontWeight: "800", color: colors.dark },
});
