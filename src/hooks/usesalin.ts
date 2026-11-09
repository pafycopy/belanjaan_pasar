import { useCallback, useEffect, useRef, useState } from "react";
import * as Clipboard from "expo-clipboard";

// Salin teks ke clipboard; `tersalin` berisi kunci yang baru disalin selama beberapa detik
// (untuk mengubah label tombol jadi "Tersalin").
export function useSalin<K extends string = string>(durasiMs: number = 2000) {
  const [tersalin, setTersalin] = useState<K | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  const salin = useCallback(
    async (kunci: K, nilai: string) => {
      try {
        await Clipboard.setStringAsync(nilai);
      } catch {
        return; // gagal menyalin: jangan tampilkan "Tersalin"
      }
      setTersalin(kunci);
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setTersalin(null), durasiMs);
    },
    [durasiMs]
  );

  return { tersalin, salin };
}
