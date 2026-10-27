/**
 * Validasi berbasis aturan (data), bukan if-else di setiap layar.
 * Satu aturan = satu pesan. Field opsional yang kosong selalu lolos.
 */
export type Aturan = {
  wajib?: boolean;
  min?: number;   // panjang minimal setelah trim
  pola?: RegExp;  // harus cocok (hanya dicek jika terisi)
  pesan: string;
};

export type AturanForm<K extends string> = Partial<Record<K, Aturan>>;
export type ErrorForm<K extends string> = Partial<Record<K, string>>;

export function cekField(nilai: string, aturan?: Aturan): string | null {
  if (!aturan) return null;
  const v = nilai.trim();
  if (!v) return aturan.wajib ? aturan.pesan : null;
  if (aturan.min !== undefined && v.length < aturan.min) return aturan.pesan;
  if (aturan.pola && !aturan.pola.test(v)) return aturan.pesan;
  return null;
}

export function validasiForm<K extends string>(
  nilai: Record<K, string>,
  aturan: AturanForm<K>
): ErrorForm<K> {
  const hasil: ErrorForm<K> = {};
  for (const kunci of Object.keys(aturan) as K[]) {
    const pesan = cekField(nilai[kunci] ?? "", aturan[kunci]);
    if (pesan) hasil[kunci] = pesan;
  }
  return hasil;
}
