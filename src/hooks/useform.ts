import { useState } from "react";
import { AturanForm, ErrorForm, validasiForm } from "@/utils/validasi";

/**
 * State form generik: nilai, error, dan validasi berbasis aturan.
 * Dipakai oleh semua form agar tidak ada useState berulang per field.
 */
export function useForm<K extends string>(awal: Record<K, string>, aturan: AturanForm<K>) {
  const [nilai, setNilai] = useState<Record<K, string>>(awal);
  const [errors, setErrors] = useState<ErrorForm<K>>({});

  const hapusError = (kunci: K[]) =>
    setErrors((e) => {
      const baru = { ...e };
      for (const k of kunci) delete baru[k];
      return baru;
    });

  const ubah = (kunci: K, v: string) => {
    setNilai((n) => ({ ...n, [kunci]: v }) as Record<K, string>);
    hapusError([kunci]);
  };

  const ubahBanyak = (data: Partial<Record<K, string>>) => {
    setNilai((n) => ({ ...n, ...data }) as Record<K, string>);
    hapusError(Object.keys(data) as K[]);
  };

  // `tambahan` = error khusus yang dihitung pemanggil (aturan yang bergantung pada kondisi lain)
  const validasi = (tambahan?: ErrorForm<K>): boolean => {
    const hasil: ErrorForm<K> = { ...validasiForm(nilai, aturan) };
    for (const k of Object.keys(tambahan ?? {}) as K[]) {
      const pesan = tambahan?.[k];
      if (pesan) hasil[k] = pesan;
    }
    setErrors(hasil);
    return Object.keys(hasil).length === 0;
  };

  return { nilai, errors, ubah, ubahBanyak, validasi };
}
