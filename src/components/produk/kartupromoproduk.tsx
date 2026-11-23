import KartuProduk from "@/components/produk/kartuproduk";
import { Produk } from "@/types/produk";

type Props = {
  produk: Produk;
  favorit: boolean;
  onPress: () => void;
  onToggleFavorit: () => void;
};

/** Wrapper agar kartu Promo Hari Ini di Beranda memakai desain katalog yang sama. */
export default function KartuPromoProduk({ produk, favorit, onPress, onToggleFavorit }: Props) {
  return (
    <KartuProduk
      produk={produk}
      style={{ width: 190, marginBottom: 0 }}
      favorit={favorit}
      onPress={onPress}
      onToggleFavorit={onToggleFavorit}
    />
  );
}
