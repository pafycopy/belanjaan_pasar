import { Pressable, StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import GambarProduk from "@/components/produk/gambarproduk";
import Nominal from "@/components/ui/nominal";
import { TEKS } from "@/data/teks";
import { colors, radius, spacing } from "@/theme";
import { Pesanan, StatusPesanan } from "@/types/pesanan";
import { infoWaktu, labelPembayaran, ringkasanProduk } from "@/utils/pesanan";
import { cariProduk } from "@/utils/produk";

type Props = {
  pesanan: Pesanan;
  sekarang: number;
  onDetail: () => void;
  onChat: () => void;
  onNilai: () => void;
  onPesanUlang: () => void;
  onLihatFoto: () => void;
  onMajukan?: () => void; // hanya mode pengembangan: tahan lama pada label status = lanjut tahap berikutnya
};

const T = TEKS.pesanan;

const GAYA_STATUS: Record<StatusPesanan, { bg: string; fg: string }> = {
  disiapkan: { bg: colors.orange, fg: colors.white },
  dikirim: { bg: colors.primaryDeep, fg: colors.white },
  selesai: { bg: colors.accentSoftDeep, fg: colors.textSoft },
};

/* ---------- bagian kecil ---------- */

type Varian = "gelap" | "lembut" | "hijau";

function Tombol({ label, varian, onPress, style }: { label: string; varian: Varian; onPress: () => void; style?: StyleProp<ViewStyle> }) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.tombol, VARIAN_TOMBOL[varian].wadah, style]}
      accessibilityRole="button"
    >
      <Text style={[styles.tombolTeks, { color: VARIAN_TOMBOL[varian].teks }]}>{label}</Text>
    </Pressable>
  );
}

const VARIAN_TOMBOL: Record<Varian, { wadah: ViewStyle; teks: string }> = {
  gelap: { wadah: { backgroundColor: colors.dark }, teks: colors.white },
  lembut: { wadah: { backgroundColor: colors.accentSoftStrong }, teks: colors.dark },
  hijau: { wadah: { backgroundColor: colors.primaryDeep }, teks: colors.white },
};

// "06.15 WIB": zona waktu dibuat lebih kecil dan pudar
function Waktu({ teks }: { teks: string }) {
  const wib = teks.endsWith(" WIB");
  return (
    <Text style={styles.waktuNilai}>
      {wib ? teks.slice(0, -4) : teks}
      {wib ? <Text style={styles.zona}> WIB</Text> : null}
    </Text>
  );
}

/* ---------- kartu ---------- */

export default function KartuPesanan({
  pesanan: p,
  sekarang,
  onDetail,
  onChat,
  onNilai,
  onPesanUlang,
  onLihatFoto,
  onMajukan,
}: Props) {
  const gaya = GAYA_STATUS[p.status];
  const waktu = infoWaktu(p, sekarang);
  const ringkas = ringkasanProduk(p);
  const gambar = p.baris[0] ? cariProduk(p.baris[0].produkId)?.gambar : undefined;
  const antar = p.pengiriman === "antar";
  const titik = p.titikAntar ?? T.titikAntarKosong;

  return (
    <View style={styles.kartu}>
      {/* baris atas: status + no. pesanan | waktu */}
      <View style={styles.atas}>
        <View style={styles.atasKiri}>
          <Pressable onLongPress={onMajukan} delayLongPress={700} disabled={!onMajukan} style={[styles.badge, { backgroundColor: gaya.bg }]}>
            <Text style={[styles.badgeTeks, { color: gaya.fg }]}>{T.status[p.status]}</Text>
          </Pressable>
          <Text style={styles.noPesanan}>{T.noPesanan(p.invoice)}</Text>
        </View>
        <View style={styles.atasKanan}>
          <Text style={styles.waktuLabel}>{waktu.label}</Text>
          <Waktu teks={waktu.nilai} />
        </View>
      </View>

      {/* produk */}
      <Pressable onPress={onDetail} style={styles.produk} accessibilityRole="button">
        <GambarProduk gambar={gambar} style={styles.gambar} fit="contain" />
        <View style={styles.produkInfo}>
          <Text style={styles.produkNama} numberOfLines={2}>
            {ringkas.nama}
          </Text>
          {ringkas.deskripsi ? <Text style={styles.produkDeskripsi}>{ringkas.deskripsi}</Text> : null}
        </View>
      </Pressable>

      {/* kotak tambahan: lokasi antar (dikirim) / bukti foto (selesai) */}
      {p.status === "dikirim" && antar ? (
        <View style={styles.kotak}>
          <Ionicons name="location-outline" size={20} color={colors.dark} />
          <View style={styles.kotakIsi}>
            <Text style={styles.kotakJudul}>{titik}</Text>
            <Text style={styles.kotakAlamat} numberOfLines={2}>
              {p.alamat ?? ""}
            </Text>
          </View>
        </View>
      ) : null}

      {p.status === "selesai" && antar ? (
        <View style={styles.kotak}>
          <View style={styles.foto}>
            <Ionicons name="image-outline" size={18} color={colors.placeholder} />
          </View>
          <View style={styles.kotakIsi}>
            <Text style={styles.kotakJudul}>{T.buktiFoto(titik)}</Text>
            <Text style={styles.kotakKet}>{T.buktiKet}</Text>
          </View>
          <Pressable onPress={onLihatFoto} hitSlop={8} style={styles.lihatFoto} accessibilityRole="button">
            <Text style={styles.lihatFotoTeks}>{T.lihatFoto}</Text>
            <Ionicons name="chevron-forward" size={14} color={colors.dark} />
          </Pressable>
        </View>
      ) : null}

      {/* pembayaran + total */}
      <View style={styles.bayar}>
        <Text style={styles.bayarLabel}>{labelPembayaran(p)}</Text>
        <Nominal nilai={p.total} ukuran={20} />
      </View>

      {/* tombol sesuai status */}
      {p.status === "disiapkan" ? <Tombol label={T.aksi.detail} varian="gelap" onPress={onDetail} /> : null}
      {p.status === "dikirim" ? <Tombol label={T.aksi.chat} varian="lembut" onPress={onChat} /> : null}
      {p.status === "selesai" ? (
        <View style={styles.tombolBaris}>
          <Tombol label={T.aksi.nilai} varian="lembut" onPress={onNilai} style={styles.tombolBagi} />
          <Tombol label={T.aksi.ulang} varian="hijau" onPress={onPesanUlang} style={styles.tombolBagi} />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  kartu: {
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    padding: spacing.lg,
    gap: spacing.md,
    shadowColor: colors.shadow,
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  atas: { flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between", gap: spacing.md },
  atasKiri: { gap: 6, flexShrink: 1 },
  badge: { alignSelf: "flex-start", borderRadius: radius.xl, paddingHorizontal: spacing.md, paddingVertical: 3 },
  badgeTeks: { fontSize: 11, fontWeight: "800" },
  noPesanan: { fontSize: 11, color: colors.textSoft },
  atasKanan: { alignItems: "flex-end", gap: 2 },
  waktuLabel: { fontSize: 10, fontWeight: "800", letterSpacing: 0.4, textTransform: "uppercase", color: colors.textStrong },
  waktuNilai: { fontSize: 14, fontWeight: "800", color: colors.textStrong },
  zona: { fontSize: 11, fontWeight: "500", color: colors.muted },
  produk: { flexDirection: "row", alignItems: "center", gap: spacing.md },
  gambar: { width: 72, height: 72, borderRadius: radius.md, backgroundColor: colors.accentSoftStrong },
  produkInfo: { flex: 1, gap: 2 },
  produkNama: { fontSize: 14, fontWeight: "800", color: colors.text },
  produkDeskripsi: { fontSize: 12, color: colors.textSoft },
  kotak: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    backgroundColor: colors.accentSoft,
    borderRadius: radius.md,
    padding: spacing.md,
  },
  kotakIsi: { flex: 1, gap: 2 },
  kotakJudul: { fontSize: 12, fontWeight: "800", color: colors.text },
  kotakAlamat: { fontSize: 11, lineHeight: 16, color: colors.textSoft },
  kotakKet: { fontSize: 11, color: colors.dark },
  foto: {
    width: 40,
    height: 40,
    borderRadius: radius.sm,
    backgroundColor: colors.accentSoftStrong,
    alignItems: "center",
    justifyContent: "center",
  },
  lihatFoto: { flexDirection: "row", alignItems: "center", gap: 2 },
  lihatFotoTeks: { fontSize: 12, fontWeight: "800", color: colors.dark },
  bayar: { flexDirection: "row", alignItems: "baseline", justifyContent: "space-between", gap: spacing.md },
  bayarLabel: { flexShrink: 1, fontSize: 12, color: colors.textSoft },
  tombol: { minHeight: 46, borderRadius: radius.lg, alignItems: "center", justifyContent: "center", paddingHorizontal: spacing.md },
  tombolTeks: { fontSize: 13, fontWeight: "800" },
  tombolBaris: { flexDirection: "row", gap: spacing.md },
  tombolBagi: { flex: 1 },
});
