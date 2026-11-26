import { STATUS_RIWAYAT } from "@/data/riwayat";
import { TEKS } from "@/data/teks";
import { Pesanan } from "@/types/pesanan";
import { kunciBulanWib } from "@/utils/waktu";

export type KunciBulan = string; // "2026-11"

const masukRiwayat = (p: Pesanan) => STATUS_RIWAYAT.includes(p.status);

// Waktu yang dipakai untuk mengelompokkan: saat diterima, atau saat dibayar bila belum tercatat
export function waktuTransaksi(p: Pesanan): number {
  return p.diterimaPada ?? p.dibayarPada;
}

// Total jumlah barang pada pesanan ("Total 3 Belanjaan")
export function jumlahBarang(p: Pesanan): number {
  return p.baris.reduce((total, b) => total + b.jumlah, 0);
}

// Produk pertama untuk kartu: nama, jumlah, dan keterangan ("Potong 4 • +2 produk lainnya")
export function ringkasRiwayat(p: Pesanan): { nama: string; jumlah: number; keterangan: string } {
  const [pertama, ...lain] = p.baris;
  if (!pertama) return { nama: "-", jumlah: 0, keterangan: "" };
  const keterangan = [pertama.catatan ? `Catatan: ${pertama.catatan}` : undefined, lain.length > 0 ? TEKS.pesanan.produkLain(lain.length) : undefined]
    .filter((x): x is string => !!x)
    .join(" \u2022 ");
  return { nama: pertama.nama, jumlah: pertama.jumlah, keterangan };
}

// Bulan-bulan yang punya transaksi, terbaru lebih dulu
export function daftarBulan(daftar: readonly Pesanan[]): KunciBulan[] {
  const kunci = new Set(daftar.filter(masukRiwayat).map((p) => kunciBulanWib(waktuTransaksi(p))));
  return [...kunci].sort().reverse();
}

// Pilihan bulan yang berlaku. `undefined` = belum dipilih user: bulan ini bila ada transaksinya, selain itu semua waktu.
export function bulanEfektif(
  pilihan: KunciBulan | null | undefined,
  daftar: readonly Pesanan[],
  sekarang: number
): KunciBulan | null {
  if (pilihan !== undefined) return pilihan;
  const bulanIni = kunciBulanWib(sekarang);
  return daftarBulan(daftar).includes(bulanIni) ? bulanIni : null;
}

// Transaksi yang masuk riwayat, disaring bulan (null = semua) dan kata kunci (no. pesanan / nama produk), terbaru dulu
export function saringRiwayat(
  daftar: readonly Pesanan[],
  opsi: { cari: string; bulan: KunciBulan | null }
): Pesanan[] {
  const q = opsi.cari.trim().toLowerCase().replace(/^#/, "");
  return daftar
    .filter((p) => {
      if (!masukRiwayat(p)) return false;
      if (opsi.bulan !== null && kunciBulanWib(waktuTransaksi(p)) !== opsi.bulan) return false;
      if (!q) return true;
      return p.invoice.toLowerCase().includes(q) || p.baris.some((b) => b.nama.toLowerCase().includes(q));
    })
    .sort((a, b) => waktuTransaksi(b) - waktuTransaksi(a));
}
