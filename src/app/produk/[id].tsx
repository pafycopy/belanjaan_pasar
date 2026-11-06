import { useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { colors, radius, spacing } from "@/theme";
import { TEKS } from "@/data/teks";
import { PILIHAN_JUMLAH_BAWAAN, SARAN_CATATAN, SATUAN_BAWAAN } from "@/data/produk";
import { useKeranjang } from "@/context/keranjang";
import { useFavorit } from "@/context/favorit";
import { Produk } from "@/types/produk";
import { cariProduk, hitungSubtotal } from "@/utils/produk";
import HeaderHijau from "@/components/ui/headerhijau";
import FooterBar from "@/components/ui/footerbar";
import ScreenState from "@/components/ui/screenstate";
import GambarProduk from "@/components/produk/gambarproduk";
import InfoProduk from "@/components/produk/infoproduk";
import PilihJumlah from "@/components/produk/pilihjumlah";
import DeskripsiProduk from "@/components/produk/deskripsiproduk";
import OpsiPotonganProduk from "@/components/produk/opsipotongan";
import CatatanPemotong from "@/components/produk/catatanpemotong";
import BarKeranjang from "@/components/produk/barkeranjang";
import JumlahCustomSheet from "@/components/produk/jumlahcustomsheet";
import TombolBagikan from "@/components/produk/tombolbagikan";

const T = TEKS.produk;

export default function DetailProduk() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const produk = cariProduk(id);

  return (
    <View style={styles.screen}>
      <HeaderHijau kanan={produk ? <TombolBagikan produk={produk} /> : undefined} />
      {produk ? <IsiDetail produk={produk} /> : <ScreenState message={T.tidakDitemukan} />}
    </View>
  );
}

function IsiDetail({ produk }: { produk: Produk }) {
  const router = useRouter();
  const { tambah } = useKeranjang();
  const { isFavorit, toggle } = useFavorit();

  const satuan = produk.satuan ?? SATUAN_BAWAAN;
  const maks = produk.stok ?? 99;
  const bisaDipotong = !!produk.opsiPotongan?.length;

  const [jumlah, setJumlah] = useState(1);
  const [potonganId, setPotonganId] = useState<string | undefined>(produk.potonganBawaan);
  const [catatan, setCatatan] = useState("");
  const [sheetCustom, setSheetCustom] = useState(false);
  const [menambah, setMenambah] = useState(false);

  const tambahKeKeranjang = async () => {
    if (menambah) return;
    setMenambah(true);
    try {
      await tambah({
        produkId: produk.id,
        jumlah,
        hargaSatuan: produk.harga,
        potonganId: bisaDipotong ? potonganId : undefined,
        catatan: bisaDipotong ? catatan.trim() || undefined : undefined,
      });
      Alert.alert(T.keranjang.berhasil.judul, T.keranjang.berhasil.pesan(produk.nama, jumlah), [
        { text: T.keranjang.berhasil.lanjut, style: "cancel" },
        { text: T.keranjang.berhasil.lihat, onPress: () => router.push("/keranjang") },
      ]);
    } catch {
      Alert.alert(T.keranjang.gagal.judul, T.keranjang.gagal.pesan);
    } finally {
      setMenambah(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ScrollView contentContainerStyle={styles.isi} keyboardShouldPersistTaps="handled">
        <GambarProduk gambar={produk.gambar} style={styles.foto} />
        <InfoProduk
          produk={produk}
          favorit={isFavorit(produk.id)}
          onToggleFavorit={() => void toggle(produk.id)}
        />
        <PilihJumlah
          satuan={satuan}
          pilihan={produk.pilihanJumlah ?? PILIHAN_JUMLAH_BAWAAN}
          jumlah={jumlah}
          maks={maks}
          onUbah={setJumlah}
          onCustom={() => setSheetCustom(true)}
        />
        {produk.deskripsi ? <DeskripsiProduk teks={produk.deskripsi} /> : null}
        {bisaDipotong ? (
          <>
            <OpsiPotonganProduk opsi={produk.opsiPotongan ?? []} dipilihId={potonganId} onPilih={setPotonganId} />
            <CatatanPemotong value={catatan} onChangeText={setCatatan} saran={SARAN_CATATAN} />
          </>
        ) : null}
      </ScrollView>

      <FooterBar bordered={false} background={colors.surface}>
        <BarKeranjang subtotal={hitungSubtotal(produk.harga, jumlah)} jumlah={jumlah} loading={menambah} onTambah={tambahKeKeranjang} />
      </FooterBar>

      {sheetCustom ? (
        <JumlahCustomSheet
          awal={jumlah}
          maks={maks}
          satuan={satuan}
          onTerapkan={(n) => { setJumlah(n); setSheetCustom(false); }}
          onTutup={() => setSheetCustom(false)}
        />
      ) : null}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.surface },
  flex: { flex: 1 },
  isi: { padding: spacing.lg, gap: spacing.lg, paddingBottom: spacing.xl },
  foto: { aspectRatio: 1, borderRadius: radius.lg },
});
