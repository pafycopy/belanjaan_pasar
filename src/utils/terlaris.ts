import { RENTANG_PRODUK_TERLARIS_HARI } from "@/data/terlaris";
import { Pesanan } from "@/types/pesanan";
import { Produk } from "@/types/produk";

const MILIDETIK_PER_HARI = 24 * 60 * 60 * 1000;
const SELISIH_WIB_MS = 7 * 60 * 60 * 1000;

/**
 * Total unit terjual per produk dari pesanan yang dibayar pada rentang [dari, sampai].
 * Baris yang datanya tidak valid dilewati.
 */
function hitungTerjual(
  pesanan: readonly Pesanan[],
  dari: number,
  sampai: number
): Map<string, number> {
  const jumlahTerjual = new Map<string, number>();

  for (const transaksi of pesanan) {
    const waktuPembayaran = transaksi.dibayarPada;

    if (!Number.isFinite(waktuPembayaran) || waktuPembayaran < dari || waktuPembayaran > sampai) {
      continue;
    }

    for (const baris of transaksi.baris) {
      if (!baris.produkId || !Number.isFinite(baris.jumlah) || baris.jumlah <= 0) {
        continue;
      }

      const jumlahSebelumnya = jumlahTerjual.get(baris.produkId) ?? 0;
      jumlahTerjual.set(baris.produkId, jumlahSebelumnya + baris.jumlah);
    }
  }

  return jumlahTerjual;
}

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
  const batasWaktu = sekarang - RENTANG_PRODUK_TERLARIS_HARI * MILIDETIK_PER_HARI;
  const jumlahTerjual = hitungTerjual(pesanan, batasWaktu, sekarang);

  return produk
    .map((item, indeksAsli) => ({
      item,
      indeksAsli,
      jumlahTerjual: jumlahTerjual.get(item.id) ?? 0,
    }))
    .sort((a, b) => b.jumlahTerjual - a.jumlahTerjual || a.indeksAsli - b.indeksAsli)
    .map(({ item }) => item);
}

// Awal hari ini (pukul 00.00 WIB) dalam milidetik
export function awalHariWIB(sekarang: number = Date.now()): number {
  return Math.floor((sekarang + SELISIH_WIB_MS) / MILIDETIK_PER_HARI) * MILIDETIK_PER_HARI - SELISIH_WIB_MS;
}

// Unit terjual per produk sejak pukul 00.00 WIB hari ini
export function hitungTerjualHariIni(
  pesanan: readonly Pesanan[],
  sekarang: number = Date.now()
): Map<string, number> {
  return hitungTerjual(pesanan, awalHariWIB(sekarang), sekarang);
}

// 3 -> "3", 357 -> "350+" (di bawah 10 tampil apa adanya, selebihnya dibulatkan ke bawah per 10)
export function formatJumlahTerjual(jumlah: number): string {
  return jumlah < 10 ? String(jumlah) : `${Math.floor(jumlah / 10) * 10}+`;
}
