import AsyncStorage from "@react-native-async-storage/async-storage";
import { ItemKeranjang, ItemKeranjangInput } from "@/types/keranjang";
import { gabungkanItem } from "@/utils/keranjang";

/**
 * Kontrak akses data keranjang. Layar dan context hanya bicara ke interface ini.
 * Saat backend siap: buat implementasi yang memanggil API lalu ganti `keranjangRepository` di bawah.
 */
export interface KeranjangRepository {
  ambilSemua(): Promise<ItemKeranjang[]>;
  tambah(input: ItemKeranjangInput): Promise<ItemKeranjang[]>; // mengembalikan isi keranjang terbaru
}

const KUNCI = "belanjaan_pasar:keranjang:v1";

async function baca(): Promise<ItemKeranjang[]> {
  try {
    const raw = await AsyncStorage.getItem(KUNCI);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as ItemKeranjang[]) : [];
  } catch {
    return [];
  }
}

function buatUid(): string {
  return `krj-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

// Implementasi sementara: disimpan di HP (bertahan setelah app ditutup).
const keranjangLokal: KeranjangRepository = {
  ambilSemua: baca,

  async tambah(input) {
    const baru = gabungkanItem(await baca(), input, buatUid());
    await AsyncStorage.setItem(KUNCI, JSON.stringify(baru));
    return baru;
  },
};

// TODO (nanti): ganti ke repository yang memanggil API backend.
export const keranjangRepository: KeranjangRepository = keranjangLokal;
