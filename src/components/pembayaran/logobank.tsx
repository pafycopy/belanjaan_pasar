import { StyleSheet, Text, View } from "react-native";
import { colors, radius } from "@/theme";

// Logo bank sementara (teks bergaya) sampai file logo SVG dipasang
export default function LogoBank({ bank }: { bank: string }) {
  return (
    <View style={styles.kotak}>
      <Text style={styles.teks}>{bank}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  kotak: {
    borderWidth: 1.5,
    borderColor: colors.brandBca,
    borderRadius: radius.sm,
    paddingHorizontal: 6,
    paddingVertical: 1,
  },
  teks: { fontSize: 13, fontWeight: "900", fontStyle: "italic", color: colors.brandBca },
});
