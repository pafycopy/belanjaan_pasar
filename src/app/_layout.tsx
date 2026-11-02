import { Stack } from "expo-router";
import { AlamatProvider } from "@/context/alamat";
import { PoinProvider } from "@/context/poin";

export default function RootLayout() {
  return (
    <AlamatProvider>
      <PoinProvider>
        <Stack screenOptions={{ headerShown: false }} />
      </PoinProvider>
    </AlamatProvider>
  );
}
