import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { ItemKeranjang, ItemKeranjangInput } from "@/types/keranjang";
import { keranjangRepository as repo } from "@/services/keranjangrepository";

type KeranjangContextValue = {
  item: ItemKeranjang[];
  jumlahBaris: number; // banyaknya jenis barang (untuk badge keranjang)
  memuat: boolean;
  tambah: (input: ItemKeranjangInput) => Promise<void>;
};

const KeranjangContext = createContext<KeranjangContextValue | null>(null);

export function KeranjangProvider({ children }: { children: ReactNode }) {
  const [item, setItem] = useState<ItemKeranjang[]>([]);
  const [memuat, setMemuat] = useState(true);

  useEffect(() => {
    let aktif = true;
    (async () => {
      try {
        const semua = await repo.ambilSemua();
        if (aktif) setItem(semua);
      } finally {
        if (aktif) setMemuat(false);
      }
    })();
    return () => {
      aktif = false;
    };
  }, []);

  const tambah = async (input: ItemKeranjangInput) => {
    setItem(await repo.tambah(input));
  };

  return (
    <KeranjangContext.Provider value={{ item, jumlahBaris: item.length, memuat, tambah }}>
      {children}
    </KeranjangContext.Provider>
  );
}

export function useKeranjang() {
  const ctx = useContext(KeranjangContext);
  if (!ctx) throw new Error("useKeranjang harus dipakai di dalam KeranjangProvider");
  return ctx;
}
