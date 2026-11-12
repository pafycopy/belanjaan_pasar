import { Image, Pressable, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/theme";

type Props = {
  fotoUri: string | null;
  size?: number;
  editable?: boolean;
  onPress?: () => void;
};

export default function FotoProfil({
  fotoUri,
  size = 64,
  editable = false,
  onPress,
}: Props) {
  const avatar = (
    <View style={[styles.avatar, { width: size, height: size, borderRadius: size / 2 }]}>
      {fotoUri ? (
        <Image source={{ uri: fotoUri }} style={styles.gambar} />
      ) : (
        <Ionicons name="person" size={size * 0.48} color={colors.dark} />
      )}
      {editable ? (
        <View style={[styles.badge, { width: size * 0.34, height: size * 0.34, borderRadius: size * 0.17 }]}>
          <Ionicons name="camera" size={size * 0.19} color={colors.white} />
        </View>
      ) : null}
    </View>
  );

  if (!onPress) return avatar;

  return (
    <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel="Ubah foto profil">
      {avatar}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  avatar: {
    backgroundColor: colors.primarySoft,
    alignItems: "center",
    justifyContent: "center",
    overflow: "visible",
  },
  gambar: {
    width: "100%",
    height: "100%",
    borderRadius: 999,
  },
  badge: {
    position: "absolute",
    right: -2,
    bottom: -2,
    backgroundColor: colors.dark,
    borderWidth: 2,
    borderColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
  },
});
