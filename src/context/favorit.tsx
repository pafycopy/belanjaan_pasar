import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { favoritRepository } from "@/services/favoritrepository";
import { cariProduk } from "@/utils/produk";
import { colors, radius, spacing } from "@/theme";

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
  const [pesanToast, setPesanToast] = useState<string | null>(null);

  useEffect(() => {
    if (!pesanToast) return;
    const timer = setTimeout(() => setPesanToast(null), 2400);
    return () => clearTimeout(timer);
  }, [pesanToast]);

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
    const sudahFavorit = ids.includes(produkId);
    const berikutnya = sudahFavorit
      ? ids.filter((id) => id !== produkId)
      : [...ids, produkId];

    setIds(berikutnya);
    try {
      await favoritRepository.simpan(berikutnya);

      const namaProduk = cariProduk(produkId)?.nama ?? "produk ini";
      const pesan = sudahFavorit
        ? `${namaProduk} dihapus dari favorit`
        : `Anda memasukkan ${namaProduk} ke favorit`;

      setPesanToast(pesan);
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
      <View style={styles.root}>
        {children}
        {pesanToast ? (
          <View pointerEvents="none" style={styles.toastWrap}>
            <View style={styles.toast}>
              <Ionicons name="checkmark-circle" size={22} color={colors.primary} />
              <Text style={styles.toastText}>{pesanToast}</Text>
            </View>
          </View>
        ) : null}
      </View>
    </FavoritContext.Provider>
  );
}

export function useFavorit() {
  const ctx = useContext(FavoritContext);
  if (!ctx) throw new Error("useFavorit harus dipakai di dalam FavoritProvider");
  return ctx;
}


const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  toastWrap: {
    position: "absolute",
    top: 100,
    left: spacing.lg,
    right: spacing.lg,
    zIndex: 9999,
    alignItems: "center",
  },
  toast: {
    width: "100%",
    minHeight: 54,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.primarySoft,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.14,
    shadowRadius: 8,
    elevation: 6,
  },
  toastText: {
    flex: 1,
    color: colors.dark,
    fontSize: 13,
    fontWeight: "600",
  },
});
