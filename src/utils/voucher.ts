import { MASA_BERLAKU_DEFAULT_HARI } from "@/data/voucher";
import { StatusMilik, Voucher, VoucherMilik } from "@/types/voucher";
import { formatTanggal, tanggalWIB } from "@/utils/waktu";

const HARI_MS = 24 * 3600 * 1000;

// Voucher di katalog sudah tidak bisa ditukar kalau tanggal berlakunya lewat (tanggal WIB)
export function sudahKedaluwarsa(v: Voucher, sekarang: number = Date.now()): boolean {
  return !!v.berlakuSampai && v.berlakuSampai < tanggalWIB(sekarang);
}

// Kapan voucher milik pengguna berakhir (ms): akhir hari tanggal berlaku (WIB),
// atau MASA_BERLAKU_DEFAULT_HARI hari sejak ditukar kalau tidak ada tanggal.
export function waktuKedaluwarsa(v: Voucher, ditukarPada: string): number {
  if (v.berlakuSampai) return Date.parse(`${v.berlakuSampai}T23:59:59+07:00`);
  return new Date(ditukarPada).getTime() + MASA_BERLAKU_DEFAULT_HARI * HARI_MS;
}

export function statusMilik(
  m: VoucherMilik,
  v: Voucher,
  sekarang: number = Date.now()
): StatusMilik {
  if (m.dipakaiPada) return "terpakai";
  return waktuKedaluwarsa(v, m.ditukarPada) < sekarang ? "kedaluwarsa" : "aktif";
}

// "Berlaku dalam: 2 jam" kalau tinggal kurang dari sehari, selain itu "Berlaku s/d 31 Okt 2026"
export function teksBerlaku(kedaluwarsa: number, sekarang: number = Date.now()): string {
  const sisa = kedaluwarsa - sekarang;
  if (sisa > 0 && sisa <= HARI_MS) {
    const menit = Math.ceil(sisa / 60000);
    return menit < 60 ? `Berlaku dalam: ${menit} menit` : `Berlaku dalam: ${Math.ceil(menit / 60)} jam`;
  }
  return `Berlaku s/d ${formatTanggal(tanggalWIB(kedaluwarsa))}`;
}
