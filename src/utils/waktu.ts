const WIB_MS = 7 * 3600 * 1000;

const BULAN = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "Mei",
  "Jun",
  "Jul",
  "Agu",
  "Sep",
  "Okt",
  "Nov",
  "Des",
];

const pad = (n: number) =>
  String(n).padStart(2, "0");

/**
 * Waktu notifikasi dalam WIB:
 * - < 1 jam   : "15 mnt lalu"
 * - hari ini  : "04.35 WIB"
 * - lainnya   : "18 Okt, 20.45 WIB"
 */
export function formatWaktuNotifikasi(
  iso: string,
  sekarang: number = Date.now()
): string {
  const t = new Date(iso).getTime();

  if (Number.isNaN(t)) {
    return "";
  }

  const menit = Math.floor(
    (sekarang - t) / 60000
  );

  if (menit < 1) {
    return "Baru saja";
  }

  if (menit < 60) {
    return `${menit} mnt lalu`;
  }

  const w = new Date(t + WIB_MS);
  const n = new Date(sekarang + WIB_MS);

  const jam = `${pad(
    w.getUTCHours()
  )}.${pad(
    w.getUTCMinutes()
  )} WIB`;

  const hariIni =
    w.getUTCFullYear() === n.getUTCFullYear() &&
    w.getUTCMonth() === n.getUTCMonth() &&
    w.getUTCDate() === n.getUTCDate();

  return hariIni
    ? jam
    : `${w.getUTCDate()} ${
        BULAN[w.getUTCMonth()]
      }, ${jam}`;
}