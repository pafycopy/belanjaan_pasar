import AsyncStorage from "@react-native-async-storage/async-storage";
import { PROFIL_AWAL } from "@/data/profil";
import { Profil, ProfilInput } from "@/types/profil";

export interface ProfilRepository {
  ambil(): Promise<Profil>;
  simpan(data: ProfilInput): Promise<Profil>;
}

const KUNCI_PROFIL = "belanjaan_pasar:profil:v1";

const profilLokal: ProfilRepository = {
  async ambil() {
    try {
      const raw = await AsyncStorage.getItem(KUNCI_PROFIL);
      if (!raw) return PROFIL_AWAL;

      const data: unknown = JSON.parse(raw);
      if (
        typeof data !== "object" ||
        data === null ||
        !("nama" in data) ||
        !("telepon" in data)
      ) {
        return PROFIL_AWAL;
      }

      const tersimpan = data as Partial<Profil>;
      return {
        nama: typeof tersimpan.nama === "string" ? tersimpan.nama : PROFIL_AWAL.nama,
        telepon: typeof tersimpan.telepon === "string" ? tersimpan.telepon : PROFIL_AWAL.telepon,
        fotoUri: typeof tersimpan.fotoUri === "string" ? tersimpan.fotoUri : null,
        terverifikasi: typeof tersimpan.terverifikasi === "boolean"
          ? tersimpan.terverifikasi
          : PROFIL_AWAL.terverifikasi,
      };
    } catch {
      return PROFIL_AWAL;
    }
  },

  async simpan(data) {
    const sebelumnya = await this.ambil();
    const profilBaru: Profil = {
      ...sebelumnya,
      ...data,
      nama: data.nama.trim(),
      telepon: data.telepon.trim(),
      // Perubahan nomor telepon perlu diverifikasi kembali ketika fitur OTP tersedia.
      terverifikasi: data.telepon.trim() === sebelumnya.telepon ? sebelumnya.terverifikasi : false,
    };

    await AsyncStorage.setItem(KUNCI_PROFIL, JSON.stringify(profilBaru));
    return profilBaru;
  },
};

export const profilRepository: ProfilRepository = profilLokal;
