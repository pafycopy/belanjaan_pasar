import { StyleSheet, View } from "react-native";
import { Text } from "react-native";
import { colors } from "@/theme";
import { formatRibuan } from "@/utils/angka";

type Props = {
  nilai: number;
  ukuran?: number;  // ukuran angka; "Rp" otomatis lebih kecil
  warna?: string;
};

// Nominal rupiah: "Rp" kecil dan satu garis dasar dengan angka, selalu satu baris
export default function Nominal({ nilai, ukuran = 20, warna = colors.text }: Props) {
  return (
    <View style={styles.baris} accessible accessibilityLabel={`Rp ${formatRibuan(nilai)}`}>
      <Text style={{ fontSize: Math.round(ukuran * 0.62), fontWeight: "700", color: warna }}>Rp</Text>
      <Text
        style={{ flexShrink: 1, fontSize: ukuran, fontWeight: "800", color: warna, fontVariant: ["tabular-nums"] }}
        numberOfLines={1}
      >
        {formatRibuan(nilai)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  baris: { flexDirection: "row", alignItems: "baseline", gap: 3 },
});
