import { useEffect, useState } from "react";

// Waktu sekarang (ms) yang diperbarui berkala, untuk hitung mundur
export function useSekarang(intervalMs: number = 1000): number {
  const [sekarang, setSekarang] = useState(() => Date.now());

  useEffect(() => {
    const timer = setInterval(() => setSekarang(Date.now()), intervalMs);
    return () => clearInterval(timer);
  }, [intervalMs]);

  return sekarang;
}
