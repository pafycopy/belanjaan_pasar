import { Alert } from "react-native";
import { useRouter } from "expo-router";
import { useKeranjang } from "@/context/keranjang";
import { TEKS } from "@/data/teks";
import { Produk } from "@/types/produk";

const T = TEKS.produk.keranjang;

/**
 * Tambah 1 produk ke keranjang langsung dari daftar (tanpa membuka detail).
 */
export function useTambahCepat() {
  const router = useRouter();
  const { tambah } = useKeranjang();

  return async (produk: Produk) => {
    try {
      await tambah({
        produkId: produk.id,
        jumlah: 1,
        hargaSatuan: produk.harga,
      });
      Alert.alert(T.berhasil.judul, T.berhasil.pesan(produk.nama, 1), [
        { text: T.berhasil.lanjut, style: "cancel" },
        { text: T.berhasil.lihat, onPress: () => router.push("/keranjang") },
      ]);
    } catch {
      Alert.alert(T.gagal.judul, T.gagal.pesan);
    }
  };
}
