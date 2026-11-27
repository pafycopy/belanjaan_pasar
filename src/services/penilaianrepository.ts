import AsyncStorage from "@react-native-async-storage/async-storage";
import { PenilaianProduk } from "@/types/penilaian";

export interface PenilaianRepository {
  ambilSemua(): Promise<PenilaianProduk[]>;
  simpanSemua(data: PenilaianProduk[]): Promise<PenilaianProduk[]>;
}

const KUNCI = "belanjaan_pasar:penilaian_produk:v1";

const penilaianLokal: PenilaianRepository = {
  async ambilSemua() {
    try {
      const raw = await AsyncStorage.getItem(KUNCI);
      if (!raw) return [];
      const parsed: unknown = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];
      return parsed.filter((item): item is PenilaianProduk =>
        !!item && typeof item.id === "string" &&
        typeof item.pesananId === "string" && typeof item.produkId === "string" &&
        typeof item.rating === "number" && item.rating >= 1 && item.rating <= 5 &&
        typeof item.ulasan === "string" && typeof item.dibuatPada === "string"
      );
    } catch {
      return [];
    }
  },

  async simpanSemua(data) {
    await AsyncStorage.setItem(KUNCI, JSON.stringify(data));
    return data;
  },
};

export const penilaianRepository: PenilaianRepository = penilaianLokal;
