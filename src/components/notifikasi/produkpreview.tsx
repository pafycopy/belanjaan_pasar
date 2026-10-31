import { Pressable, StyleSheet, Text, View } from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { colors, radius, spacing } from "@/theme";
import { TEKS } from "@/data/teks";
import { ProdukNotifikasi } from "@/types/notifikasi";

type Props = {
  produk: ProdukNotifikasi;
  onPress?: () => void;
};

export default function ProdukPreview({
  produk,
  onPress,
}: Props) {
  return (
    <Pressable
      style={styles.box}
      onPress={onPress}
      disabled={!onPress}
    >
      {produk.gambarUri ? (
        <Image
          source={{ uri: produk.gambarUri }}
          style={styles.foto}
          contentFit="cover"
        />
      ) : (
        <View
          style={[
            styles.foto,
            styles.placeholder,
          ]}
        >
          <Ionicons
            name="image-outline"
            size={22}
            color={colors.placeholder}
          />
        </View>
      )}

      <View style={styles.teks}>
        <Text
          style={styles.nama}
          numberOfLines={2}
        >
          {produk.nama}
        </Text>

        <Text style={styles.detail}>
          {TEKS.notifikasi.timbanganBersih}{" "}
          {produk.timbangan}
        </Text>

        <Text style={styles.detail}>
          {produk.ringkasan}
        </Text>
      </View>

      {onPress ? (
        <Ionicons
          name="chevron-forward"
          size={18}
          color={colors.muted}
        />
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  box: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    padding: spacing.sm,
    marginTop: spacing.md,
    borderRadius: radius.lg,
    backgroundColor: colors.accentSoft,
  },

  foto: {
    width: 64,
    height: 64,
    borderRadius: radius.sm,
  },

  placeholder: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.border,
  },

  teks: {
    flex: 1,
    gap: 2,
  },

  nama: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.text,
  },

  detail: {
    fontSize: 12,
    color: colors.textSoft,
  },
});