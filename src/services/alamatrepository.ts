import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alamat, AlamatInput } from "@/types/alamat";

/**
 * Kontrak akses data alamat.
 * Context dan layar hanya bicara ke interface ini, bukan langsung ke AsyncStorage.
 * Saat backend siap: buat implementasi baru (fetch ke API) lalu ganti `alamatRepository`
 * di baris paling bawah file ini. Layar dan context tidak perlu diubah.
 */
export interface AlamatRepository {
  ambilSemua(): Promise<Alamat[]>;
  buat(data: AlamatInput): Promise<Alamat>;
  perbarui(id: string, data: AlamatInput): Promise<Alamat>;
  hapus(id: string): Promise<void>;
  ambilIdTerpilih(): Promise<string | null>;
  simpanIdTerpilih(id: string | null): Promise<void>;
}

const KUNCI_DAFTAR = "belanjaan_pasar:alamat:v1";
const KUNCI_TERPILIH = "belanjaan_pasar:alamat_terpilih:v1";

async function bacaSemua(): Promise<Alamat[]> {
  try {
    const raw = await AsyncStorage.getItem(KUNCI_DAFTAR);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as Alamat[]) : [];
  } catch {
    return [];
  }
}

async function tulisSemua(daftar: Alamat[]): Promise<void> {
  await AsyncStorage.setItem(KUNCI_DAFTAR, JSON.stringify(daftar));
}

function buatId(): string {
  return `lokal-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

// Implementasi sementara: disimpan di HP (bertahan setelah app ditutup).
const alamatLokal: AlamatRepository = {
  async ambilSemua() {
    return bacaSemua();
  },

  async buat(data) {
    const baru: Alamat = { ...data, id: buatId() };
    const daftar = await bacaSemua();
    await tulisSemua([...daftar, baru]);
    return baru;
  },

  async perbarui(id, data) {
    const daftar = await bacaSemua();
    const lama = daftar.find((a) => a.id === id);
    if (!lama) throw new Error("Alamat tidak ditemukan");
    const baru: Alamat = { ...lama, ...data, id };
    await tulisSemua(daftar.map((a) => (a.id === id ? baru : a)));
    return baru;
  },

  async hapus(id) {
    const daftar = await bacaSemua();
    await tulisSemua(daftar.filter((a) => a.id !== id));
  },

  async ambilIdTerpilih() {
    try {
      return await AsyncStorage.getItem(KUNCI_TERPILIH);
    } catch {
      return null;
    }
  },

  async simpanIdTerpilih(id) {
    if (id === null) await AsyncStorage.removeItem(KUNCI_TERPILIH);
    else await AsyncStorage.setItem(KUNCI_TERPILIH, id);
  },
};

// TODO (nanti): ganti ke repository yang memanggil API backend.
export const alamatRepository: AlamatRepository = alamatLokal;
