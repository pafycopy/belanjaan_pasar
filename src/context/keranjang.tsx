import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { ItemKeranjang, ItemKeranjangInput } from "@/types/keranjang";
import { keranjangRepository as repo } from "@/services/keranjangrepository";

type KeranjangContextValue = {
  item: ItemKeranjang[];
  jumlahBaris: number;
  jumlahItem: number;
  subtotal: number;
  memuat: boolean;
  tambah: (input: ItemKeranjangInput) => Promise<void>;
  ubahJumlah: (uid: string, jumlah: number) => Promise<void>;
  hapus: (uid: string) => Promise<void>;
  kosongkan: () => Promise<void>;
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

  const ubahJumlah = async (uid: string, jumlah: number) => {
    setItem(await repo.ubahJumlah(uid, jumlah));
  };

  const hapus = async (uid: string) => {
    setItem(await repo.hapus(uid));
  };

  const kosongkan = async () => {
    setItem(await repo.kosongkan());
  };

  const jumlahItem = item.reduce((total, i) => total + i.jumlah, 0);
  const subtotal = item.reduce((total, i) => total + i.hargaSatuan * i.jumlah, 0);

  return (
    <KeranjangContext.Provider
      value={{
        item,
        jumlahBaris: item.length,
        jumlahItem,
        subtotal,
        memuat,
        tambah,
        ubahJumlah,
        hapus,
        kosongkan,
      }}
    >
      {children}
    </KeranjangContext.Provider>
  );
}

export function useKeranjang() {
  const ctx = useContext(KeranjangContext);
  if (!ctx) throw new Error("useKeranjang harus dipakai di dalam KeranjangProvider");
  return ctx;
}
