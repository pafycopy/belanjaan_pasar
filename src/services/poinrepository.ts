import AsyncStorage from "@react-native-async-storage/async-storage";
import { STATUS_POIN_AWAL } from "@/data/poin";
import { StatusPoin } from "@/types/poin";

/**
 * Kontrak akses data poin (pola sama dengan alamatrepository).
 * Saat backend siap: buat implementasi API, lalu ganti `poinRepository` di baris paling bawah.
 * Catatan: validasi klaim (satu kali per hari) nantinya harus dilakukan di server.
 */
export interface PoinRepository {
  ambil(): Promise<StatusPoin>;
  simpan(status: StatusPoin): Promise<void>;
}

const KUNCI = "belanjaan_pasar:poin:v1";

function valid(x: unknown): x is StatusPoin {
  if (!x || typeof x !== "object") return false;
  const s = x as Record<string, unknown>;
  return (
    typeof s.total === "number" &&
    typeof s.hariTerklaim === "number" &&
    (typeof s.tanggalKlaimTerakhir === "string" || s.tanggalKlaimTerakhir === null)
  );
}

// Implementasi sementara: disimpan di HP.
const poinLokal: PoinRepository = {
  async ambil() {
    try {
      const raw = await AsyncStorage.getItem(KUNCI);
      if (!raw) return STATUS_POIN_AWAL;
      const parsed: unknown = JSON.parse(raw);
      return valid(parsed) ? parsed : STATUS_POIN_AWAL;
    } catch {
      return STATUS_POIN_AWAL;
    }
  },

  async simpan(status) {
    await AsyncStorage.setItem(KUNCI, JSON.stringify(status));
  },
};

// TODO (nanti): ganti ke repository yang memanggil API backend.
export const poinRepository: PoinRepository = poinLokal;
