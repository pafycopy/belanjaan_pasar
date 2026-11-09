import AsyncStorage from "@react-native-async-storage/async-storage";
import { Pesanan } from "@/types/pesanan";

/**
 * Kontrak akses daftar pesanan (pola sama dengan repository lain).
 * Saat backend siap: buat implementasi API (server yang mengubah status pesanan), lalu ganti
 * `pesananRepository` di baris paling bawah.
 */
export interface PesananRepository {
  ambilSemua(): Promise<Pesanan[]>;
  tambah(pesanan: Pesanan): Promise<Pesanan[]>;
  perbarui(invoice: string, ubah: (p: Pesanan) => Pesanan): Promise<Pesanan[]>;
}

const KUNCI = "belanjaan_pasar:pesanan:v1";

function valid(x: unknown): x is Pesanan {
  if (!x || typeof x !== "object") return false;
  const p = x as Record<string, unknown>;
  return (
    typeof p.invoice === "string" &&
    typeof p.total === "number" &&
    typeof p.dibayarPada === "number" &&
    (p.status === "disiapkan" || p.status === "dikirim" || p.status === "selesai") &&
    (p.pengiriman === "antar" || p.pengiriman === "ambil") &&
    Array.isArray(p.baris)
  );
}

async function baca(): Promise<Pesanan[]> {
  try {
    const raw = await AsyncStorage.getItem(KUNCI);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter(valid) : [];
  } catch {
    return [];
  }
}

async function simpan(daftar: Pesanan[]): Promise<Pesanan[]> {
  await AsyncStorage.setItem(KUNCI, JSON.stringify(daftar));
  return daftar;
}

const pesananLokal: PesananRepository = {
  ambilSemua: baca,

  // Terbaru di atas; invoice yang sama diganti, bukan digandakan
  async tambah(pesanan) {
    const lain = (await baca()).filter((p) => p.invoice !== pesanan.invoice);
    return simpan([pesanan, ...lain]);
  },

  async perbarui(invoice, ubah) {
    const daftar = await baca();
    return simpan(daftar.map((p) => (p.invoice === invoice ? ubah(p) : p)));
  },
};

// TODO (nanti): ganti ke repository yang memanggil API backend.
export const pesananRepository: PesananRepository = pesananLokal;
