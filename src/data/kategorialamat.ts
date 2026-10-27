import { IconName } from "@/types/ui";

export type KategoriAlamat = {
  id: string;
  label: string; // inilah yang disimpan di Alamat.kategori
  icon: IconName;
  bg: string;
  fg: string;
};

// Tambah / ubah kategori cukup di sini; chip di form dan ikon di daftar ikut berubah.
export const KATEGORI_ALAMAT: readonly KategoriAlamat[] = [
  { id: "rumah", label: "Rumah Utama", icon: "home", bg: "#e8f5e9", fg: "#2e7d32" },
  { id: "warung", label: "Warung / Usaha", icon: "storefront", bg: "#ffe8d6", fg: "#c2570c" },
  { id: "katering", label: "Dapur Katering", icon: "restaurant", bg: "#e3ecff", fg: "#3b5bdb" },
  { id: "kos", label: "Kos / Kontrakan", icon: "business", bg: "#efe7ff", fg: "#6741d9" },
];

// Pilihan "+ Lainnya": user menulis nama label sendiri
export const KATEGORI_LAINNYA: KategoriAlamat = {
  id: "lainnya",
  label: "Lainnya",
  icon: "add",
  bg: "#eeeeee",
  fg: "#555555",
};

const GAYA_LABEL_KUSTOM = { icon: "location" as IconName, bg: "#eeeeee", fg: "#555555" };

export function cariKategori(label: string): KategoriAlamat | undefined {
  return KATEGORI_ALAMAT.find((k) => k.label === label);
}

// Gaya ikon di daftar; label buatan sendiri memakai gaya netral
export function gayaKategori(label: string): { icon: IconName; bg: string; fg: string } {
  return cariKategori(label) ?? GAYA_LABEL_KUSTOM;
}
