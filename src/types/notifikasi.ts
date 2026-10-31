import { IconName } from "@/types/ui";

export type KategoriNotifikasi =
  | "pesanan"
  | "promo"
  | "toko";

export type NadaNotifikasi =
  | "hijau"
  | "coklat";

export type ProdukNotifikasi = {
  nama: string;
  timbangan: string;
  ringkasan: string;
  gambarUri?: string;
};

export type AksiNotifikasi = {
  label: string;
  icon: IconName;
};

export type Notifikasi = {
  id: string;
  kategori: KategoriNotifikasi;
  nada: NadaNotifikasi;
  label: string;
  waktu: string;
  judul: string;
  isi: string;
  kode?: string;
  produk?: ProdukNotifikasi;
  aksi?: AksiNotifikasi;
};