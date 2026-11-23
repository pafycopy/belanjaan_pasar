import { Transaksi } from "@/types/transaksi";
import { kunciBulanWib } from "@/utils/waktu";

export type KunciBulanTransaksi = string;

export function daftarBulanTransaksi(daftar: readonly Transaksi[]): KunciBulanTransaksi[] {
  return [...new Set(daftar.map((t) => kunciBulanWib(t.dibuatLogPada)))].sort().reverse();
}

export function saringTransaksi(
  daftar: readonly Transaksi[],
  opsi: { cari: string; bulan: KunciBulanTransaksi | null }
): Transaksi[] {
  const q = opsi.cari.trim().toLowerCase().replace(/^#/, "");
  return daftar
    .filter((t) => {
      if (opsi.bulan && kunciBulanWib(t.dibuatLogPada) !== opsi.bulan) return false;
      if (!q) return true;
      return t.invoice.toLowerCase().includes(q) || t.baris.some((b) => b.nama.toLowerCase().includes(q));
    })
    .sort((a, b) => b.dibuatLogPada - a.dibuatLogPada);
}
