import AsyncStorage from "@react-native-async-storage/async-storage";

export interface FavoritRepository {
  ambilSemua(): Promise<string[]>;
  simpan(ids: string[]): Promise<string[]>;
}

const KUNCI = "belanjaan_pasar:favorit:v1";

const favoritLokal: FavoritRepository = {
  async ambilSemua() {
    try {
      const raw = await AsyncStorage.getItem(KUNCI);
      if (!raw) return [];
      const parsed: unknown = JSON.parse(raw);
      return Array.isArray(parsed)
        ? parsed.filter((id): id is string => typeof id === "string")
        : [];
    } catch {
      return [];
    }
  },

  async simpan(ids) {
    const unik = [...new Set(ids)];
    await AsyncStorage.setItem(KUNCI, JSON.stringify(unik));
    return unik;
  },
};

export const favoritRepository: FavoritRepository = favoritLokal;
