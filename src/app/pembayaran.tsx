import { useEffect, useState } from "react";
import { Alert, ScrollView, StyleSheet, View } from "react-native";
import { useRouter } from "expo-router";
import HeaderHijau from "@/components/ui/headerhijau";
import FooterBar from "@/components/ui/footerbar";
import Button from "@/components/ui/button";
import ScreenState from "@/components/ui/screenstate";
import BatasBayar from "@/components/pembayaran/batasbayar";
import RekeningTransfer from "@/components/pembayaran/rekeningtransfer";
import RingkasanPesanan from "@/components/pembayaran/ringkasanpesanan";
import PetunjukPembayaran from "@/components/pembayaran/petunjukpembayaran";
import { useKeranjang } from "@/context/keranjang";
import { usePesanan } from "@/context/pesanan";
import { PETUNJUK_BCA, REKENING_BCA } from "@/data/pembayaran";
import { TEKS } from "@/data/teks";
import { useSekarang } from "@/hooks/usesekarang";
import { pembayaranRepository } from "@/services/pembayaranrepository";
import { colors, spacing } from "@/theme";
import { TagihanTransfer } from "@/types/pembayaran";
import { sisaDetik } from "@/utils/pembayaran";
import { buatPesanan } from "@/utils/pesanan";
import { formatHarga } from "@/utils/produk";

const T = TEKS.pembayaran;

/* ---------- pembungkus: muat tagihan yang tersimpan ---------- */

export default function Pembayaran() {
  const [tagihan, setTagihan] = useState<TagihanTransfer | null>(null);
  const [memuat, setMemuat] = useState(true);

  useEffect(() => {
    let aktif = true;
    pembayaranRepository
      .ambil()
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

  return (
    <View style={styles.screen}>
      <HeaderHijau judul={T.judul} />
      {memuat ? (
        <ScreenState loading />
      ) : tagihan ? (
        <IsiPembayaran tagihan={tagihan} />
      ) : (
        <ScreenState message={T.tidakDitemukan} />
      )}
    </View>
  );
}

/* ---------- isi: hitung mundur, rekening, ringkasan, petunjuk ---------- */

function IsiPembayaran({ tagihan }: { tagihan: TagihanTransfer }) {
  const router = useRouter();
  const { kosongkan } = useKeranjang();
  const { tambah: tambahPesanan } = usePesanan();
  const sekarang = useSekarang();
  const [menyelesaikan, setMenyelesaikan] = useState(false);

  const sisa = sisaDetik(tagihan.batasBayar, sekarang);
  const habis = sisa === 0;
  const totalTeks = formatHarga(tagihan.total);

  // Sementara belum ada verifikasi otomatis: pelanggan menyatakan sudah transfer, tagihan dicatat
  // sebagai lunas, keranjang dikosongkan, lalu tampil layar "Pembayaran Berhasil".
  const selesai = async () => {
    if (menyelesaikan) return;
    setMenyelesaikan(true);
    try {
      const lunas: TagihanTransfer = { ...tagihan, dibayarPada: Date.now() };
      await pembayaranRepository.simpanLunas(lunas);
      await tambahPesanan(buatPesanan(lunas)); // muncul di tab Pesanan > Disiapkan
      await kosongkan();
      await pembayaranRepository.hapus();
      router.replace("/pembayaran-berhasil");
    } catch {
      setMenyelesaikan(false);
      Alert.alert(TEKS.peringatan.gagalSimpan.judul, TEKS.peringatan.gagalSimpan.pesan);
    }
  };

  const konfirmasi = () =>
    Alert.alert(T.konfirmasi.judul, T.konfirmasi.pesan(totalTeks), [
      { text: TEKS.batal, style: "cancel" },
      { text: T.konfirmasi.ya, onPress: () => void selesai() },
    ]);

  return (
    <>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.seksiPertama}>
          <BatasBayar sisaDetik={sisa} bank={REKENING_BCA.bank} />
        </View>

        {/* Setelah waktu habis, rekening dan petunjuk disembunyikan supaya tidak ada transfer terlambat */}
        {habis ? null : (
          <View style={styles.seksi}>
            <RekeningTransfer
              bank={REKENING_BCA.bank}
              nomor={REKENING_BCA.nomor}
              namaAkun={REKENING_BCA.namaAkun}
              total={tagihan.total}
            />
          </View>
        )}

        <View style={styles.seksi}>
          <RingkasanPesanan tagihan={tagihan} />
        </View>

        {habis ? null : (
          <View style={styles.seksi}>
            <PetunjukPembayaran
              petunjuk={PETUNJUK_BCA}
              data={{ nomor: REKENING_BCA.nomor, namaAkun: REKENING_BCA.namaAkun, total: totalTeks }}
            />
          </View>
        )}
      </ScrollView>

      <FooterBar bordered={false} background={colors.barBg}>
        {habis ? (
          <Button label={T.kembaliKeranjang} onPress={() => router.back()} />
        ) : (
          <Button
            label={T.sudahTransfer}
            icon="checkmark-circle-outline"
            onPress={konfirmasi}
            loading={menyelesaikan}
          />
        )}
      </FooterBar>
    </>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.canvas },
  content: { paddingBottom: spacing.lg },
  seksiPertama: { paddingHorizontal: spacing.lg, marginTop: spacing.md },
  seksi: { paddingHorizontal: spacing.lg, marginTop: spacing.md },
});
