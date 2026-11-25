import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { TabNgebelanjain } from "@/data/ngebelanjain";
import { StatusNgebelanjain } from "@/types/ngebelanjain";
import { colors, spacing } from "@/theme";
import { Image } from "expo-image";

type Props = {
  items: readonly TabNgebelanjain[];
  selectedId: StatusNgebelanjain;
  onSelect: (id: StatusNgebelanjain) => void;
  counts: Partial<Record<StatusNgebelanjain, number>>;
};

// Empat tahapan pesanan sebagai tab dengan badge jumlah pesanan pada setiap tahap.
export default function TabStatusNgebelanjain({ items, selectedId, onSelect, counts }: Props) {
  return (
    <View style={styles.baris} accessibilityRole="tablist">
      {items.map((it) => {
        const aktif = it.id === selectedId;
        const jumlah = counts[it.id] ?? 0;
        return (
          <Pressable
            key={it.id}
            onPress={() => onSelect(it.id)}
            style={[styles.item, aktif && styles.itemAktif]}
            accessibilityRole="tab"
            accessibilityState={{ selected: aktif }}
            accessibilityLabel={`${it.label.replace("\n", " ")}, ${jumlah} pesanan`}
          >
            <View style={styles.ikonWadah}>
              {it.ikonGambar ? (
                <Image source={it.ikonGambar} style={styles.ikonGambar} contentFit="contain" />
              ) : (
                <Ionicons name={it.ikon} size={26} color={aktif ? colors.dark : colors.textStrong} />
              )}
              {jumlah > 0 ? (
                <View style={styles.badge}>
                  <Text style={styles.badgeTeks}>{jumlah > 99 ? "99+" : jumlah}</Text>
                </View>
              ) : null}
            </View>
            <Text style={[styles.label, aktif && styles.labelAktif]} numberOfLines={2}>
              {it.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  baris: { flexDirection: "row", alignItems: "stretch" },
  ikonWadah: { width: 40, height: 30, alignItems: "center", justifyContent: "center", position: "relative" },
  ikonGambar: { width: 26, height: 26 },
  badge: {
    position: "absolute",
    top: -5,
    right: -7,
    minWidth: 18,
    height: 18,
    paddingHorizontal: 4,
    borderRadius: 9,
    backgroundColor: "#E53935",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: colors.white,
  },
  badgeTeks: { color: colors.white, fontSize: 9, lineHeight: 12, fontWeight: "800", textAlign: "center" },
  item: {
    flex: 1,
    alignItems: "center",
    gap: spacing.sm,
    paddingHorizontal: 2,
    paddingBottom: spacing.sm,
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  itemAktif: { borderBottomColor: colors.dark },
  label: { fontSize: 11, lineHeight: 14, fontWeight: "700", textAlign: "center", color: colors.textStrong },
  labelAktif: { color: colors.dark },
});
