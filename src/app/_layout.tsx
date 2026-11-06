import { Stack } from "expo-router";
import { AlamatProvider } from "@/context/alamat";
import { FavoritProvider } from "@/context/favorit";
import { KeranjangProvider } from "@/context/keranjang";
import { PoinProvider } from "@/context/poin";
import { VoucherProvider } from "@/context/voucher";

export default function RootLayout() {
  return (
    <AlamatProvider>
      <PoinProvider>
        <VoucherProvider>
          <KeranjangProvider>
            <FavoritProvider>
              <Stack screenOptions={{ headerShown: false }} />
            </FavoritProvider>
          </KeranjangProvider>
        </VoucherProvider>
      </PoinProvider>
    </AlamatProvider>
  );
}
