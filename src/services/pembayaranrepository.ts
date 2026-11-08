import AsyncStorage from "@react-native-async-storage/async-storage";
import { TagihanTransfer } from "@/types/pembayaran";

/**
 * Kontrak akses tagihan yang sedang menunggu dibayar (pola sama dengan repository lain).
 * Saat backend siap: buat implementasi API (server yang membuat tagihan, nomor VA/QRIS, dan
 * memverifikasi pembayaran), lalu ganti `pembayaranRepository` di baris paling bawah.
 */
export interface PembayaranRepository {
  ambil(): Promise<TagihanTransfer | null>;
  simpan(tagihan: TagihanTransfer): Promise<void>;
  hapus(): Promise<void>;
}

const KUNCI = "belanjaan_pasar:pembayaran_aktif:v1";

function valid(x: unknown): x is TagihanTransfer {
  if (!x || typeof x !== "object") return false;
  const t = x as Record<string, unknown>;
  return (
    typeof t.invoice === "string" &&
    typeof t.metode === "string" &&
    typeof t.batasBayar === "number" &&
    typeof t.total === "number" &&
    (t.pengiriman === "antar" || t.pengiriman === "ambil") &&
    Array.isArray(t.baris)
  );
}

// Implementasi sementara: disimpan di HP (bertahan setelah app ditutup, jadi hitung mundur tidak ter-reset).
const pembayaranLokal: PembayaranRepository = {
  async ambil() {
    try {
      const raw = await AsyncStorage.getItem(KUNCI);
      if (!raw) return null;
      const parsed: unknown = JSON.parse(raw);
      return valid(parsed) ? parsed : null;
    } catch {
      return null;
    }
  },

  async simpan(tagihan) {
    await AsyncStorage.setItem(KUNCI, JSON.stringify(tagihan));
  },

  async hapus() {
    await AsyncStorage.removeItem(KUNCI);
  },
};

// TODO (nanti): ganti ke repository yang memanggil API backend.
export const pembayaranRepository: PembayaranRepository = pembayaranLokal;
