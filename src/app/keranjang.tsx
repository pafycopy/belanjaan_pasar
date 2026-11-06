import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useMemo, useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import HeaderHijau from "@/components/ui/headerhijau";
import FooterBar from "@/components/ui/footerbar";
import ItemKeranjangCard from "@/components/keranjang/itemkeranjang";
import KapasitasBerat from "@/components/keranjang/kapasitasberat";
import OpsiPengiriman from "@/components/keranjang/pengiriman";
import AlamatPengantaran from "@/components/keranjang/alamatpengantaran";
import RingkasanPembayaran from "@/components/keranjang/ringkasanpembayaran";
import RekomendasiProduk from "@/components/keranjang/rekomendasiproduk";
import { useKeranjang } from "@/context/keranjang";
import { useAlamat } from "@/context/alamat";
import { DAFTAR_PRODUK } from "@/data/produk";
import { IdPengiriman, KAPASITAS_KERANJANG_KG, PENGIRIMAN_BAWAAN } from "@/data/keranjang";
import { TEKS } from "@/data/teks";
import { barisDenganProduk, hitungBeratGram } from "@/utils/keranjang";
import { cariProduk } from "@/utils/produk";
import { colors, spacing } from "@/theme";

const T = TEKS.keranjang;
const GAMBAR_KOSONG = require("../../assets/images/keranjang/empty-cart.svg");

export default function Keranjang() {
  const router = useRouter();
  const { item, subtotal, memuat, ubahJumlah, hapus } = useKeranjang();
  const { terpilih } = useAlamat();
  const [pengiriman, setPengiriman] = useState<IdPengiriman>(PENGIRIMAN_BAWAAN);
  const antar = pengiriman === "antar";

  const baris = useMemo(() => barisDenganProduk(item, cariProduk), [item]);
  const beratGram = hitungBeratGram(baris);
  const kosong = !memuat && baris.length === 0;

  const bayar = () => {
    if (antar && !terpilih) {
      Alert.alert(T.alamatBelumDipilih.judul, T.alamatBelumDipilih.pesan, [
        { text: T.alamatBelumDipilih.pilih, onPress: () => router.push("/alamat") },
        { text: TEKS.batal, style: "cancel" },
      ]);
      return;
    }
    Alert.alert(T.pembayaranBelumAda.judul, T.pembayaranBelumAda.pesan);
  };

  return (
    <View style={styles.screen}>
      <HeaderHijau judul={T.judul} />

      {kosong ? (
        <ScrollView
          style={styles.emptyScroll}
          contentContainerStyle={styles.emptyContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.emptyHero}>
            <Image source={GAMBAR_KOSONG} style={styles.emptyImage} contentFit="contain" />
            <Text style={styles.emptyTitle}>{T.kosong.judul}</Text>
          </View>

          <RekomendasiProduk
            produk={DAFTAR_PRODUK}
            onPress={(produk) => router.push({ pathname: "/produk/[id]", params: { id: produk.id } })}
          />
        </ScrollView>
      ) : (
        <>
          <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
            <KapasitasBerat beratGram={beratGram} kapasitasKg={KAPASITAS_KERANJANG_KG} />

            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>{T.pesananSaya}</Text>
                <Text style={styles.count}>{T.jumlahProduk(item.length)}</Text>
              </View>

              <View style={styles.list}>
                {baris.map(({ item: i, produk }) => (
                  <ItemKeranjangCard
                    key={i.uid}
                    item={i}
                    produk={produk}
                    onKurang={() => void ubahJumlah(i.uid, i.jumlah - 1)}
                    onTambah={() => void ubahJumlah(i.uid, i.jumlah + 1)}
                    onHapus={() => void hapus(i.uid)}
                  />
                ))}
              </View>
            </View>

            <View style={styles.section}>
              <OpsiPengiriman dipilih={pengiriman} onChange={setPengiriman} />
            </View>

            {antar ? (
              <View style={styles.section}>
                <AlamatPengantaran alamat={terpilih} />
              </View>
            ) : null}

            <View style={styles.paymentHint}>
              <Ionicons name="card-outline" size={15} color={colors.primary} />
              <View style={styles.paymentText}>
                <Text style={styles.paymentTitle}>{T.pembayaran.judul}</Text>
                <Text style={styles.paymentSubtitle}>{T.pembayaran.keterangan}</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color={colors.muted} />
            </View>
          </ScrollView>

          <FooterBar bordered={false} background={colors.white}>
            <RingkasanPembayaran total={subtotal} onBayar={bayar} />
          </FooterBar>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.surface },
  content: { paddingBottom: spacing.lg },
  section: { paddingHorizontal: spacing.lg, marginTop: spacing.md },
  sectionHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: spacing.sm },
  sectionTitle: { fontSize: 12, fontWeight: "700", color: colors.text },
  count: { fontSize: 9, color: colors.muted },
  list: { gap: spacing.sm },
  paymentHint: { marginHorizontal: spacing.lg, marginTop: spacing.md, marginBottom: spacing.lg, padding: spacing.md, backgroundColor: colors.white, borderRadius: 10, flexDirection: "row", alignItems: "center", gap: spacing.sm },
  paymentText: { flex: 1 },
  paymentTitle: { fontSize: 11, fontWeight: "700", color: colors.text },
  paymentSubtitle: { fontSize: 9, color: colors.muted, marginTop: 2 },
  emptyScroll: { flex: 1 },
  emptyContent: { paddingBottom: spacing.xl },
  emptyHero: { minHeight: 400, alignItems: "center", justifyContent: "center", paddingTop: spacing.md },
  emptyImage: { width: 145, height: 145 },
  emptyTitle: { fontSize: 16, fontWeight: "700", color: colors.text, marginTop: 2 },
});
