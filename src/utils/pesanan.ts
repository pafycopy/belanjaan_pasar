import { JADWAL_PEMOTONGAN } from "@/data/pembayaran";
import { ESTIMASI_TIBA_CONTOH, LABEL_METODE_PESANAN, TITIK_ANTAR_CONTOH } from "@/data/pesanan";
import { TEKS } from "@/data/teks";
import { TagihanTransfer } from "@/types/pembayaran";
import { Pesanan, StatusPesanan } from "@/types/pesanan";
import { cariProduk } from "@/utils/produk";
import {
  bagianHariWib,
  berikutnyaJamWib,
  formatJamWib,
  formatTanggalJamWib,
  labelHariWib,
} from "@/utils/waktu";

const T = TEKS.pesanan;

// Tagihan yang sudah dinyatakan lunas -> pesanan baru berstatus "disiapkan"
export function buatPesanan(t: TagihanTransfer): Pesanan {
  return {
    invoice: t.invoice,
    metode: t.metode,
    dibuatPada: t.dibuatPada,
    dibayarPada: t.dibayarPada ?? Date.now(),
    baris: t.baris,
    pengiriman: t.pengiriman,
    alamat: t.alamat,
    subtotal: t.subtotal,
    ongkir: t.ongkir,
    labelOngkir: t.labelOngkir,
    total: t.total,
    status: "disiapkan",
    titikAntar: t.pengiriman === "antar" ? TITIK_ANTAR_CONTOH : undefined,
  };
}

// Tahap berikutnya; pesanan ambil di toko tidak melewati "dikirim"
export function statusBerikutnya(p: Pesanan): StatusPesanan | null {
  if (p.status === "disiapkan") return p.pengiriman === "antar" ? "dikirim" : "selesai";
  if (p.status === "dikirim") return "selesai";
  return null;
}

// Hanya dipakai simulasi di mode pengembangan (tahan lama pada label status di kartu)
export function majukanStatus(p: Pesanan, sekarang: number = Date.now()): Pesanan {
  const berikut = statusBerikutnya(p);
  if (!berikut) return p;
  if (berikut === "dikirim") return { ...p, status: berikut, estimasiTiba: ESTIMASI_TIBA_CONTOH };
  return { ...p, status: berikut, diterimaPada: sekarang };
}

// Label + nilai waktu di pojok kanan atas kartu, tergantung status
export function infoWaktu(p: Pesanan, sekarang: number = Date.now()): { label: string; nilai: string } {
  if (p.status === "disiapkan") {
    const t = berikutnyaJamWib(p.dibayarPada, JADWAL_PEMOTONGAN.mulai.jam, JADWAL_PEMOTONGAN.mulai.menit);
    return { label: T.jadwal, nilai: `${labelHariWib(t, sekarang)} ${formatJamWib(t)} WIB` };
  }
  if (p.status === "dikirim") {
    return { label: T.estTiba, nilai: p.estimasiTiba ?? "-" };
  }
  const t = p.diterimaPada ?? p.dibayarPada;
  return { label: T.diterima(bagianHariWib(t)), nilai: formatTanggalJamWib(t) };
}

// "Transfer BCA • Lunas"
export function labelPembayaran(p: Pesanan): string {
  const nama = LABEL_METODE_PESANAN[p.metode];
  const ket = p.metode === "cod" ? (p.status === "selesai" ? T.selesaiBayar : T.bayarSaatTiba) : T.lunas;
  return T.labelBayar(nama, ket);
}

// Baris produk di kartu: produk pertama + jumlah, sisanya diringkas "+N produk lainnya"
export function ringkasanProduk(p: Pesanan): { nama: string; deskripsi: string } {
  const [pertama, ...lain] = p.baris;
  if (!pertama) return { nama: "-", deskripsi: "" };
  const satuan = cariProduk(pertama.produkId)?.satuan;
  const bagian = [
    `${pertama.jumlah}${satuan ? ` ${satuan}` : ""}`,
    pertama.potongan,
    lain.length > 0 ? T.produkLain(lain.length) : undefined,
  ].filter((x): x is string => !!x);
  return { nama: pertama.nama, deskripsi: bagian.join(" \u2022 ") };
}

// Saring per tab status, lalu per kata kunci (no. pesanan atau nama produk)
export function saringPesanan(daftar: readonly Pesanan[], status: StatusPesanan, cari: string): Pesanan[] {
  const q = cari.trim().toLowerCase().replace(/^#/, "");
  return daftar.filter((p) => {
    if (p.status !== status) return false;
    if (!q) return true;
    return p.invoice.toLowerCase().includes(q) || p.baris.some((b) => b.nama.toLowerCase().includes(q));
  });
}
