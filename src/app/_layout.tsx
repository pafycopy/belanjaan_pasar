import { Stack } from "expo-router";
import { AlamatProvider } from "@/context/alamat";
import { KeranjangProvider } from "@/context/keranjang";
import { PoinProvider } from "@/context/poin";
import { VoucherProvider } from "@/context/voucher";

export default function RootLayout() {
  return (
    <AlamatProvider>
      <PoinProvider>
        <VoucherProvider>
          <KeranjangProvider>
            <Stack screenOptions={{ headerShown: false }} />
          </KeranjangProvider>
        </VoucherProvider>
      </PoinProvider>
    </AlamatProvider>
  );
}
