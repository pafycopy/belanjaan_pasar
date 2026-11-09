import { StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/theme";

// Lingkaran centang hijau dengan halo lembut di sekelilingnya
export default function IkonBerhasil() {
  return (
    <View style={styles.luar} accessible accessibilityLabel="Berhasil">
      <View style={styles.tengah}>
        <View style={styles.inti}>
          <Ionicons name="checkmark" size={44} color={colors.white} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  luar: {
    width: 156,
    height: 156,
    borderRadius: 78,
    backgroundColor: colors.primarySoft,
    alignItems: "center",
    justifyContent: "center",
  },
  tengah: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.mintFade,
    alignItems: "center",
    justifyContent: "center",
  },
  inti: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: colors.dark,
    alignItems: "center",
    justifyContent: "center",
  },
});
