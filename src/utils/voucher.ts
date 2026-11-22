import { StatusMilik, Voucher, VoucherMilik } from "@/types/voucher";
import { formatTanggal, tanggalWIB } from "@/utils/waktu";

const HARI_MS = 24 * 3600 * 1000;

// Voucher di katalog hilang dari daftar tukar kalau tanggal berlakunya sudah lewat (tanggal WIB).
// Tanggal berlaku itu sendiri masih bisa ditukar sampai akhir harinya.
export function sudahKedaluwarsa(v: Voucher, sekarang: number = Date.now()): boolean {
  return v.berlakuSampai < tanggalWIB(sekarang);
}

// Kapan voucher berakhir (ms): akhir hari tanggal berlaku (WIB)
export function waktuKedaluwarsa(v: Voucher): number {
  return Date.parse(`${v.berlakuSampai}T23:59:59+07:00`);
}

export function statusMilik(
  m: VoucherMilik,
  v: Voucher,
  sekarang: number = Date.now()
): StatusMilik {
  if (m.dipakaiPada) return "terpakai";
  return waktuKedaluwarsa(v) < sekarang ? "kedaluwarsa" : "aktif";
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
