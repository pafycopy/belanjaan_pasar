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
};

// Empat tahapan pesanan sebagai tab: ikon di atas, label dua baris, garis bawah pada yang aktif
export default function TabStatusNgebelanjain({ items, selectedId, onSelect }: Props) {
  return (
    <View style={styles.baris} accessibilityRole="tablist">
      {items.map((it) => {
        const aktif = it.id === selectedId;
        return (
          <Pressable
            key={it.id}
            onPress={() => onSelect(it.id)}
            style={[styles.item, aktif && styles.itemAktif]}
            accessibilityRole="tab"
            accessibilityState={{ selected: aktif }}
          >
            {it.ikonGambar ? (
            <Image
              source={it.ikonGambar}
              style={styles.ikonGambar}
              contentFit="contain"
            />
          ) : (
            <Ionicons
              name={it.ikon}
              size={26}
              color={aktif ? colors.dark : colors.textStrong}
            />
          )}
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
  ikonGambar: {
  width: 26,
  height: 26,
  },
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
