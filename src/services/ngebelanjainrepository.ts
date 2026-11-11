import AsyncStorage from "@react-native-async-storage/async-storage";
import { PesananNgebelanjain } from "@/types/ngebelanjain";

/**
 * Kontrak akses pesanan Ngebelanjain (pola sama dengan repository lain).
 * Saat backend siap: buat implementasi API (admin mengubah status, mengisi tagihan, dan mengonfirmasi
 * pembayaran di server), lalu ganti `ngebelanjainRepository` di baris paling bawah.
 */
export interface NgebelanjainRepository {
  ambilSemua(): Promise<PesananNgebelanjain[]>;
  tambah(pesanan: PesananNgebelanjain): Promise<PesananNgebelanjain[]>;
  perbarui(nomor: string, ubah: (p: PesananNgebelanjain) => PesananNgebelanjain): Promise<PesananNgebelanjain[]>;
}

const KUNCI = "belanjaan_pasar:ngebelanjain:v1";
const STATUS = ["diproses", "dibelanjain", "pembayaran", "dibayar"];

function valid(x: unknown): x is PesananNgebelanjain {
  if (!x || typeof x !== "object") return false;
  const p = x as Record<string, unknown>;
  return (
    typeof p.nomor === "string" &&
    typeof p.daftar === "string" &&
    typeof p.dibuatPada === "number" &&
    typeof p.status === "string" &&
    STATUS.includes(p.status) &&
    (p.pengiriman === "antar" || p.pengiriman === "ambil")
  );
}

async function baca(): Promise<PesananNgebelanjain[]> {
  try {
    const raw = await AsyncStorage.getItem(KUNCI);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter(valid) : [];
  } catch {
    return [];
  }
}

async function simpan(daftar: PesananNgebelanjain[]): Promise<PesananNgebelanjain[]> {
  await AsyncStorage.setItem(KUNCI, JSON.stringify(daftar));
  return daftar;
}

const ngebelanjainLokal: NgebelanjainRepository = {
  ambilSemua: baca,

  // Terbaru di atas
  async tambah(pesanan) {
    const lain = (await baca()).filter((p) => p.nomor !== pesanan.nomor);
    return simpan([pesanan, ...lain]);
  },

  async perbarui(nomor, ubah) {
    const daftar = await baca();
    return simpan(daftar.map((p) => (p.nomor === nomor ? ubah(p) : p)));
  },
};

// TODO (nanti): ganti ke repository yang memanggil API backend.
export const ngebelanjainRepository: NgebelanjainRepository = ngebelanjainLokal;
