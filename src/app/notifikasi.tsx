import { View, Text } from "react-native";
import { Stack } from "expo-router";

export default function Notifikasi() {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Stack.Screen options={{ headerShown: true, title: "Notifikasi" }} />
      <Text>Halaman Notifikasi</Text>
    </View>
  );
}