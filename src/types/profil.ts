export type Profil = {
  nama: string;
  telepon: string;
  fotoUri: string | null;
  terverifikasi: boolean;
};

export type ProfilInput = Pick<Profil, "nama" | "telepon" | "fotoUri">;
