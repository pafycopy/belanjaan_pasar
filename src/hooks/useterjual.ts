import { useMemo } from "react";
import { usePesanan } from "@/context/pesanan";
import { hitungTerjualHariIni } from "@/utils/terlaris";

/** Unit satu produk yang terjual hari ini (dari pesanan yang sudah dibayar). 0 bila belum ada. */
export function useTerjualHariIni(produkId: string): number {
  const { pesanan } = usePesanan();
  return useMemo(() => hitungTerjualHariIni(pesanan).get(produkId) ?? 0, [pesanan, produkId]);
}
