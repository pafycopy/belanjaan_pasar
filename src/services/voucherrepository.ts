import AsyncStorage from "@react-native-async-storage/async-storage";
import { VoucherMilik } from "@/types/voucher";

/**
 * Kontrak akses data voucher milik pengguna (pola sama dengan alamat dan poin).
 * Saat backend siap: buat implementasi API lalu ganti `voucherRepository` di baris paling bawah.
 * Catatan: pengecekan poin cukup dan penukaran harus dilakukan di server.
 */
export interface VoucherRepository {
  ambil(): Promise<VoucherMilik[]>;
  simpan(daftar: VoucherMilik[]): Promise<void>;
}

const KUNCI = "belanjaan_pasar:voucher_milik:v1";

function valid(x: unknown): x is VoucherMilik {
  if (!x || typeof x !== "object") return false;
  const v = x as Record<string, unknown>;
  return (
    typeof v.uid === "string" &&
    typeof v.voucherId === "string" &&
    typeof v.ditukarPada === "string" &&
    (v.dipakaiPada === undefined || typeof v.dipakaiPada === "string")
  );
}

// Implementasi sementara: disimpan di HP.
const voucherLokal: VoucherRepository = {
  async ambil() {
    try {
      const raw = await AsyncStorage.getItem(KUNCI);
      if (!raw) return [];
      const parsed: unknown = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed.filter(valid) : [];
    } catch {
      return [];
    }
  },

  async simpan(daftar) {
    await AsyncStorage.setItem(KUNCI, JSON.stringify(daftar));
  },
};

// TODO (nanti): ganti ke repository yang memanggil API backend.
export const voucherRepository: VoucherRepository = voucherLokal;
