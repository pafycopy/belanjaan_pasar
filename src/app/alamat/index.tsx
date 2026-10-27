import { useState } from "react";
import { View, Text, Pressable, ScrollView, StyleSheet, ActivityIndicator, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useAlamat } from "@/context/alamat";
import { koordinatDariTeks } from "@/services/lokasi";
import { TEKS } from "@/data/teks";
import { colors, spacing } from "@/theme";
import ConfirmDialog from "@/components/alamat/confirmdialog";
import AlamatItem from "@/components/alamat/alamatitem";
import Button from "@/components/ui/button";
import SearchField from "@/components/ui/searchfield";
import FooterBar from "@/components/ui/footerbar";

export default function PilihLokasi() {
  const router = useRouter();
  const { daftar, terpilihId, memuat, pilih, hapus } = useAlamat();
  const [kelola, setKelola] = useState(false);
  const [hapusId, setHapusId] = useState<string | null>(null);
  const [cari, setCari] = useState("");
  const [mencari, setMencari] = useState(false);

  const keTambah = () => router.push("/alamat/pinpoint");
  // Buka peta di posisi pengguna (izin GPS diminta di layar peta)
  const keGps = () => router.push({ pathname: "/alamat/pinpoint", params: { gps: "1" } });
  const keUbah = (id: string) => router.push({ pathname: "/alamat/pinpoint", params: { id } });

  const cariLokasi = async () => {
    const q = cari.trim();
    if (!q) return;
    setMencari(true);
    const c = await koordinatDariTeks(q);
    setMencari(false);
    if (!c) {
      Alert.alert(
        TEKS.peringatan.lokasiTidakDitemukan.judul,
        TEKS.peringatan.lokasiTidakDitemukan.pesan
      );
      return;
    }
    router.push({
      pathname: "/alamat/pinpoint",
      params: { lat: String(c.latitude), lng: String(c.longitude) },
    });
  };

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        <SearchField
          value={cari}
          onChangeText={setCari}
          onSubmit={cariLokasi}
          placeholder={TEKS.daftar.cariPlaceholder}
          loading={mencari}
        />

        <View style={styles.row}>
          <Button
            label={TEKS.daftar.pilihTitik}
            variant="light"
            size="sm"
            onPress={keTambah}
            style={styles.flex}
          />
          <Button
            label={TEKS.daftar.lokasiSaya}
            icon="navigate"
            size="sm"
            onPress={keGps}
            style={styles.flex}
          />
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.cardTitleRow}>
              <Ionicons name="bookmark-outline" size={16} color={colors.text} />
              <Text style={styles.cardTitle}>{TEKS.daftar.judulTersimpan(daftar.length)}</Text>
            </View>
            <Pressable onPress={() => setKelola((v) => !v)} hitSlop={8}>
              <Text style={styles.manage}>{kelola ? TEKS.selesai : TEKS.kelola}</Text>
            </Pressable>
          </View>

          {memuat ? <ActivityIndicator color={colors.primary} /> : null}
          {!memuat && daftar.length === 0 ? <Text style={styles.empty}>{TEKS.daftar.kosong}</Text> : null}

          {daftar.map((a) => (
            <AlamatItem
              key={a.id}
              alamat={a}
              terpilih={a.id === terpilihId}
              kelola={kelola}
              onGunakan={() => {
                pilih(a.id);
                router.back();
              }}
              onUbah={() => keUbah(a.id)}
              onHapus={() => setHapusId(a.id)}
            />
          ))}
        </View>
      </ScrollView>

      <FooterBar bordered={false} background={colors.surface}>
        <Button label={TEKS.daftar.tambahBaru} icon="add" onPress={keTambah} />
      </FooterBar>

      <ConfirmDialog
        visible={hapusId !== null}
        title={TEKS.dialogHapus.judul}
        message={TEKS.dialogHapus.pesan}
        confirmLabel={TEKS.hapus}
        cancelLabel={TEKS.batal}
        onConfirm={() => {
          if (hapusId) hapus(hapusId);
          setHapusId(null);
        }}
        onCancel={() => setHapusId(null)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.surface },
  content: { padding: spacing.lg, gap: spacing.md },
  row: { flexDirection: "row", gap: 10 },
  flex: { flex: 1 },
  card: { backgroundColor: colors.accentSoft, borderRadius: 14, padding: spacing.md, gap: 10 },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  cardTitleRow: { flexDirection: "row", alignItems: "center", gap: 6, flex: 1 },
  cardTitle: { fontSize: 12, fontWeight: "700", color: colors.text },
  manage: { fontSize: 12, fontWeight: "700", color: colors.dark },
  empty: { fontSize: 12, color: colors.muted, textAlign: "center", paddingVertical: spacing.sm },
});
