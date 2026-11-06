import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { favoritRepository } from "@/services/favoritrepository";

type FavoritContextValue = {
  ids: string[];
  jumlah: number;
  memuat: boolean;
  isFavorit: (produkId: string) => boolean;
  toggle: (produkId: string) => Promise<void>;
  hapus: (produkId: string) => Promise<void>;
};

const FavoritContext = createContext<FavoritContextValue | null>(null);

export function FavoritProvider({ children }: { children: ReactNode }) {
  const [ids, setIds] = useState<string[]>([]);
  const [memuat, setMemuat] = useState(true);

  useEffect(() => {
    let aktif = true;
    favoritRepository.ambilSemua()
      .then((data) => {
        if (aktif) setIds(data);
      })
      .finally(() => {
        if (aktif) setMemuat(false);
      });
    return () => {
      aktif = false;
    };
  }, []);

  const toggle = async (produkId: string) => {
    const berikutnya = ids.includes(produkId)
      ? ids.filter((id) => id !== produkId)
      : [...ids, produkId];
    setIds(berikutnya);
    try {
      await favoritRepository.simpan(berikutnya);
    } catch (error) {
      setIds(ids);
      throw error;
    }
  };

  const hapus = async (produkId: string) => {
    const berikutnya = ids.filter((id) => id !== produkId);
    setIds(berikutnya);
    try {
      await favoritRepository.simpan(berikutnya);
    } catch (error) {
      setIds(ids);
      throw error;
    }
  };

  return (
    <FavoritContext.Provider
      value={{
        ids,
        jumlah: ids.length,
        memuat,
        isFavorit: (produkId) => ids.includes(produkId),
        toggle,
        hapus,
      }}
    >
      {children}
    </FavoritContext.Provider>
  );
}

export function useFavorit() {
  const ctx = useContext(FavoritContext);
  if (!ctx) throw new Error("useFavorit harus dipakai di dalam FavoritProvider");
  return ctx;
}
