import { HADIAH_HARIAN, HARI_SIKLUS, JENDELA_KLAIM, KLAIM_BEBAS_JAM } from "@/data/poin";
import { FaseKlaim, RingkasanKlaim, StatusHari, StatusPoin } from "@/types/poin";
import { menitWIB, selisihHari, tanggalWIB } from "@/utils/waktu";

const MENIT_SEHARI = 24 * 60;

/**
 * Aturan klaim harian (semua perhitungan WIB):
 * - Satu klaim per hari, hanya di jam klaim (kecuali `bebasJam`).
 * - Klaim berturut-turut menaikkan hari 1 -> 7.
 * - Hari terlewat tanpa klaim, atau siklus 7 hari sudah selesai -> mulai lagi dari Hari 1.
 */
export function ringkasKlaim(
  status: StatusPoin,
  sekarang: number,
  bebasJam: boolean = KLAIM_BEBAS_JAM
): RingkasanKlaim {
  const hariIni = tanggalWIB(sekarang);
  const menit = menitWIB(sekarang);
  const sudah = status.tanggalKlaimTerakhir === hariIni;

  // Progres siklus yang berlaku hari ini
  let terklaim = status.hariTerklaim;
  if (!sudah && status.tanggalKlaimTerakhir) {
    const jarak = selisihHari(hariIni, status.tanggalKlaimTerakhir);
    if (jarak > 1 || terklaim >= HARI_SIKLUS) terklaim = 0;
  }

  const dalamJendela = menit >= JENDELA_KLAIM.mulai && menit < JENDELA_KLAIM.selesai;
  const fase: FaseKlaim = sudah
    ? "sudah"
    : dalamJendela || bebasJam
      ? "bisa"
      : menit < JENDELA_KLAIM.mulai
        ? "sebelum"
        : "terlewat";

  const hariKlaim = sudah ? null : terklaim + 1;
  const besok = sudah ? terklaim + 1 : fase === "terlewat" ? null : terklaim + 2;
  const hariBesok = besok !== null && besok <= HARI_SIKLUS ? besok : null;

  // Hitung mundur mengikuti jam klaim yang sebenarnya
  const hitungMundur = sudah
    ? { jenis: "berikutnya" as const, menit: MENIT_SEHARI - menit + JENDELA_KLAIM.mulai }
    : dalamJendela
      ? { jenis: "sisa" as const, menit: JENDELA_KLAIM.selesai - menit }
      : {
          jenis: "dibuka" as const,
          menit:
            menit < JENDELA_KLAIM.mulai
              ? JENDELA_KLAIM.mulai - menit
              : MENIT_SEHARI - menit + JENDELA_KLAIM.mulai,
        };

  return { terklaim, fase, hariKlaim, hariBesok, hitungMundur };
}

export function statusHari(hari: number, r: RingkasanKlaim): StatusHari {
  if (hari <= r.terklaim) return "terklaim";
  if (hari === r.hariKlaim) {
    return r.fase === "bisa" ? "siap" : r.fase === "sebelum" ? "menunggu" : "terlewat";
  }
  if (hari === r.hariBesok) return "besok";
  return "terkunci";
}

/** Status baru setelah klaim hari ini. Panggil hanya saat `r.fase === "bisa"`. */
export function terapkanKlaim(status: StatusPoin, r: RingkasanKlaim, sekarang: number) {
  const hari = r.hariKlaim as number;
  const poin = HADIAH_HARIAN[hari - 1].poin;
  const baru: StatusPoin = {
    total: status.total + poin,
    hariTerklaim: hari,
    tanggalKlaimTerakhir: tanggalWIB(sekarang),
  };
  return { status: baru, poin, hari };
}
