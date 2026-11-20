import { useMemo, useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import HeaderHijau from "@/components/ui/headerhijau";
import FooterBar from "@/components/ui/footerbar";
import ScreenState from "@/components/ui/screenstate";
import MetodePembayaranList from "@/components/keranjang/metodepembayaran";
import RincianPembayaran from "@/components/keranjang/rincianpembayaran";
import RingkasanPembayaran from "@/components/keranjang/ringkasanpembayaran";
import { useAlamat } from "@/context/alamat";
import { useKeranjang } from "@/context/keranjang";
import {
  IdMetode,
  METODE_BAWAAN,
  METODE_PEMBAYARAN,
  OPSI_PENGIRIMAN,
  PENGIRIMAN_BAWAAN,
} from "@/data/keranjang";
import { TEKS } from "@/data/teks";
import { pembayaranRepository } from "@/services/pembayaranrepository";
import { colors, spacing } from "@/theme";
import { formatAlamatLengkap } from "@/utils/alamat";
import { barisDenganProduk, cariTarifOngkir, hitungSubtotal, hitungTagihan } from "@/utils/keranjang";
import { buatTagihanTransfer } from "@/utils/pembayaran";
import { cariProduk, formatHarga } from "@/utils/produk";

const T = TEKS.keranjang;

type Params = { uids?: string; kirim?: string };

// Halaman Pembayaran: pilih metode bayar untuk produk yang dipilih di keranjang
export default function Checkout() {
  const router = useRouter();
  const { uids, kirim } = useLocalSearchParams<Params>();
  const { item, memuat } = useKeranjang();
  const { terpilih } = useAlamat();
  const [metode, setMetode] = useState<IdMetode>(METODE_BAWAAN);
  const [membuatTagihan, setMembuatTagihan] = useState(false);

  const pengiriman = OPSI_PENGIRIMAN.find((o) => o.id === kirim)?.id ?? PENGIRIMAN_BAWAAN;
  const antar = pengiriman === "antar";

  // Hanya produk yang dipilih di keranjang (daftar uid dikirim lewat parameter halaman)
  const daftarUid = useMemo(() => (uids ? uids.split(",") : []), [uids]);
  const baris = useMemo(
    () => barisDenganProduk(item, cariProduk).filter(({ item: i }) => daftarUid.includes(i.uid)),
    [item, daftarUid]
  );

  const tarif = antar ? cariTarifOngkir(terpilih?.jarakKm) : null;
  const tagihan = hitungTagihan(hitungSubtotal(baris), tarif);

  const bayar = async () => {
    if (membuatTagihan || baris.length === 0) return;

    // Sementara hanya transfer BCA (manual) yang punya halaman petunjuk. QRIS dan COD menyusul.
    if (metode !== "bca") {
      const namaMetode = METODE_PEMBAYARAN.find((m) => m.id === metode)?.nama ?? "";
      Alert.alert(T.pembayaranBelumAda.judul, T.pembayaranBelumAda.pesan(namaMetode, formatHarga(tagihan.total)));
      return;
    }

    setMembuatTagihan(true);
    try {
      await pembayaranRepository.simpan(
        buatTagihanTransfer({
          baris,
          tagihan,
          tarif,
          pengiriman,
          metode,
          alamat: terpilih ? formatAlamatLengkap(terpilih) : undefined,
        })
      );
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
  section: { paddingHorizontal: spacing.lg, marginTop: spacing.xl },
  sectionTitle: { fontSize: 14, fontWeight: "700", color: colors.text },
});
