import { IdMetode } from "@/data/keranjang";
import { StatusPesanan } from "@/types/pesanan";

export const TAB_PESANAN: readonly { id: StatusPesanan; label: string }[] = [
  { id: "disiapkan", label: "Disiapkan" },
  { id: "dikirim", label: "Sedang dikirim" },
  { id: "selesai", label: "Selesai" },
];

// Nama metode bayar singkat untuk kartu pesanan
export const LABEL_METODE_PESANAN: Record<IdMetode, string> = {
  bca: "Transfer BCA",
  qris: "QRIS Instan",
  cod: "COD Tunai",
};

// Data contoh sementara (nanti dari kurir / server)
export const TITIK_ANTAR_CONTOH = "Cantolan Pagar Depan";
export const ESTIMASI_TIBA_CONTOH = "06.15 WIB";
