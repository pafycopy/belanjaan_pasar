import { Image, ImageSourcePropType, StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, radius } from "@/theme";

type Props = {
  gambar?: ImageSourcePropType;
  style?: StyleProp<ViewStyle>;  // ukuran/bentuk dari luar, mis. aspectRatio, borderRadius, height
  fit?: "cover" | "contain";     // cover = penuhi kotak (tepi dipotong), contain = tampil utuh
};

// Foto produk dalam kotak berukuran tetap; bila belum ada tampilkan placeholder
export default function GambarProduk({ gambar, style, fit = "cover" }: Props) {
  return (
    <View style={[styles.kotak, style]}>
      {gambar ? (
        <Image source={gambar} style={StyleSheet.absoluteFill} resizeMode={fit} />
      ) : (
        <Ionicons name="image-outline" size={32} color={colors.placeholder} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  kotak: {
    width: "100%",
    aspectRatio: 1,          // bawaan persegi; timpa lewat `style` kalau card butuh bentuk lain
    overflow: "hidden",      // memotong gambar sesuai sudut membulat
    borderRadius: radius.sm,
    backgroundColor: colors.fieldBg,
    alignItems: "center",
    justifyContent: "center",
  },
});