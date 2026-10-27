import { KeyboardTypeOptions } from "react-native";
import { IconName } from "@/types/ui";
import { Aturan, AturanForm } from "@/utils/validasi";

/**
 * Definisi field form sebagai data: label, placeholder, keyboard, dan aturan validasi.
 * Komponen <TextField field={...}> merender field apa pun dari definisi ini.
 */
export type DefinisiField = {
  label: string;
  placeholder: string;
  wajib?: boolean;     // tampilkan tanda * di label
  bantuan?: string;    // teks bantuan di bawah judul
  ikon?: IconName;
  keyboardType?: KeyboardTypeOptions;
  multiline?: boolean;
  maxLength?: number;
  aturan?: Aturan;
};

export const FIELD_ALAMAT = {
  namaPenerima: {
    label: "Nama Penerima",
    placeholder: "Ketik nama Anda disini",
    wajib: true,
    ikon: "person-outline",
    aturan: { wajib: true, min: 2, pesan: "Nama penerima wajib diisi" },
  },
  jalan: {
    label: "Alamat Lengkap & Nomor Rumah",
    placeholder: "Ketik alamat Anda disini",
    wajib: true,
    multiline: true,
    aturan: { wajib: true, min: 5, pesan: "Alamat lengkap wajib diisi (jalan dan nomor)" },
  },
  patokan: {
    label: "Patokan Rumah / Tempat Cantolan",
    bantuan: "Penting saat gerbang komplek masih sepi atau pintu belum dibuka pukul 06.00 pagi.",
    placeholder:
      "Contoh: Pagar besi warna hitam tinggi, depan bundaran Blok H. Gantung kantong ayam di cantolan dinding dekat meteran air.",
    multiline: true,
  },
  // Muncul hanya saat kategori "Lainnya"; aturannya kondisional (lihat ATURAN_KATEGORI_KUSTOM)
  kategoriKustom: {
    label: "Nama Label",
    placeholder: "Nama label, contoh: Rumah Ibu",
    maxLength: 30,
  },
} satisfies Record<string, DefinisiField>;

export const ATURAN_KATEGORI_KUSTOM: Aturan = { wajib: true, min: 2, pesan: "Tulis nama label alamat" };

export const FIELD_WILAYAH = {
  wilayah: {
    label: "Kecamatan, Kelurahan",
    placeholder: "Contoh: Kembangan, Meruya",
    wajib: true,
    aturan: { wajib: true, min: 3, pesan: "Kecamatan & kelurahan wajib diisi" },
  },
  kota: { label: "Kota / Kabupaten", placeholder: "Contoh: Jakarta Barat" },
  rt: {
    label: "RT",
    placeholder: "04",
    keyboardType: "number-pad",
    maxLength: 3,
    aturan: { pola: /^\d{1,3}$/, pesan: "RT berupa angka" },
  },
  rw: {
    label: "RW",
    placeholder: "02",
    keyboardType: "number-pad",
    maxLength: 3,
    aturan: { pola: /^\d{1,3}$/, pesan: "RW berupa angka" },
  },
  kodePos: {
    label: "Kode Pos",
    placeholder: "11640",
    keyboardType: "number-pad",
    maxLength: 5,
    aturan: { pola: /^\d{5}$/, pesan: "Kode pos harus 5 angka" },
  },
} satisfies Record<string, DefinisiField>;

export type KunciAlamat = keyof typeof FIELD_ALAMAT;
export type KunciWilayah = keyof typeof FIELD_WILAYAH;
export type KunciForm = KunciAlamat | KunciWilayah;

// Susunan field di lembar wilayah: tiap array = satu baris, flex = lebar relatif
export const BARIS_WILAYAH: readonly (readonly { kunci: KunciWilayah; flex?: number }[])[] = [
  [{ kunci: "wilayah" }],
  [{ kunci: "kota" }],
  [{ kunci: "rt" }, { kunci: "rw" }, { kunci: "kodePos", flex: 1.4 }],
];

// Kumpulkan aturan validasi langsung dari definisi field
export function aturanDari<K extends string>(fields: Record<K, DefinisiField>): AturanForm<K> {
  const hasil: AturanForm<K> = {};
  for (const kunci of Object.keys(fields) as K[]) {
    const aturan = fields[kunci].aturan;
    if (aturan) hasil[kunci] = aturan;
  }
  return hasil;
}

export const ATURAN_WILAYAH = aturanDari(FIELD_WILAYAH);
export const ATURAN_FORM: AturanForm<KunciForm> = { ...aturanDari(FIELD_ALAMAT), ...ATURAN_WILAYAH };
