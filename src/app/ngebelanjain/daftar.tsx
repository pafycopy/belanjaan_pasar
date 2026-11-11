import { useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { useRouter } from "expo-router";
import HeaderHijau from "@/components/ui/headerhijau";
import Button from "@/components/ui/button";
import OpsiPengiriman from "@/components/keranjang/pengiriman";
import AlamatPengantaran from "@/components/keranjang/alamatpengantaran";
import { useAlamat } from "@/context/alamat";
import { useNgebelanjain } from "@/context/ngebelanjain";
import { IdPengiriman } from "@/data/keranjang";
import { TEKS } from "@/data/teks";
import { TEKS_NGEBELANJAIN } from "@/data/teksngebelanjain";
import { colors, radius, spacing } from "@/theme";
import { formatAlamatLengkap } from "@/utils/alamat";
import { buatPesananNgebelanjain, pecahDaftar } from "@/utils/ngebelanjain";

const T = TEKS_NGEBELANJAIN;
const TD = T.daftar;

export default function DaftarNgebelanjain() {
  const router = useRouter();
  const { terpilih } = useAlamat();
  const { pesanan, tambah } = useNgebelanjain();

  const [daftar, setDaftar] = useState("");
  const [pengiriman, setPengiriman] = useState<IdPengiriman>("antar");
  const [mengirim, setMengirim] = useState(false);
  const antar = pengiriman === "antar";

  // Pesanan baru masuk ke tab "Sedang Diproses" (menunggu diterima admin)
  const kirim = async () => {
    if (mengirim) return;
    if (pecahDaftar(daftar).length === 0) {
      Alert.alert(TD.kosong.judul, TD.kosong.pesan);
      return;
    }
    const A = TEKS.keranjang.alamatBelumDipilih;
    if (antar && !terpilih) {
      Alert.alert(A.judul, A.pesan, [
        { text: A.pilih, onPress: () => router.push("/alamat") },
        { text: TEKS.batal, style: "cancel" },
      ]);
      return;
    }

    setMengirim(true);
    try {
      await tambah(
        buatPesananNgebelanjain({
          daftar,
          pengiriman,
          alamat: terpilih ? formatAlamatLengkap(terpilih) : undefined,
          sebelumnya: pesanan,
        })
      );
      router.dismissTo({ pathname: "/ngebelanjain", params: { tab: "diproses", ts: String(Date.now()) } });
    } catch {
      setMengirim(false);
      Alert.alert(T.gagal.judul, T.gagal.pesan);
    }
  };

  return (
    <View style={styles.screen}>
      <HeaderHijau judul={T.judul} />

      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}
        >
          <View style={styles.judulBaris}>
            <Text style={styles.judul}>{TD.judul}</Text>
            <Pressable onPress={() => setDaftar("")} hitSlop={8} accessibilityRole="button">
              <Text style={styles.hapus}>{TD.hapus}</Text>
            </Pressable>
          </View>

          <View style={styles.kartu}>
            <Text style={styles.label}>{TD.label}</Text>
            <TextInput
              value={daftar}
              onChangeText={setDaftar}
              placeholder={TD.placeholder}
              placeholderTextColor={colors.placeholder}
              multiline
              textAlignVertical="top"
              style={styles.input}
            />
          </View>

          <OpsiPengiriman dipilih={pengiriman} onChange={setPengiriman} />

          {antar ? <AlamatPengantaran alamat={terpilih} /> : null}
        </ScrollView>

        <View style={styles.footer}>
          <Text style={styles.catatan}>{TD.catatan}</Text>
          <Button label={TD.kirim} size="lg" onPress={() => void kirim()} loading={mengirim} />
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.canvas },
  flex: { flex: 1 },
  content: { padding: 14, gap: spacing.lg },
  judulBaris: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  judul: { fontSize: 17, fontWeight: "800", color: colors.textStrong },
  hapus: { fontSize: 12, fontWeight: "800", color: colors.danger },
  kartu: { backgroundColor: colors.white, borderRadius: radius.lg, padding: spacing.lg, gap: spacing.md },
  label: { fontSize: 12, fontWeight: "800", color: colors.textStrong },
  input: {
    minHeight: 150,
    backgroundColor: colors.accentSoft,
    borderRadius: radius.md,
    padding: spacing.md,
    fontSize: 13,
    lineHeight: 20,
    color: colors.text,
  },
  footer: { paddingHorizontal: 14, paddingTop: spacing.sm, paddingBottom: spacing.lg, gap: spacing.sm },
  catatan: { fontSize: 11, lineHeight: 16, color: colors.brown, textAlign: "center" },
});
