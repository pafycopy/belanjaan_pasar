import { ItemKeranjang, ItemKeranjangInput } from "@/types/keranjang";

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
