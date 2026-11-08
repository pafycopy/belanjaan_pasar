import { ItemKeranjang, ItemKeranjangInput } from "@/types/keranjang";
import { TARIF_ONGKIR, TarifOngkir } from "@/data/keranjang";
import { Produk } from "@/types/produk";

// Dua item dianggap sama bila produk, potongan, dan catatannya sama
export function kunciItem(i: ItemKeranjangInput): string {
  return [i.produkId, i.potonganId ?? "", (i.catatan ?? "").trim().toLowerCase()].join("|");
}

// Item yang sama digabung jumlahnya; selain itu menjadi baris baru
export function gabungkanItem(
  daftar: ItemKeranjang[],
  input: ItemKeranjangInput,
  uidBaru: string
): ItemKeranjang[] {
  const kunci = kunciItem(input);
  const ada = daftar.find((i) => kunciItem(i) === kunci);
  if (!ada) return [...daftar, { ...input, uid: uidBaru }];
  return daftar.map((i) =>
    i.uid === ada.uid ? { ...i, jumlah: i.jumlah + input.jumlah, hargaSatuan: input.hargaSatuan } : i
  );
}

export type BarisKeranjang = { item: ItemKeranjang; produk: Produk };

// Pasangkan item keranjang dengan data produknya (item yang produknya sudah tidak ada dilewati)
export function barisDenganProduk(
  daftar: readonly ItemKeranjang[],
  cari: (produkId: string) => Produk | undefined
): BarisKeranjang[] {
  return daftar.flatMap((item) => {
    const produk = cari(item.produkId);
    return produk ? [{ item, produk }] : [];
  });
}

export function hitungBeratGram(baris: readonly BarisKeranjang[]): number {
  return baris.reduce((total, { item, produk }) => total + (produk.beratBersihGram ?? 0) * item.jumlah, 0);
}

// 1.0 -> "1", 12.5 -> "12.5"
export function formatKg(kg: number): string {
  const teks = kg.toFixed(1);
  return teks.endsWith(".0") ? teks.slice(0, -2) : teks;
}

// Tarif ongkir menurut jarak. Jarak belum diketahui / melebihi semua tingkatan -> tingkatan terakhir.
export function cariTarifOngkir(jarakKm?: number): TarifOngkir {
  const tarif = jarakKm === undefined ? undefined : TARIF_ONGKIR.find((t) => jarakKm <= t.sampaiKm);
  return tarif ?? TARIF_ONGKIR[TARIF_ONGKIR.length - 1];
}

export type Tagihan = { subtotal: number; ongkir: number; total: number };

// ongkir = null untuk "Ambil di Toko" (tanpa ongkir)
export function hitungTagihan(subtotal: number, ongkir: TarifOngkir | null): Tagihan {
  const biayaOngkir = ongkir?.tarif ?? 0;
  return { subtotal, ongkir: biayaOngkir, total: subtotal + biayaOngkir };
}
