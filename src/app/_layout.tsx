import { Stack } from "expo-router";
import { AlamatProvider } from "@/context/alamat";
import { PoinProvider } from "@/context/poin";
import { VoucherProvider } from "@/context/voucher";

export default function RootLayout() {
  return (
    <AlamatProvider>
      <PoinProvider>
        <VoucherProvider>
          <Stack screenOptions={{ headerShown: false }} />
        </VoucherProvider>
      </PoinProvider>
    </AlamatProvider>
  );
}
