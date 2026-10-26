import { Stack } from "expo-router";
import { AlamatProvider } from "@/context/alamat";

export default function RootLayout() {
  return (
    <AlamatProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </AlamatProvider>
  );
}