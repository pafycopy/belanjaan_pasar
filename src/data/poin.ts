import { HadiahHarian, StatusPoin } from "@/types/poin";

// Jam klaim harian (WIB), format menit sejak 00.00
export const JENDELA_KLAIM = { mulai: 4 * 60, selesai: 8 * 60 } as const;

// Saat development, klaim boleh kapan saja supaya mudah dites.
// Di build rilis jam klaim di atas yang berlaku.
export const KLAIM_BEBAS_JAM: boolean = __DEV__;

export const HADIAH_HARIAN: readonly HadiahHarian[] = [
  { hari: 1, poin: 10 },
  { hari: 2, poin: 15 },
  { hari: 3, poin: 20 },
  { hari: 4, poin: 25 },
  { hari: 5, poin: 30 },
  { hari: 6, poin: 40 },
  { hari: 7, poin: 100, keterangan: "Gratis Ngebelanjain", bonus: true },
];

export const HARI_SIKLUS = HADIAH_HARIAN.length;

// Nilai awal contoh. Nanti total poin berasal dari backend.
export const STATUS_POIN_AWAL: StatusPoin = {
  total: 2450,
  hariTerklaim: 0,
  tanggalKlaimTerakhir: null,
};
