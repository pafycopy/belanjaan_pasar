import { useCallback, useEffect, useState } from "react";
import { BackHandler, Pressable, ScrollView, Share, StyleSheet, Text, View } from "react-native";
import { Stack, useFocusEffect, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Button from "@/components/ui/button";
import FooterBar from "@/components/ui/footerbar";
import ScreenState from "@/components/ui/screenstate";
import DanaMasuk from "@/components/pembayaran/danamasuk";
import IkonBerhasil from "@/components/pembayaran/ikonberhasil";
import JadwalPesanan from "@/components/pembayaran/jadwalpesanan";
import { BarisProduk } from "@/components/pembayaran/ringkasanpesanan";
import { REKENING_BCA } from "@/data/pembayaran";
import { TEKS } from "@/data/teks";
import { pembayaranRepository } from "@/services/pembayaranrepository";
import { colors, radius, spacing } from "@/theme";
import { TagihanTransfer } from "@/types/pembayaran";
import { buatTeksBukti } from "@/utils/pembayaran";
import { formatWaktuLengkapWib } from "@/utils/waktu";

const T = TEKS.berhasil;

/* ---------- pembungkus: muat pembayaran yang sudah lunas ---------- */

export default function PembayaranBerhasil() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [tagihan, setTagihan] = useState<TagihanTransfer | null>(null);
  const [memuat, setMemuat] = useState(true);

  useEffect(() => {
    let aktif = true;
    pembayaranRepository
      .ambilLunas()
      .then((t) => {
        if (aktif) setTagihan(t);
      })
      .finally(() => {
        if (aktif) setMemuat(false);
      });
    return () => {
      aktif = false;
    };
  }, []);

  const keBeranda = useCallback(() => router.dismissTo("/"), [router]);

  // Tombol kembali HP menuju Beranda, bukan ke keranjang yang sudah kosong
  useFocusEffect(
    useCallback(() => {
      const sub = BackHandler.addEventListener("hardwareBackPress", () => {
        keBeranda();
        return true;
      });
      return () => sub.remove();
    }, [keBeranda])
  );

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <Stack.Screen options={{ headerShown: false, gestureEnabled: false }} />

      {memuat ? (
        <ScreenState loading />
      ) : tagihan ? (
        <IsiBerhasil tagihan={tagihan} />
      ) : (
        <ScreenState message={T.tidakDitemukan} />
      )}

      <FooterBar bordered={false} background={colors.barBg}>
        <View style={styles.footerBaris}>
          <Pressable
            onPress={keBeranda}
            style={styles.beranda}
            accessibilityRole="button"
            accessibilityLabel={T.keBeranda}
          >
            <Ionicons name="home-outline" size={22} color={colors.dark} />
          </Pressable>
          <Button
            label={T.lihatPesanan}
            size="lg"
            onPress={() => router.dismissTo("/pesanan")}
            style={styles.lihat}
          />
        </View>
      </FooterBar>
    </View>
  );
}

/* ---------- isi: ikon, dana masuk, jadwal, ringkasan, e-receipt ---------- */

function IsiBerhasil({ tagihan }: { tagihan: TagihanTransfer }) {
  // E-receipt sementara berupa teks lewat menu Bagikan bawaan HP (bisa disalin / dikirim / disimpan)
  const simpanBukti = async () => {
    try {
      await Share.share({ title: T.bukti, message: buatTeksBukti(tagihan, REKENING_BCA) });
    } catch {
      // dibatalkan atau gagal membuka menu bagikan: tidak perlu pesan
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.hero}>
        <IkonBerhasil />
        <Text style={styles.judul}>{T.judul}</Text>
        <Text style={styles.pesan}>{T.pesan(REKENING_BCA.bank)}</Text>
        <View style={styles.waktu}>
          <Ionicons name="time-outline" size={14} color={colors.textSoft} />
          <Text style={styles.waktuTeks}>
            {formatWaktuLengkapWib(tagihan.dibayarPada ?? tagihan.dibuatPada)}
          </Text>
        </View>
      </View>

      <View style={styles.seksi}>
        <DanaMasuk
          total={tagihan.total}
          invoice={tagihan.invoice}
          bank={REKENING_BCA.bank}
          nomor={REKENING_BCA.nomor}
          namaAkun={REKENING_BCA.namaAkun}
        />
      </View>

      <View style={styles.seksi}>
        <JadwalPesanan tagihan={tagihan} />
      </View>

      <View style={styles.seksi}>
        <View style={styles.kartu}>
          <View style={styles.kartuJudulBaris}>
            <Text style={styles.kartuJudul}>{T.ringkasan.judul}</Text>
            <Text style={styles.jumlahItem}>{T.ringkasan.item(tagihan.baris.length)}</Text>
          </View>
          <View style={styles.daftar}>
            {tagihan.baris.map((b, i) => (
              <BarisProduk key={`${b.produkId}-${i}`} baris={b} />
            ))}
          </View>
        </View>
      </View>

      <View style={styles.seksi}>
        <Pressable onPress={() => void simpanBukti()} style={styles.bukti} accessibilityRole="button">
          <Ionicons name="receipt-outline" size={20} color={colors.dark} />
          <Text style={styles.buktiTeks}>{T.bukti}</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.canvas },
  content: { paddingBottom: spacing.lg },
  hero: { alignItems: "center", gap: spacing.sm, paddingTop: spacing.lg, paddingHorizontal: spacing.lg },
  judul: { fontSize: 22, fontWeight: "800", color: colors.textStrong, marginTop: spacing.sm },
  pesan: { fontSize: 13, lineHeight: 19, color: colors.textSoft, textAlign: "center" },
  waktu: { flexDirection: "row", alignItems: "center", gap: 6 },
  waktuTeks: { fontSize: 12, color: colors.textSoft },
  seksi: { paddingHorizontal: spacing.lg, marginTop: spacing.md },
  kartu: { backgroundColor: colors.white, borderRadius: radius.lg, padding: spacing.lg, gap: spacing.md },
  kartuJudulBaris: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  kartuJudul: { fontSize: 15, fontWeight: "800", color: colors.text },
  jumlahItem: { fontSize: 12, fontWeight: "700", color: colors.dark },
  daftar: { gap: spacing.sm },
  bukti: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    paddingVertical: spacing.lg,
  },
  buktiTeks: { fontSize: 14, fontWeight: "700", color: colors.dark },
  footerBaris: { flexDirection: "row", alignItems: "center", gap: spacing.md },
  beranda: {
    width: 52,
    height: 52,
    borderRadius: radius.lg,
    backgroundColor: colors.accentSoftStrong,
    alignItems: "center",
    justifyContent: "center",
  },
  lihat: { flex: 1 },
});
