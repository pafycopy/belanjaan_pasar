import { StyleSheet, View } from "react-native";
import { Image, ImageSource } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/theme";

type Props = { gambar?: ImageSource | number };

// Ilustrasi layar kosong. Tanpa `gambar`, tampil gambar sementara dari ikon (keranjang belanja + daftar).
export default function IlustrasiKosong({ gambar }: Props) {
  if (gambar) {
    return <Image source={gambar} style={styles.gambar} contentFit="contain" />;
  }
  return (
    <View style={styles.lingkaran} accessible accessibilityRole="image" accessibilityLabel="Keranjang belanja kosong">
      <Ionicons name="leaf" size={22} color={colors.primary} style={styles.daun} />
      <Ionicons name="basket" size={96} color={colors.dark} />
      <View style={styles.daftar}>
        <Ionicons name="clipboard-outline" size={26} color={colors.dark} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  gambar: { width: 240, height: 200 },
  lingkaran: {
    width: 190,
    height: 190,
    borderRadius: 95,
    backgroundColor: colors.primarySoft,
    alignItems: "center",
    justifyContent: "center",
  },
  daun: { position: "absolute", top: 26, left: 36 },
  daftar: {
    position: "absolute",
    right: 14,
    bottom: 22,
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
  },
});
