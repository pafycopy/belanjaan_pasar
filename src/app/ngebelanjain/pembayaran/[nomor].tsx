import { useState } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import Button from "@/components/ui/button";
import HeaderHijau from "@/components/ui/headerhijau";
import { useNgebelanjain } from "@/context/ngebelanjain";
import { TEKS_NGEBELANJAIN } from "@/data/teksngebelanjain";
import { colors, radius, spacing } from "@/theme";
import { MetodeNgebelanjain } from "@/types/ngebelanjain";
import { pilihMetode } from "@/utils/ngebelanjain";

const OPSI: { id: MetodeNgebelanjain; nama: string; ikon: keyof typeof Ionicons.glyphMap }[] = [
  { id: "qris", nama: "QRIS", ikon: "qr-code-outline" },
  { id: "transfer", nama: "Transfer Bank", ikon: "business" },
  { id: "cod", nama: "Bayar di Tempat (COD)", ikon: "cash-outline" },
];

export default function PembayaranNgebelanjain() {
  const router = useRouter();
  const { nomor } = useLocalSearchParams<{ nomor?: string }>();
  const { pesanan, perbarui } = useNgebelanjain();
  const pesananAktif = pesanan.find((p) => p.nomor === nomor);
  const [dipilih, setDipilih] = useState<MetodeNgebelanjain>("cod");
  const [terbuka, setTerbuka] = useState(true);
  const [menyimpan, setMenyimpan] = useState(false);

  const konfirmasi = async () => {
    if (!pesananAktif) return;
    setMenyimpan(true);
    try {
      await perbarui(pesananAktif.nomor, (p) => ({ ...pilihMetode(p, dipilih), status: "pembayaran" }));
      router.replace({ pathname: "/(tabs)/ngebelanjain", params: { tab: "pembayaran", ts: String(Date.now()) } });
    } catch {
      setMenyimpan(false);
      Alert.alert(TEKS_NGEBELANJAIN.gagal.judul, TEKS_NGEBELANJAIN.gagal.pesan);
    }
  };

  return (
    <View style={styles.screen}>
      <HeaderHijau judul="Metode Pembayaran" />
      {!pesananAktif ? (
        <View style={styles.kosong}><Text style={styles.teksKosong}>Pesanan tidak ditemukan.</Text></View>
      ) : (
        <>
          <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
            <Text style={styles.label}>Metode Pembayaran</Text>
            <View style={styles.daftar}>
              {OPSI.map((o) => {
                const aktif = dipilih === o.id;
                return (
                  <View key={o.id} style={styles.item}>
                    <Pressable onPress={() => setDipilih(o.id)} style={styles.baris}>
                      <View style={styles.logo}>
                        {o.id === "qris" ? <Text style={styles.qris}>QRIS</Text> :
                          o.id === "transfer" ? <Ionicons name="business" size={23} color={colors.green} /> :
                          <Ionicons name="cash-outline" size={22} color={colors.green} />}
                      </View>
                      <Text style={styles.nama}>{o.nama}</Text>
                      {o.id === "transfer" ? (
                        <Pressable hitSlop={10} onPress={() => { setDipilih("transfer"); setTerbuka((v) => !v); }}>
                          <Ionicons name={terbuka && aktif ? "chevron-up" : "chevron-down"} size={18} color={colors.textSoft} />
                        </Pressable>
                      ) : <View style={[styles.radio, aktif && styles.radioAktif]}>{aktif ? <View style={styles.titik} /> : null}</View>}
                    </Pressable>
                    {o.id === "transfer" && aktif && terbuka ? (
                      <Pressable onPress={() => setDipilih("transfer")} style={styles.sub}>
                        <Text style={styles.bca}>BCA</Text>
                        <Text style={styles.subNama}>BCA Virtual Account</Text>
                        <View style={styles.radioAktif}><View style={styles.titik} /></View>
                      </Pressable>
                    ) : null}
                    {o.id !== "transfer" && aktif ? <View style={styles.tandaAktif} /> : null}
                  </View>
                );
              })}
            </View>
          </ScrollView>
          <View style={styles.footer}>
            <Button
              label={dipilih === "cod" ? "Konfirmasi Pesanan COD" : dipilih === "transfer" ? "Konfirmasi Transfer Bank" : "Konfirmasi Pembayaran QRIS"}
              size="lg"
              loading={menyimpan}
              onPress={() => void konfirmasi()}
            />
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.canvas },
  content: { padding: 16, gap: 10 },
  label: { fontSize: 12, color: colors.textSoft, fontWeight: "600" },
  daftar: { gap: 8 },
  item: { backgroundColor: "#FFFFFF", borderRadius: 12, overflow: "hidden" },
  baris: { minHeight: 54, paddingHorizontal: 12, flexDirection: "row", alignItems: "center", gap: 12 },
  logo: { width: 28, alignItems: "center", justifyContent: "center" },
  qris: { fontSize: 9, fontWeight: "900", color: colors.textStrong, borderWidth: 1, borderColor: colors.border, padding: 3 },
  nama: { flex: 1, fontSize: 13, fontWeight: "600", color: colors.textStrong },
  radio: { width: 19, height: 19, borderRadius: 10, borderWidth: 2, borderColor: colors.border, alignItems: "center", justifyContent: "center" },
  radioAktif: { width: 19, height: 19, borderRadius: 10, borderWidth: 2, borderColor: colors.green, alignItems: "center", justifyContent: "center" },
  titik: { width: 9, height: 9, borderRadius: 5, backgroundColor: colors.green },
  tandaAktif: { height: 0 },
  sub: { borderTopWidth: 1, borderTopColor: colors.border, padding: 12, paddingLeft: 48, flexDirection: "row", alignItems: "center", gap: 10 },
  bca: { color: colors.brandBca, fontWeight: "900", fontStyle: "italic", fontSize: 12 },
  subNama: { flex: 1, fontSize: 12, color: colors.textStrong },
  footer: { padding: 14, paddingBottom: spacing.lg, backgroundColor: colors.canvas },
  kosong: { flex: 1, alignItems: "center", justifyContent: "center" },
  teksKosong: { color: colors.textSoft, fontSize: 13 },
});
