import { useMemo, useState } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import HeaderHijau from "@/components/ui/headerhijau";
import FooterBar from "@/components/ui/footerbar";
import Button from "@/components/ui/button";
import GambarProduk from "@/components/produk/gambarproduk";
import ScreenState from "@/components/ui/screenstate";
import { usePesanan } from "@/context/pesanan";
import { useNgebelanjain } from "@/context/ngebelanjain";
import { colors, radius, spacing } from "@/theme";
import { pecahDaftar } from "@/utils/ngebelanjain";
import { cariProduk } from "@/utils/produk";

type ItemNilai = { id: string; nama: string; jumlah?: string; gambar?: any };

export default function HalamanPenilaian() {
  const { id, jenis } = useLocalSearchParams<{ id?: string; jenis?: "produk" | "ngebelanjain" }>();
  const router = useRouter();
  const { pesanan } = usePesanan();
  const { pesanan: pesananNgebelanjain } = useNgebelanjain();
  const [rating, setRating] = useState<Record<string, number>>({});
  const [ulasan, setUlasan] = useState<Record<string, string>>({});
  const pesananProduk = pesanan.find((p) => p.invoice === id);
  const pesananHelper = pesananNgebelanjain.find((p) => p.nomor === id);
  const item: ItemNilai[] = useMemo(() => {
    if (jenis === "ngebelanjain") return pesananHelper ? pecahDaftar(pesananHelper.daftar).map((x, i) => ({ id: `helper-${i}`, nama: x.nama, jumlah: x.jumlah })) : [];
    return pesananProduk ? pesananProduk.baris.map((b) => ({ id: b.produkId, nama: b.nama, jumlah: `${b.jumlah} item`, gambar: cariProduk(b.produkId)?.gambar })) : [];
  }, [jenis, pesananHelper, pesananProduk]);
  const valid = item.length > 0;

  const kirim = () => {
    if (item.some((x) => !rating[x.id])) {
      Alert.alert("Penilaian belum lengkap", "Berikan bintang untuk setiap produk sebelum mengirim penilaian.");
      return;
    }
    Alert.alert("Terima kasih!", "Penilaian kamu sudah diterima pada sesi ini.", [{ text: "Selesai", onPress: () => router.back() }]);
  };

  return (
    <View style={styles.screen}>
      <HeaderHijau judul="Penilaian Produk" />
      {!valid ? <ScreenState message="Data pesanan tidak ditemukan." /> : <>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <View style={styles.intro}>
            <View style={styles.introIcon}><Ionicons name="star" size={24} color={colors.white} /></View>
            <View style={styles.introText}><Text style={styles.introTitle}>Bagaimana kualitas produkmu?</Text><Text style={styles.introSub}>Bagikan pengalaman belanjamu agar kami bisa menjadi lebih baik.</Text></View>
          </View>
          <Text style={styles.invoice}>Pesanan #{id}</Text>
          {item.map((produk) => (
            <View key={produk.id} style={styles.kartu}>
              <View style={styles.produk}>
                {jenis === "ngebelanjain" ? <View style={styles.gambarKosong}><Ionicons name="basket-outline" size={24} color={colors.dark} /></View> : <GambarProduk gambar={produk.gambar} style={styles.gambar} fit="contain" />}
                <View style={styles.produkInfo}><Text style={styles.namaProduk}>{produk.nama}</Text>{produk.jumlah ? <Text style={styles.jumlah}>{produk.jumlah}</Text> : null}</View>
              </View>
              <Text style={styles.label}>Berikan penilaian</Text>
              <View style={styles.bintang}>{[1, 2, 3, 4, 5].map((n) => <Pressable key={n} onPress={() => setRating((s) => ({ ...s, [produk.id]: n }))} hitSlop={5}><Ionicons name={n <= (rating[produk.id] ?? 0) ? "star" : "star-outline"} size={30} color={colors.orange} /></Pressable>)}<Text style={styles.nilai}>{rating[produk.id] ? `${rating[produk.id]}/5` : "Pilih bintang"}</Text></View>
              <TextInput value={ulasan[produk.id] ?? ""} onChangeText={(v) => setUlasan((s) => ({ ...s, [produk.id]: v }))} placeholder="Tulis ulasan produk (opsional)" placeholderTextColor={colors.placeholder} multiline style={styles.input} textAlignVertical="top" />
            </View>
          ))}
        </ScrollView>
        <FooterBar><Button label="Kirim Penilaian" size="lg" onPress={kirim} /></FooterBar>
      </>}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.canvas }, content: { padding: spacing.lg, paddingBottom: spacing.xl, gap: spacing.md },
  intro: { flexDirection: "row", alignItems: "center", gap: spacing.md, backgroundColor: colors.accentSoftStrong, padding: spacing.lg, borderRadius: radius.lg },
  introIcon: { width: 46, height: 46, borderRadius: radius.pill, backgroundColor: colors.primaryDeep, alignItems: "center", justifyContent: "center" }, introText: { flex: 1, gap: 4 },
  introTitle: { fontSize: 15, fontWeight: "800", color: colors.textStrong }, introSub: { fontSize: 12, lineHeight: 18, color: colors.textSoft }, invoice: { fontSize: 13, fontWeight: "800", color: colors.textSoft },
  kartu: { backgroundColor: colors.white, borderRadius: radius.xl, padding: spacing.lg, gap: spacing.md }, produk: { flexDirection: "row", alignItems: "center", gap: spacing.md },
  gambar: { width: 64, height: 64, borderRadius: radius.md, backgroundColor: colors.accentSoft }, gambarKosong: { width: 64, height: 64, borderRadius: radius.md, backgroundColor: colors.accentSoft, alignItems: "center", justifyContent: "center" },
  produkInfo: { flex: 1, gap: 4 }, namaProduk: { fontSize: 14, lineHeight: 20, fontWeight: "800", color: colors.textStrong }, jumlah: { fontSize: 12, color: colors.textSoft }, label: { fontSize: 13, fontWeight: "700", color: colors.textStrong },
  bintang: { flexDirection: "row", alignItems: "center", gap: spacing.sm }, nilai: { marginLeft: spacing.sm, fontSize: 12, color: colors.textSoft }, input: { minHeight: 82, borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, padding: spacing.md, fontSize: 13, color: colors.text, backgroundColor: colors.white },
});
