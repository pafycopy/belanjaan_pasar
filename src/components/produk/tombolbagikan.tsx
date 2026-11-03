import { Pressable, Share } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/theme";
import { TEKS } from "@/data/teks";
import { Produk } from "@/types/produk";
import { formatHarga } from "@/utils/produk";

// Ikon bagikan di kanan header: membuka menu bagikan bawaan HP
export default function TombolBagikan({ produk }: { produk: Produk }) {
  const bagikan = () => {
    void Share.share({ message: TEKS.produk.bagikan(produk.nama, formatHarga(produk.harga)) });
  };

  return (
    <Pressable onPress={bagikan} hitSlop={12}>
      <Ionicons name="share-social" size={22} color={colors.white} />
    </Pressable>
  );
}
