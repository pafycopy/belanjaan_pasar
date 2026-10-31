import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, radius, spacing } from "@/theme";
import { IconName } from "@/types/ui";

export type ChipItem = {
  id: string;
  label: string;
  icon?: IconName;
};

type Props = {
  items: readonly ChipItem[];
  selectedId: string;
  onSelect: (id: string) => void;
  scroll?: boolean;
  inactiveBg?: string;
};

export default function ChipGroup({
  items,
  selectedId,
  onSelect,
  scroll,
  inactiveBg,
}: Props) {
  const chips = items.map((item) => {
    const aktif = item.id === selectedId;
    const warna = aktif
      ? colors.white
      : colors.text;

    return (
      <Pressable
        key={item.id}
        style={[
          styles.chip,
          inactiveBg &&
            !aktif && {
              backgroundColor: inactiveBg,
            },
          aktif && styles.chipAktif,
        ]}
        onPress={() => onSelect(item.id)}
      >
        {item.icon ? (
          <Ionicons
            name={item.icon}
            size={13}
            color={warna}
          />
        ) : null}

        <Text
          style={[
            styles.text,
            { color: warna },
          ]}
        >
          {item.label}
        </Text>
      </Pressable>
    );
  });

  if (scroll) {
    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        {chips}
      </ScrollView>
    );
  }

  return (
    <View style={styles.row}>
      {chips}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },

  scroll: {
    flexDirection: "row",
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingVertical: 4,
  },

  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: spacing.md,
    paddingVertical: 7,
    borderRadius: radius.xl,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    elevation: 1,
    shadowColor: colors.shadow,
    shadowOpacity: 0.06,
    shadowRadius: 3,
    shadowOffset: {
      width: 0,
      height: 1,
    },
  },

  chipAktif: {
    backgroundColor: colors.dark,
    borderColor: colors.dark,
  },

  text: {
    fontSize: 12,
    fontWeight: "600",
  },
});