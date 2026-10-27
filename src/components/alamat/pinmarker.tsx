import { StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/theme";

const UKURAN = 44;

// Pin tetap di tengah peta; user menggeser peta, bukan pin-nya
export default function PinMarker() {
  return (
    <View pointerEvents="none" style={styles.wrap}>
      <Ionicons name="location" size={UKURAN} color={colors.primary} style={styles.ikon} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  // naikkan setengah tinggi total supaya ujung bawah pin tepat di titik tengah peta
  ikon: { marginBottom: UKURAN },
});
