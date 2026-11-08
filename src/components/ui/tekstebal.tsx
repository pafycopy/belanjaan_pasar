import { StyleProp, Text, TextStyle } from "react-native";
import { pecahTebal } from "@/utils/pembayaran";

type Props = {
  teks: string;                 // bagian di antara ** ** dicetak tebal
  style?: StyleProp<TextStyle>;
  warnaTebal?: string;          // warna khusus untuk bagian tebal
};

// Teks dengan sebagian kata tebal, tanpa perlu memecah <Text> manual di tiap layar
export default function TeksTebal({ teks, style, warnaTebal }: Props) {
  return (
    <Text style={style}>
      {pecahTebal(teks).map((p, i) =>
        p.tebal ? (
          <Text key={i} style={[{ fontWeight: "700" }, warnaTebal ? { color: warnaTebal } : null]}>
            {p.teks}
          </Text>
        ) : (
          p.teks
        )
      )}
    </Text>
  );
}
