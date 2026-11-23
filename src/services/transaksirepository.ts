import AsyncStorage from "@react-native-async-storage/async-storage";
import { TagihanTransfer } from "@/types/pembayaran";
import { StatusTransaksi, Transaksi } from "@/types/transaksi";

export interface TransaksiRepository {
  ambilSemua(): Promise<Transaksi[]>;
  ambil(invoice: string): Promise<Transaksi | null>;
  catatMenunggu(tagihan: TagihanTransfer): Promise<Transaksi>;
  sinkronkanPembayaranLama(tagihan: TagihanTransfer): Promise<void>;
  sinkronkanNgebelanjain(transaksi: Transaksi): Promise<void>;
  perbarui(invoice: string, status: StatusTransaksi, waktu?: number, alasan?: string): Promise<Transaksi | null>;
}

const KUNCI = "belanjaan_pasar:riwayat_transaksi:v1";

function valid(x: unknown): x is Transaksi {
  if (!x || typeof x !== "object") return false;
  const t = x as Record<string, unknown>;
  return typeof t.invoice === "string" && typeof t.total === "number" &&
    typeof t.dibuatPada === "number" && typeof t.diperbaruiPada === "number" &&
    typeof t.dibuatLogPada === "number" &&
    (t.jenisTransaksi === "pesanan" || t.jenisTransaksi === "ngebelanjain") &&
    ["menunggu", "berhasil", "gagal", "kedaluwarsa", "dibatalkan"].includes(String(t.statusTransaksi)) &&
    Array.isArray(t.baris);
}

async function baca(): Promise<Transaksi[]> {
  try {
    const raw = await AsyncStorage.getItem(KUNCI);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter(valid).sort((a, b) => b.dibuatLogPada - a.dibuatLogPada) : [];
  } catch {
    return [];
  }
}

async function simpan(lista: Transaksi[]): Promise<void> {
  await AsyncStorage.setItem(KUNCI, JSON.stringify(lista));
}

const lokal: TransaksiRepository = {
  ambilSemua: baca,
  async ambil(invoice) {
    return (await baca()).find((t) => t.invoice === invoice) ?? null;
  },
  async catatMenunggu(tagihan) {
    const sekarang = Date.now();
    const baru: Transaksi = {
      ...tagihan,
      statusTransaksi: "menunggu",
      jenisTransaksi: "pesanan",
      dibuatLogPada: sekarang,
      diperbaruiPada: sekarang,
    };
    const daftar = (await baca()).filter((t) => t.invoice !== tagihan.invoice);
    await simpan([baru, ...daftar]);
    return baru;
  },
  async sinkronkanPembayaranLama(tagihan) {
    const daftar = await baca();
    if (daftar.some((t) => t.invoice === tagihan.invoice)) return;
    const waktu = tagihan.dibayarPada ?? tagihan.dibuatPada;
    const lama: Transaksi = {
      ...tagihan,
      statusTransaksi: "berhasil",
      jenisTransaksi: "pesanan",
      dibuatLogPada: waktu,
      diperbaruiPada: waktu,
    };
    await simpan([lama, ...daftar].sort((a, b) => b.dibuatLogPada - a.dibuatLogPada));
  },
  async sinkronkanNgebelanjain(transaksi) {
    const daftar = await baca();
    const lama = daftar.find((t) => t.invoice === transaksi.invoice);
    const hasil = {
      ...transaksi,
      jenisTransaksi: "ngebelanjain" as const,
      dibuatLogPada: lama?.dibuatLogPada ?? transaksi.dibuatLogPada,
    };
    await simpan([hasil, ...daftar.filter((t) => t.invoice !== transaksi.invoice)].sort((a, b) => b.dibuatLogPada - a.dibuatLogPada));
  },
  async perbarui(invoice, status, waktu = Date.now(), alasan) {
    const daftar = await baca();
    let hasil: Transaksi | null = null;
    const berikut = daftar.map((t) => {
      if (t.invoice !== invoice) return t;
      hasil = {
        ...t,
        statusTransaksi: status,
        diperbaruiPada: waktu,
        ...(status === "berhasil" ? { dibayarPada: waktu } : {}),
        ...(status === "gagal" ? { gagalPada: waktu, alasanGagal: alasan } : {}),
        ...(status === "kedaluwarsa" || status === "dibatalkan" ? { dibatalkanPada: waktu } : {}),
      };
      return hasil;
    });
    if (hasil) await simpan(berikut);
    return hasil;
  },
};

export const transaksiRepository: TransaksiRepository = lokal;
