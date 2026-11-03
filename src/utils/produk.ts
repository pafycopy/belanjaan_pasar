import { DAFTAR_PRODUK } from "@/data/produk";
import { Produk } from "@/types/produk";
import { formatRibuan } from "@/utils/angka";

// 39000 -> "Rp 39.000"
export function formatHarga(harga: number): string {
  return `Rp ${formatRibuan(harga)}`;
}

export function cariProduk(id?: string): Produk | undefined {
  return id ? DAFTAR_PRODUK.find((p) => p.id === id) : undefined;
}

export function hitungSubtotal(harga: number, jumlah: number): number {
  return harga * jumlah;
}

// "ekor" -> "Ekor"
export function kapital(teks: string): string {
  return teks.charAt(0).toUpperCase() + teks.slice(1);
}
