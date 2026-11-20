import { Image } from "expo-image";
import { useMemo, useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import HeaderHijau from "@/components/ui/headerhijau";
import FooterBar from "@/components/ui/footerbar";
import ItemKeranjangCard from "@/components/keranjang/itemkeranjang";
import PilihSemua from "@/components/keranjang/pilihsemua";
import KapasitasBerat from "@/components/keranjang/kapasitasberat";
import OpsiPengiriman from "@/components/keranjang/pengiriman";
import AlamatPengantaran from "@/components/keranjang/alamatpengantaran";
import RincianPembayaran from "@/components/keranjang/rincianpembayaran";
import RingkasanPembayaran from "@/components/keranjang/ringkasanpembayaran";
import RekomendasiProduk from "@/components/keranjang/rekomendasiproduk";
import { useKeranjang } from "@/context/keranjang";
import { useAlamat } from "@/context/alamat";
import { DAFTAR_PRODUK } from "@/data/produk";
import { IdPengiriman, KAPASITAS_KERANJANG_KG, PENGIRIMAN_BAWAAN } from "@/data/keranjang";
import { TEKS } from "@/data/teks";
import {
  barisDenganProduk,
  cariTarifOngkir,
  hitungBeratGram,
  hitungSubtotal,
  hitungTagihan,
} from "@/utils/keranjang";
import { cariProduk } from "@/utils/produk";
import { colors, spacing } from "@/theme";

const T = TEKS.keranjang;
const GAMBAR_KOSONG = require("../../assets/images/keranjang/empty-cart.svg");

export default function Keranjang() {
  const router = useRouter();
  const { item, memuat, ubahJumlah, hapus } = useKeranjang();
  const { terpilih } = useAlamat();
  const [pengiriman, setPengiriman] = useState<IdPengiriman>(PENGIRIMAN_BAWAAN);
  const [dipilih, setDipilih] = useState<ReadonlySet<string>>(new Set());
  const [terscroll, setTerscroll] = useState(false);
  const antar = pengiriman === "antar";

  const baris = useMemo(() => barisDenganProduk(item, cariProduk), [item]);
  const kosong = !memuat && baris.length === 0;

  // Hanya produk yang dipilih (radio) yang dihitung berat dan tagihannya
  const barisDipilih = useMemo(() => baris.filter(({ item: i }) => dipilih.has(i.uid)), [baris, dipilih]);
  const adaDipilih = barisDipilih.length > 0;
  const semuaDipilih = baris.length > 0 && barisDipilih.length === baris.length;
  const beratGram = hitungBeratGram(barisDipilih);

  // Ongkir hanya untuk "Antar ke Rumah"
  const tarif = antar ? cariTarifOngkir(terpilih?.jarakKm) : null;
  const tagihan = hitungTagihan(hitungSubtotal(barisDipilih), tarif);

  const pilihItem = (uid: string) =>
    setDipilih((sebelumnya) => {
      const baru = new Set(sebelumnya);
      if (baru.has(uid)) baru.delete(uid);
      else baru.add(uid);
      return baru;
    });

  const pilihSemua = () => setDipilih(semuaDipilih ? new Set() : new Set(baris.map(({ item: i }) => i.uid)));

  // Pilihan metode dan pembuatan tagihan ada di halaman Pembayaran (/checkout)
  const checkout = () => {
    if (!adaDipilih) return;
    if (antar && !terpilih) {
      Alert.alert(T.alamatBelumDipilih.judul, T.alamatBelumDipilih.pesan, [
        { text: T.alamatBelumDipilih.pilih, onPress: () => router.push("/alamat") },
        { text: TEKS.batal, style: "cancel" },
      ]);
      return;
    }

    router.push({
      pathname: "/checkout",
      params: { uids: barisDipilih.map(({ item: i }) => i.uid).join(","), kirim: pengiriman },
    });
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
          {/* Di luar ScrollView supaya tetap menempel di atas saat daftar belanjaan di-scroll */}
          <KapasitasBerat
            beratGram={beratGram}
            kapasitasKg={KAPASITAS_KERANJANG_KG}
            melayang={terscroll}
          />

          <ScrollView
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
            scrollEventThrottle={16}
            onScroll={(e) => setTerscroll(e.nativeEvent.contentOffset.y > 4)}
          >
            <View style={[styles.section, styles.sectionPertama]}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>{T.pesananSaya}</Text>
                <Text style={styles.count}>{T.jumlahProduk(item.length)}</Text>
              </View>

              <View style={styles.list}>
                <PilihSemua semua={semuaDipilih} jumlahDipilih={barisDipilih.length} onPress={pilihSemua} />

                {baris.map(({ item: i, produk }) => (
                  <ItemKeranjangCard
                    key={i.uid}
                    item={i}
                    produk={produk}
                    dipilih={dipilih.has(i.uid)}
                    onPilih={() => pilihItem(i.uid)}
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

            {/* Rincian dan total baru muncul setelah ada produk yang dipilih */}
            {adaDipilih ? (
              <View style={styles.section}>
                <RincianPembayaran
                  subtotal={tagihan.subtotal}
                  ongkir={tarif ? tagihan.ongkir : null}
                  labelOngkir={tarif?.label}
                  total={tagihan.total}
                />
              </View>
            ) : null}
          </ScrollView>

          <FooterBar bordered={false} background={colors.barBg}>
            <RingkasanPembayaran
              total={adaDipilih ? tagihan.total : undefined}
              label={T.ringkasan.checkout(barisDipilih.length)}
              onPress={checkout}
              disabled={!adaDipilih}
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
  sectionPertama: { marginTop: spacing.sm },
  sectionHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: spacing.sm },
  sectionTitle: { fontSize: 14, fontWeight: "700", color: colors.text },
  count: { fontSize: 12, color: colors.muted },
  list: { gap: spacing.md },
  emptyScroll: { flex: 1 },
  emptyContent: { paddingBottom: spacing.xl },
  emptyHero: { minHeight: 400, alignItems: "center", justifyContent: "center", paddingTop: spacing.md },
  emptyImage: { width: 145, height: 145 },
  emptyTitle: { fontSize: 16, fontWeight: "700", color: colors.text, marginTop: 2 },
});
