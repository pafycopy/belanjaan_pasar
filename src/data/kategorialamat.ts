import { IconName } from "@/types/ui";
import { kategoriWarna } from "@/theme";

export type KategoriAlamat = {
  id: string;
  label: string;     // inilah yang disimpan di Alamat.kategori
  sebutan: string;   // dipakai di judul kartu, mis. "Alamat Rumah"
  utama?: boolean;   // kategori alamat utama (tampil lencana "Utama")
  icon: IconName;
  bg: string;
  fg: string;
};

// Tambah / ubah kategori cukup di sini; chip di form dan ikon di daftar ikut berubah.
export const KATEGORI_ALAMAT: readonly KategoriAlamat[] = [
  { id: "rumah", label: "Rumah Utama", sebutan: "Rumah", utama: true, icon: "home", ...kategoriWarna.rumah },
  { id: "warung", label: "Warung / Usaha", sebutan: "Warung / Usaha", icon: "storefront", ...kategoriWarna.warung },
  { id: "katering", label: "Dapur Katering", sebutan: "Dapur Katering", icon: "restaurant", ...kategoriWarna.katering },
  { id: "kos", label: "Kos / Kontrakan", sebutan: "Kos / Kontrakan", icon: "business", ...kategoriWarna.kos },
];

// Pilihan "+ Lainnya": user menulis nama label sendiri
export const KATEGORI_LAINNYA: KategoriAlamat = {
  id: "lainnya",
  label: "Lainnya",
  sebutan: "Lainnya",
  icon: "add",
  ...kategoriWarna.netral,
};

const GAYA_LABEL_KUSTOM = { icon: "location" as IconName, ...kategoriWarna.netral };

export function cariKategori(label: string): KategoriAlamat | undefined {
  return KATEGORI_ALAMAT.find((k) => k.label === label);
}

// Gaya ikon di daftar; label buatan sendiri memakai gaya netral
export function gayaKategori(label: string): { icon: IconName; bg: string; fg: string } {
  return cariKategori(label) ?? GAYA_LABEL_KUSTOM;
}
