import { Alert } from "react-native";
import { useRouter } from "expo-router";
import { useKeranjang } from "@/context/keranjang";
import { TEKS } from "@/data/teks";
import { Pesanan } from "@/types/pesanan";
import { cariProduk } from "@/utils/produk";

const T = TEKS.pesanan.gagalUlang;

/**
 * "Pesan Ulang": masukkan lagi semua produk sebuah pesanan ke keranjang (harga terbaru, potongan
 * dan catatan sama), lalu buka keranjang. Produk yang sudah tidak ada dilewati.
 */
export function usePesanUlang() {
  const router = useRouter();
  const { tambah } = useKeranjang();

  return async (p: Pesanan) => {
    let masuk = 0;
    try {
      for (const b of p.baris) {
        const produk = cariProduk(b.produkId);
        if (!produk) continue;
        await tambah({
          produkId: b.produkId,
          jumlah: b.jumlah,
          hargaSatuan: produk.harga,
          potonganId: b.potonganId,
          catatan: b.catatan,
        });
        masuk += 1;
      }
    } catch {
      masuk = 0;
    }
    if (masuk === 0) {
      Alert.alert(T.judul, T.pesan);
      return;
    }
    router.push("/keranjang");
  };
}
