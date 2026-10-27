import { ActivityIndicator, Pressable, StyleProp, StyleSheet, ViewStyle } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/theme";
import { IconName } from "@/types/ui";

type Props = {
  icon: IconName;
  onPress: () => void;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
};

// Tombol bulat putih melayang (mis. "lokasi saya" di atas peta)
export default function RoundIconButton({ icon, onPress, loading, style }: Props) {
  return (
    <Pressable style={[styles.btn, style]} onPress={onPress} disabled={loading} hitSlop={6}>
      {loading ? (
        <ActivityIndicator size="small" color={colors.primary} />
      ) : (
        <Ionicons name={icon} size={22} color={colors.primary} />
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
    shadowColor: colors.shadow,
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
});
