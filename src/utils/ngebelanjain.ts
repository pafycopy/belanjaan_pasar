import { BATAS_BAYAR_MENIT } from "@/data/pembayaran";
import { ESTIMASI_SELESAI_CONTOH, TAGIHAN_CONTOH } from "@/data/ngebelanjain";
import { IdPengiriman } from "@/data/keranjang";
import { MetodeNgebelanjain, PesananNgebelanjain, TagihanNgebelanjain } from "@/types/ngebelanjain";

export type BarisDaftar = { nama: string; jumlah: string; teks: string };

// "Cabai rawit merah - 500 gram" -> nama "Cabai rawit merah", jumlah "500 gram".
// Pemisah (-, – atau —) harus dikelilingi spasi; baris tanpa pemisah dianggap nama saja.
export function pecahDaftar(daftar: string): BarisDaftar[] {
  return daftar
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0)
    .map((teks) => {
      const m = teks.match(/^(.*\S)\s+[-\u2013\u2014]\s+(.+)$/);
      return m ? { nama: m[1], jumlah: m[2], teks } : { nama: teks, jumlah: "", teks };
    });
}

// "BP-1", "BP-2", ... (nomor tertinggi yang ada + 1)
export function nomorBerikutnya(daftar: readonly PesananNgebelanjain[]): string {
  const maks = daftar.reduce((m, p) => Math.max(m, parseInt(p.nomor.replace(/\D/g, ""), 10) || 0), 0);
  return `BP-${maks + 1}`;
}

type BahanPesanan = {
  daftar: string;
  pengiriman: IdPengiriman;
  alamat?: string;
  sebelumnya: readonly PesananNgebelanjain[];
  sekarang?: number;
};

// Permintaan baru langsung berstatus "diproses" (menunggu diterima admin)
export function buatPesananNgebelanjain(b: BahanPesanan): PesananNgebelanjain {
  return {
    nomor: nomorBerikutnya(b.sebelumnya),
    status: "diproses",
    daftar: pecahDaftar(b.daftar).map((x) => x.teks).join("\n"),
    pengiriman: b.pengiriman,
    alamat: b.pengiriman === "antar" ? b.alamat : undefined,
    dibuatPada: b.sekarang ?? Date.now(),
  };
}

export function hitungTagihan(totalProduk: number, jasaHelper: number, ongkir: number): TagihanNgebelanjain {
  return { totalProduk, jasaHelper, ongkir, total: totalProduk + jasaHelper + ongkir };
}

// Pelanggan memilih cara bayar. QRIS punya batas waktu; COD tidak.
export function pilihMetode(p: PesananNgebelanjain, metode: MetodeNgebelanjain, sekarang: number = Date.now()): PesananNgebelanjain {
  return { ...p, metode, batasBayar: metode === "qris" ? sekarang + BATAS_BAYAR_MENIT * 60_000 : undefined };
}

// Pelanggan kembali memilih metode (atau waktu QRIS habis)
export function batalkanMetode(p: PesananNgebelanjain): PesananNgebelanjain {
  return { ...p, metode: undefined, batasBayar: undefined };
}

// Hanya untuk simulasi di mode pengembangan. Aslinya: admin yang menerima pesanan, mengisi tagihan
// setelah belanja selesai, dan memastikan pembayaran masuk.
export function majukanNgebelanjain(p: PesananNgebelanjain, sekarang: number = Date.now()): PesananNgebelanjain {
  switch (p.status) {
    case "diproses":
      return { ...p, status: "dibelanjain", estimasiSelesai: ESTIMASI_SELESAI_CONTOH };
    case "dibelanjain":
      return {
        ...p,
        status: "pembayaran",
        tagihan: hitungTagihan(
          TAGIHAN_CONTOH.totalProduk,
          TAGIHAN_CONTOH.jasaHelper,
          p.pengiriman === "antar" ? TAGIHAN_CONTOH.ongkir : 0
        ),
      };
    case "pembayaran":
      return { ...p, status: "dibayar", metode: p.metode ?? "qris", batasBayar: undefined, dibayarPada: sekarang };
    default:
      return p;
  }
}
