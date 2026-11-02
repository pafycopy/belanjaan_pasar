// Yang disimpan (nanti datang dari backend)
export type StatusPoin = {
  total: number;                          // total poin milik pengguna
  hariTerklaim: number;                   // jumlah hari yang sudah diklaim pada siklus berjalan (0..7)
  tanggalKlaimTerakhir: string | null;    // "YYYY-MM-DD" (WIB), null = belum pernah klaim
};

export type HadiahHarian = {
  hari: number;           // 1..7
  poin: number;
  keterangan?: string;    // hadiah tambahan selain poin (hari bonus)
  bonus?: boolean;        // tampil sebagai kartu lebar "Super Bonus"
};

export type StatusHari =
  | "terklaim"
  | "siap"        // hari ini & jam klaim sedang buka
  | "menunggu"    // hari ini, tapi jam klaim belum dibuka
  | "terlewat"    // hari ini, jam klaim sudah lewat
  | "besok"
  | "terkunci";

export type FaseKlaim = "bisa" | "sudah" | "sebelum" | "terlewat";

export type JenisHitungMundur = "sisa" | "dibuka" | "berikutnya";

export type RingkasanKlaim = {
  terklaim: number;                 // hari terklaim pada siklus aktif (sudah memperhitungkan reset)
  fase: FaseKlaim;
  hariKlaim: number | null;         // hari ke berapa yang diklaim hari ini (null = sudah diklaim)
  hariBesok: number | null;
  hitungMundur: { jenis: JenisHitungMundur; menit: number };
};
