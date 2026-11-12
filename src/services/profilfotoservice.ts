import { File, Paths } from "expo-file-system";

const EKSTENSI_GAMBAR = /\.(jpe?g|png|webp|heic)$/i;

/**
 * Menyalin foto terpilih ke direktori dokumen aplikasi agar tidak bergantung
 * pada URI cache sementara dari galeri.
 */
export async function simpanFotoProfil(uriSumber: string): Promise<string> {
  const ekstensi = uriSumber.match(EKSTENSI_GAMBAR)?.[0] ?? ".jpg";
  const sumber = new File(uriSumber);
  const tujuan = new File(Paths.document, `foto-profil-${Date.now()}${ekstensi}`);

  await sumber.copy(tujuan);
  return tujuan.uri;
}
