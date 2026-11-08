import { DAFTAR_PRODUK, KATEGORI_PRODUK_SEMUA } from "@/data/produk";
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

// Saring berdasarkan kata pencarian (nama) dan kategori (Produk.tag)
export function saringProduk(produk: readonly Produk[], cari: string, kategoriId: string): Produk[] {
  const kata = cari.trim().toLowerCase();
  return produk.filter(
    (p) =>
      p.nama.toLowerCase().includes(kata) &&
      (kategoriId === KATEGORI_PRODUK_SEMUA || (p.tag ?? []).includes(kategoriId))
  );
}
