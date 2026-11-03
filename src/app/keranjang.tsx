import { Ionicons } from "@expo/vector-icons";
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
import { useKeranjang } from "@/context/keranjang";
import { useAlamat } from "@/context/alamat";
import { cariProduk } from "@/utils/produk";
import { colors, spacing } from "@/theme";

const KAPASITAS_KG = 50;

export default function Keranjang() {
  const router = useRouter();
  const { item, subtotal, memuat, ubahJumlah, hapus } = useKeranjang();
  const { terpilih } = useAlamat();
  const [antar, setAntar] = useState(true);

  const data = useMemo(
    () => item
      .map((i) => ({ item: i, produk: cariProduk(i.produkId) }))
      .filter((x): x is { item: typeof item[number]; produk: NonNullable<ReturnType<typeof cariProduk>> } => !!x.produk),
    [item]
  );

  const beratGram = data.reduce(
    (total, { item: i, produk }) => total + (produk.beratBersihGram ?? 0) * i.jumlah,
    0
  );

  const kosong = !memuat && data.length === 0;

  const bayar = () => {
    if (antar && !terpilih) {
      Alert.alert("Alamat belum dipilih", "Pilih alamat pengantaran terlebih dahulu.", [
        { text: "Pilih Alamat", onPress: () => router.push("/alamat") },
        { text: "Batal", style: "cancel" },
      ]);
      return;
    }
    Alert.alert("Pembayaran", "Halaman pembayaran akan dihubungkan pada tahap berikutnya.");
  };

  return (
    <View style={styles.screen}>
      <HeaderHijau judul="Keranjang" />

      {kosong ? (
        <EmptyCart />
      ) : (
        <>
          <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
            <KapasitasBerat beratGram={beratGram} kapasitasKg={KAPASITAS_KG} />

            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Pesanan Saya</Text>
                <Text style={styles.count}>{item.length} Produk</Text>
              </View>

              <View style={styles.list}>
                {data.map(({ item: i, produk }) => (
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
              <OpsiPengiriman antar={antar} onChange={setAntar} />
            </View>

            {antar ? (
              <View style={styles.section}>
                <AlamatPengantaran alamat={terpilih} />
              </View>
            ) : null}

            <View style={styles.paymentHint}>
              <Ionicons name="card-outline" size={15} color={colors.primary} />
              <View style={styles.paymentText}>
                <Text style={styles.paymentTitle}>Pilih Pembayaran</Text>
                <Text style={styles.paymentSubtitle}>Metode pembayaran dipilih saat checkout</Text>
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

function EmptyCart() {
  return (
    <View style={styles.empty}>
      <View style={styles.illustration}>
        <Ionicons name="cart-outline" size={78} color={colors.primary} />
        <View style={styles.leafOne}><Ionicons name="leaf" size={28} color={colors.primary} /></View>
        <View style={styles.leafTwo}><Ionicons name="leaf" size={22} color={colors.green} /></View>
      </View>
      <Text style={styles.emptyTitle}>Belum Ada Pesanan</Text>
      <Text style={styles.emptyText}>Tambahkan produk segar dari pasar ke keranjangmu.</Text>
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
  empty: { flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 40, paddingBottom: 70 },
  illustration: { width: 150, height: 125, alignItems: "center", justifyContent: "center", position: "relative", marginBottom: 12 },
  leafOne: { position: "absolute", top: 10, right: 32, transform: [{ rotate: "-25deg" }] },
  leafTwo: { position: "absolute", top: 36, left: 25, transform: [{ rotate: "35deg" }] },
  emptyTitle: { fontSize: 13, fontWeight: "700", color: colors.text },
  emptyText: { fontSize: 10, color: colors.muted, textAlign: "center", marginTop: 5, lineHeight: 15 },
});
