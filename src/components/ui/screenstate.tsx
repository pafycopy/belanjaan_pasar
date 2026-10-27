import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { colors, spacing } from "@/theme";

type Props = { loading?: boolean; message?: string };

// Layar pengisi: sedang memuat, atau pesan di tengah (data tidak ditemukan, dst.)
export default function ScreenState({ loading, message }: Props) {
  return (
    <View style={styles.center}>
      {loading ? <ActivityIndicator color={colors.primary} /> : null}
      {message ? <Text style={styles.message}>{message}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: "center", justifyContent: "center", padding: spacing.xl },
  message: { color: colors.muted, textAlign: "center" },
});
