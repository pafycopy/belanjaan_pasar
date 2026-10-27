export type Alamat = {
  id: string;
  kategori: string;       // contoh: "Warung / Usaha"
  namaPenerima: string;
  noHp?: string;          // no. HP penerima (untuk kurir)
  jalan: string;          // alamat lengkap dan nomor
  wilayah: string;        // kecamatan dan kelurahan
  kota?: string;          // kota / kabupaten (contoh: "Jakarta Barat")
  rt?: string;
  rw?: string;
  kodePos?: string;
  patokan?: string;
  latitude: number;
  longitude: number;
  jarakKm?: number;
};

// Data yang diisi dari form. id dibuat oleh repository (nanti: oleh server).
export type AlamatInput = Omit<Alamat, "id">;

export const KATEGORI_ALAMAT = [
  "Rumah Utama",
  "Warung / Usaha",
  "Dapur Katering",
  "Kos / Kontrakan",
] as const;