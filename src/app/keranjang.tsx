import { View, Text } from "react-native";
import { Stack } from "expo-router";

export default function Keranjang() {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Stack.Screen options={{ headerShown: true, title: "Keranjang" }} />
      <Text>Halaman Keranjang</Text>
    </View>
  );
}