import { TarifOngkir, IdPengiriman, IdMetode } from "@/data/keranjang";
import { BATAS_BAYAR_MENIT } from "@/data/pembayaran";
import { BarisTagihan, TagihanTransfer } from "@/types/pembayaran";
import { BarisKeranjang, Tagihan } from "@/utils/keranjang";
import { formatHarga } from "@/utils/produk";
import { formatWaktuLengkapWib } from "@/utils/waktu";

// "SM-" + 5 digit. Sementara dibuat di HP; nanti nomor invoice dari server.
export function buatInvoice(sekarang: number = Date.now()): string {
  return `SM-${String(sekarang % 100000).padStart(5, "0")}`;
}

type BahanTagihan = {
  baris: readonly BarisKeranjang[];
  tagihan: Tagihan;
  tarif: TarifOngkir | null;   // null = ambil di toko
  pengiriman: IdPengiriman;
  metode: IdMetode;
  alamat?: string;
  sekarang?: number;
};

// Ubah isi keranjang + rincian biaya menjadi salinan tagihan yang disimpan
export function buatTagihanTransfer(b: BahanTagihan): TagihanTransfer {
  const sekarang = b.sekarang ?? Date.now();
  const baris: BarisTagihan[] = b.baris.map(({ item, produk }) => ({
    produkId: produk.id,
    nama: produk.nama,
    jumlah: item.jumlah,
    hargaSatuan: item.hargaSatuan,
    potongan: produk.opsiPotongan?.find((o) => o.id === item.potonganId)?.judul,
  }));

  return {
    invoice: buatInvoice(sekarang),
    metode: b.metode,
    dibuatPada: sekarang,
    batasBayar: sekarang + BATAS_BAYAR_MENIT * 60_000,
    baris,
    pengiriman: b.pengiriman,
    alamat: b.pengiriman === "antar" ? b.alamat : undefined,
    subtotal: b.tagihan.subtotal,
    ongkir: b.tarif ? b.tagihan.ongkir : null,
    labelOngkir: b.tarif?.label,
    total: b.tagihan.total,
  };
}

// Sisa waktu bayar dalam detik (tidak pernah negatif)
export function sisaDetik(batasBayar: number, sekarang: number): number {
  return Math.max(0, Math.ceil((batasBayar - sekarang) / 1000));
}

// 899 -> "14:59"
export function formatSisaWaktu(detik: number): string {
  const m = Math.floor(detik / 60);
  const s = detik % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export type PotonganTeks = { teks: string; tebal: boolean };

// "Buka **BCA mobile** dulu" -> [{Buka , false}, {BCA mobile, true}, { dulu, false}]
export function pecahTebal(teks: string): PotonganTeks[] {
  return teks
    .split("**")
    .map((bagian, i) => ({ teks: bagian, tebal: i % 2 === 1 }))
    .filter((p) => p.teks.length > 0);
}

// Pilihan potongan yang dipakai di pesanan, tanpa duplikat ("Potong 4" muncul sekali)
export function potonganUnik(baris: readonly BarisTagihan[]): string[] {
  return [...new Set(baris.map((b) => b.potongan).filter((p): p is string => !!p))];
}

type Rekening = { bank: string; nomor: string; namaAkun: string };

// Bukti pembayaran berbentuk teks, dibagikan lewat menu Bagikan bawaan HP
export function buatTeksBukti(t: TagihanTransfer, rek: Rekening): string {
  const baris = t.baris.map((b) => {
    const nama = b.potongan ? `${b.nama} (${b.potongan})` : b.nama;
    return `- ${nama}: ${b.jumlah} x ${formatHarga(b.hargaSatuan)} = ${formatHarga(b.hargaSatuan * b.jumlah)}`;
  });
  return [
    "BUKTI PEMBAYARAN - Belanjaan Pasar",
    `Invoice: #${t.invoice}`,
    `Waktu: ${formatWaktuLengkapWib(t.dibayarPada ?? t.dibuatPada)}`,
    `Transfer ke: ${rek.bank} ${rek.nomor} (${rek.namaAkun})`,
    "",
    "Pesanan:",
    ...baris,
    ...(t.ongkir !== null ? [`- Ongkos kurir${t.labelOngkir ? ` (${t.labelOngkir})` : ""}: ${formatHarga(t.ongkir)}`] : []),
    "",
    `Total: ${formatHarga(t.total)}`,
  ].join("\n");
}
