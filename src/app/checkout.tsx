import { useMemo, useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import HeaderHijau from "@/components/ui/headerhijau";
import FooterBar from "@/components/ui/footerbar";
import ScreenState from "@/components/ui/screenstate";
import MetodePembayaranList from "@/components/keranjang/metodepembayaran";
import RincianPembayaran from "@/components/keranjang/rincianpembayaran";
import KapasitasBerat from "@/components/keranjang/kapasitasberat";
import AlamatPengantaran from "@/components/keranjang/alamatpengantaran";
import OpsiPengiriman from "@/components/keranjang/pengiriman";
import ProdukCheckout from "@/components/checkout/produkcheckout";
import RingkasanPembayaran from "@/components/keranjang/ringkasanpembayaran";
import { useAlamat } from "@/context/alamat";
import { useKeranjang } from "@/context/keranjang";
import {
  IdMetode,
  METODE_BAWAAN,
  METODE_PEMBAYARAN,
  PENGIRIMAN_BAWAAN,
  KAPASITAS_KERANJANG_KG,
} from "@/data/keranjang";
import { TEKS } from "@/data/teks";
import { pembayaranRepository } from "@/services/pembayaranrepository";
import { transaksiRepository } from "@/services/transaksirepository";
import { colors, spacing } from "@/theme";
import { formatAlamatLengkap } from "@/utils/alamat";
import { barisDenganProduk, cariTarifOngkir, hitungBeratGram, hitungSubtotal, hitungTagihan } from "@/utils/keranjang";
import { buatTagihanTransfer } from "@/utils/pembayaran";
import { cariProduk, formatHarga } from "@/utils/produk";

const T = TEKS.keranjang;

type Params = { uids?: string };

// Halaman Pembayaran: pilih metode bayar untuk produk yang dipilih di keranjang
export default function Checkout() {
  const router = useRouter();
  const { uids } = useLocalSearchParams<Params>();
  const { item, memuat } = useKeranjang();
  const { terpilih } = useAlamat();
  const [pengiriman, setPengiriman] = useState<"antar" | "ambil">(PENGIRIMAN_BAWAAN);
  const [metode, setMetode] = useState<IdMetode>(METODE_BAWAAN);
  const [membuatTagihan, setMembuatTagihan] = useState(false);

  const antar = pengiriman === "antar";

  // Hanya produk yang dipilih di keranjang (daftar uid dikirim lewat parameter halaman)
  const daftarUid = useMemo(() => (uids ? uids.split(",") : []), [uids]);
  const baris = useMemo(
    () => barisDenganProduk(item, cariProduk).filter(({ item: i }) => daftarUid.includes(i.uid)),
    [item, daftarUid]
  );

  const beratGram = hitungBeratGram(baris);
  const tarif = antar && terpilih ? cariTarifOngkir(terpilih.jarakKm) : null;
  const tagihan = hitungTagihan(hitungSubtotal(baris), tarif);

  const bayar = async () => {
    if (membuatTagihan || baris.length === 0) return;
    if (antar && !terpilih) {
      Alert.alert("Alamat belum dipilih", "Pilih alamat pengantaran terlebih dahulu.", [
        { text: "Pilih alamat", onPress: () => router.push({ pathname: "/alamat", params: { fromCheckout: "1" } }) },
        { text: TEKS.batal, style: "cancel" },
      ]);
      return;
    }

    // Sementara hanya transfer BCA (manual) yang punya halaman petunjuk. QRIS dan COD menyusul.
    if (metode !== "bca") {
      const namaMetode = METODE_PEMBAYARAN.find((m) => m.id === metode)?.nama ?? "";
      Alert.alert(T.pembayaranBelumAda.judul, T.pembayaranBelumAda.pesan(namaMetode, formatHarga(tagihan.total)));
      return;
    }

    setMembuatTagihan(true);
    try {
      const tagihanBaru = buatTagihanTransfer({
        baris,
        tagihan,
        tarif,
        pengiriman,
        metode,
        alamat: terpilih ? formatAlamatLengkap(terpilih) : undefined,
      });
      await pembayaranRepository.simpan(tagihanBaru);
      await transaksiRepository.catatMenunggu(tagihanBaru);
      router.push("/pembayaran");
    } catch {
      Alert.alert(TEKS.pembayaran.gagalBuat.judul, TEKS.pembayaran.gagalBuat.pesan);
    } finally {
      setMembuatTagihan(false);
    }
  };

  return (
    <View style={styles.screen}>
      <HeaderHijau judul={T.pembayaran.judul} />

      {memuat ? (
        <ScreenState loading />
      ) : baris.length === 0 ? (
        <ScreenState message={T.checkoutKosong} />
      ) : (
        <>
          <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
            <View style={[styles.section, styles.sectionBerat]}>
              <KapasitasBerat beratGram={beratGram} kapasitasKg={KAPASITAS_KERANJANG_KG} />
            </View>

            <View style={styles.section}>
              <OpsiPengiriman dipilih={pengiriman} onChange={setPengiriman} />
            </View>

            {antar ? (
              <View style={styles.section}>
                <AlamatPengantaran alamat={terpilih} fromCheckout />
              </View>
            ) : null}

            <View style={styles.section}>
              <ProdukCheckout baris={baris} />
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{T.metode}</Text>
              <MetodePembayaranList dipilih={metode} onPilih={setMetode} />
            </View>

            <View style={styles.section}>
              <RincianPembayaran
                subtotal={tagihan.subtotal}
                ongkir={tarif ? tagihan.ongkir : null}
                labelOngkir={tarif?.label}
                total={tagihan.total}
              />
            </View>
          </ScrollView>

          <FooterBar bordered={false} background={colors.barBg}>
            <RingkasanPembayaran
              total={tagihan.total}
              label={T.ringkasan.bayar}
              onPress={() => void bayar()}
              disabled={membuatTagihan}
            />
          </FooterBar>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.canvas },
  content: { paddingBottom: spacing.lg },
  section: { paddingHorizontal: spacing.lg, marginTop: spacing.md },
  sectionBerat: { paddingHorizontal: 0, marginTop: spacing.md },
  sectionTitle: { fontSize: 14, fontWeight: "700", color: colors.text },
});
