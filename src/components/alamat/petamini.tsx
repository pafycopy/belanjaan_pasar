import { Pressable, StyleSheet, Text, View } from "react-native";
import MapView from "react-native-maps";
import { Ionicons } from "@expo/vector-icons";
import { colors, radius, spacing } from "@/theme";
import { TEKS } from "@/data/teks";
import { ZOOM_DELTA } from "@/services/lokasi";
import PinMarker from "@/components/alamat/pinmarker";

type Props = {
  latitude: number;
  longitude: number;
  onPress: () => void; // ketuk kotak: buka layar peta untuk memindahkan titik
};

// Pratinjau peta kecil di formulir. Tidak bisa digeser; ketuk untuk membuka layar peta penuh.
export default function PetaMini({ latitude, longitude, onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={TEKS.detail.ubahTitik}
      style={styles.kotak}
    >
      {/* Dibungkus agar sentuhan sampai ke Pressable, bukan ditelan peta */}
      <View pointerEvents="none" style={StyleSheet.absoluteFill}>
        <MapView
          key={`${latitude},${longitude}`}
          style={StyleSheet.absoluteFill}
          initialRegion={{
            latitude,
            longitude,
            latitudeDelta: ZOOM_DELTA,
            longitudeDelta: ZOOM_DELTA,
          }}
          scrollEnabled={false}
          zoomEnabled={false}
          rotateEnabled={false}
          pitchEnabled={false}
          toolbarEnabled={false}
          liteMode
        />
      </View>

      <PinMarker />

      <View style={styles.pill}>
        <Ionicons name="locate" size={14} color={colors.dark} />
        <Text style={styles.pillText}>{TEKS.detail.ubahTitik}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  kotak: {
    height: 150,
    borderRadius: radius.lg,
    overflow: "hidden",
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  pill: {
    position: "absolute",
    right: spacing.sm,
    bottom: spacing.sm,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  pillText: { fontSize: 11, fontWeight: "700", color: colors.dark },
});
