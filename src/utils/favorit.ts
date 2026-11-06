import { FILTER_FAVORIT_SEMUA } from "@/data/favorit";
import { Produk } from "@/types/produk";

// Daftar id favorit -> produk di katalog (id yang sudah tidak ada di katalog dilewati)
export function produkDariIds(ids: readonly string[], katalog: readonly Produk[]): Produk[] {
  return ids.flatMap((id) => {
    const produk = katalog.find((p) => p.id === id);
    return produk ? [produk] : [];
  });
}

// Saring berdasarkan kata pencarian (nama) dan filter (Produk.tag)
export function saringFavorit(produk: readonly Produk[], cari: string, filterId: string): Produk[] {
  const kata = cari.trim().toLowerCase();
  return produk.filter(
    (p) =>
      p.nama.toLowerCase().includes(kata) &&
      (filterId === FILTER_FAVORIT_SEMUA || (p.tag ?? []).includes(filterId))
  );
}
