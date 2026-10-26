import { Stack } from "expo-router";
import { colors } from "@/theme";

export default function AlamatLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: colors.primary },
        headerTintColor: "#fff",
        headerTitleAlign: "center",
        headerTitleStyle: { fontSize: 14, fontWeight: "700" },
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen name="index" options={{ title: "Pilih Lokasi" }} />
      <Stack.Screen name="pinpoint" options={{ title: "Tentukan Pinpoint" }} />
      <Stack.Screen name="detail" options={{ title: "Detail Penerima" }} />
    </Stack>
  );
}