import { IconName } from "@/types/ui";

// Batas berat bersih satu keranjang (kg). Nanti bisa datang dari pengaturan kios / backend.
export const KAPASITAS_KERANJANG_KG = 50;

export type IdPengiriman = "antar" | "ambil";

export const PENGIRIMAN_BAWAAN: IdPengiriman = "antar";

// Pilihan pengiriman: label dan ikon dari data
export const OPSI_PENGIRIMAN: readonly { id: IdPengiriman; label: string; icon: IconName }[] = [
  { id: "antar", label: "Antar ke Rumah", icon: "bicycle" },
  { id: "ambil", label: "Ambil di Toko", icon: "storefront-outline" },
];
