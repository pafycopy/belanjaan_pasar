import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { profilRepository } from "@/services/profilrepository";
import { Profil, ProfilInput } from "@/types/profil";

type ProfilContextValue = {
  profil: Profil;
  memuat: boolean;
  simpan: (data: ProfilInput) => Promise<void>;
};

const ProfilContext = createContext<ProfilContextValue | null>(null);

export function ProfilProvider({ children }: { children: ReactNode }) {
  const [profil, setProfil] = useState<Profil>({
    nama: "",
    telepon: "",
    fotoUri: null,
    terverifikasi: false,
  });
  const [memuat, setMemuat] = useState(true);

  useEffect(() => {
    let aktif = true;

    profilRepository.ambil()
      .then((data) => {
        if (aktif) setProfil(data);
      })
      .finally(() => {
        if (aktif) setMemuat(false);
      });

    return () => {
      aktif = false;
    };
  }, []);

  const simpan = async (data: ProfilInput) => {
    const tersimpan = await profilRepository.simpan(data);
    setProfil(tersimpan);
  };

  return (
    <ProfilContext.Provider value={{ profil, memuat, simpan }}>
      {children}
    </ProfilContext.Provider>
  );
}

export function useProfil() {
  const context = useContext(ProfilContext);
  if (!context) throw new Error("useProfil harus dipakai di dalam ProfilProvider");
  return context;
}
