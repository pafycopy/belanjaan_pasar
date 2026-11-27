import { Stack } from "expo-router";
import { AlamatProvider } from "@/context/alamat";
import { FavoritProvider } from "@/context/favorit";
import { KeranjangProvider } from "@/context/keranjang";
import { NgebelanjainProvider } from "@/context/ngebelanjain";
import { PesananProvider } from "@/context/pesanan";
import { PenilaianProvider } from "@/context/penilaian";
import { PoinProvider } from "@/context/poin";
import { ProfilProvider } from "@/context/profil";
import { VoucherProvider } from "@/context/voucher";

export default function RootLayout() {
  return (
    <AlamatProvider>
      <ProfilProvider>
        <PoinProvider>
          <VoucherProvider>
            <KeranjangProvider>
              <FavoritProvider>
                <PesananProvider>
                  <PenilaianProvider>
                    <NgebelanjainProvider>
                      <Stack screenOptions={{ headerShown: false }} />
                    </NgebelanjainProvider>
                  </PenilaianProvider>
                </PesananProvider>
              </FavoritProvider>
            </KeranjangProvider>
          </VoucherProvider>
        </PoinProvider>
      </ProfilProvider>
    </AlamatProvider>
  );
}
