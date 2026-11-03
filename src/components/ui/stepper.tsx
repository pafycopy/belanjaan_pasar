import { Pressable, StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, radius } from "@/theme";

type Props = {
  value: number;
  onChange: (n: number) => void;
  min?: number;
  max?: number;
  style?: StyleProp<ViewStyle>;
};

// Pemilih jumlah: [ - 1 + ] berlatar hijau tua
export default function Stepper({ value, onChange, min = 1, max = Number.POSITIVE_INFINITY, style }: Props) {
  const bisaKurang = value > min;
  const bisaTambah = value < max;

  return (
    <View style={[styles.wrap, style]}>
      <Pressable
        style={[styles.tombol, !bisaKurang && styles.mati]}
        disabled={!bisaKurang}
        onPress={() => onChange(value - 1)}
        hitSlop={6}
      >
        <Ionicons name="remove" size={20} color={colors.white} />
      </Pressable>
      <Text style={styles.nilai}>{value}</Text>
      <Pressable
        style={[styles.tombol, !bisaTambah && styles.mati]}
        disabled={!bisaTambah}
        onPress={() => onChange(value + 1)}
        hitSlop={6}
      >
        <Ionicons name="add" size={20} color={colors.white} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    height: 40,
    minWidth: 100,
    paddingHorizontal: 8,
    borderRadius: radius.lg,
    backgroundColor: colors.dark,
  },
  tombol: { width: 26, height: 28, alignItems: "center", justifyContent: "center" },
  mati: { opacity: 0.4 },
  nilai: { color: colors.white, fontSize: 16, fontWeight: "700", minWidth: 24, textAlign: "center" },
});
