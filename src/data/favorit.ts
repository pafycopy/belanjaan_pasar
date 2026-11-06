import { ChipItem } from "@/components/ui/chipgroup";

export const FILTER_FAVORIT_SEMUA = "semua";

// Chip filter di halaman Favorit. `id` selain "semua" dicocokkan dengan Produk.tag
export const FILTER_FAVORIT: readonly ChipItem[] = [
  { id: FILTER_FAVORIT_SEMUA, label: "Semua" },
  { id: "promo", label: "PROMO" },
  { id: "ayam-bebek", label: "Ayam & Bebek Potong" },
  { id: "partingan", label: "Partingan" },
];
