import { RENTANG_PRODUK_TERLARIS_HARI } from "@/data/terlaris";
import { Pesanan } from "@/types/pesanan";
import { Produk } from "@/types/produk";

const MILIDETIK_PER_HARI = 24 * 60 * 60 * 1000;

/**
 * Mengurutkan seluruh katalog berdasarkan total unit yang dibeli
 * dari transaksi berstatus pembayaran berhasil dalam periode yang ditentukan.
 *
 * Produk yang belum pernah dibeli tetap disertakan dan mempertahankan
 * urutan katalog aslinya jika jumlah penjualannya sama.
 */
export function urutkanProdukTerlaris(
  produk: readonly Produk[],
  pesanan: readonly Pesanan[],
  sekarang: number = Date.now()
): Produk[] {
  const batasWaktu =
    sekarang - RENTANG_PRODUK_TERLARIS_HARI * MILIDETIK_PER_HARI;

  const jumlahTerjual = new Map<string, number>();

  for (const transaksi of pesanan) {
    const waktuPembayaran = transaksi.dibayarPada;

    if (
      !Number.isFinite(waktuPembayaran) ||
      waktuPembayaran < batasWaktu ||
      waktuPembayaran > sekarang
    ) {
      continue;
    }

    for (const baris of transaksi.baris) {
      if (
        !baris.produkId ||
        !Number.isFinite(baris.jumlah) ||
        baris.jumlah <= 0
      ) {
        continue;
      }

      const jumlahSebelumnya = jumlahTerjual.get(baris.produkId) ?? 0;
      jumlahTerjual.set(baris.produkId, jumlahSebelumnya + baris.jumlah);
    }
  }

  return produk
    .map((item, indeksAsli) => ({
      item,
      indeksAsli,
      jumlahTerjual: jumlahTerjual.get(item.id) ?? 0,
    }))
    .sort(
      (a, b) =>
        b.jumlahTerjual - a.jumlahTerjual ||
        a.indeksAsli - b.indeksAsli
    )
    .map(({ item }) => item);
}
