import { useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import HeaderHijau from "@/components/ui/headerhijau";
import FooterBar from "@/components/ui/footerbar";
import Button from "@/components/ui/button";
import FotoProfil from "@/components/akun/fotoprofil";
import FieldProfil from "@/components/akun/fieldprofil";
import { useProfil } from "@/context/profil";
import { simpanFotoProfil } from "@/services/profilfotoservice";
import { TEKS } from "@/data/teks";
import { colors, radius, spacing } from "@/theme";

const T = TEKS.akun.edit;

export default function EditProfilScreen() {
  const router = useRouter();
  const { profil, simpan } = useProfil();
  const [nama, setNama] = useState(profil.nama);
  const [telepon, setTelepon] = useState(profil.telepon);
  const [fotoUri, setFotoUri] = useState<string | null>(profil.fotoUri);
  const [menyimpan, setMenyimpan] = useState(false);

  const pilihFoto = async () => {
    const izin = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!izin.granted) {
      Alert.alert(T.izinFoto.judul, T.izinFoto.pesan);
      return;
    }

    const hasil = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!hasil.canceled && hasil.assets[0]?.uri) {
      try {
        const uriPermanen = await simpanFotoProfil(hasil.assets[0].uri);
        setFotoUri(uriPermanen);
      } catch {
        Alert.alert(T.gagalFoto.judul, T.gagalFoto.pesan);
      }
    }
  };

  const simpanProfil = async () => {
    const namaBersih = nama.trim();
    const nomorBersih = telepon.trim();
    const digitTelepon = nomorBersih.replace(/\D/g, "");

    if (!namaBersih) {
      Alert.alert(T.validasi.judul, T.validasi.nama);
      return;
    }

    if (digitTelepon.length < 9 || digitTelepon.length > 15) {
      Alert.alert(T.validasi.judul, T.validasi.telepon);
      return;
    }

    setMenyimpan(true);
    try {
      await simpan({ nama: namaBersih, telepon: nomorBersih, fotoUri });
      Alert.alert(T.berhasil.judul, T.berhasil.pesan, [
        { text: TEKS.selesai, onPress: () => router.back() },
      ]);
    } catch {
      Alert.alert(T.gagal.judul, T.gagal.pesan);
    } finally {
      setMenyimpan(false);
    }
  };

  return (
    <View style={styles.screen}>
      <HeaderHijau judul={T.judul} />
      <ScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <View style={styles.fotoCard}>
          <FotoProfil fotoUri={fotoUri} size={104} editable onPress={pilihFoto} />
          <Text style={styles.namaFoto}>{T.foto}</Text>
          <Text style={styles.petunjukFoto}>{T.petunjukFoto}</Text>
          <Button style={styles.tombolFoto} label={T.tombolFoto} icon="camera-outline" variant="light" size="sm" onPress={pilihFoto} />
        </View>

        <View style={styles.formCard}>
          <View style={styles.heading}>
            <Text style={styles.headingTitle}>{T.dataDiri}</Text>
            <Text style={styles.headingDesc}>{T.deskripsi}</Text>
          </View>
          <FieldProfil
            label={T.nama}
            value={nama}
            onChangeText={setNama}
            placeholder={T.placeholderNama}
            autoCapitalize="words"
            maxLength={60}
          />
          <FieldProfil
            label={T.telepon}
            value={telepon}
            onChangeText={setTelepon}
            placeholder={T.placeholderTelepon}
            keyboardType="phone-pad"
            maxLength={18}
          />
          <View style={styles.info}>
            <Text style={styles.infoText}>{T.catatanTelepon}</Text>
          </View>
        </View>
      </ScrollView>

      <FooterBar>
        <Button
          label={T.simpan}
          icon="checkmark"
          onPress={simpanProfil}
          loading={menyimpan}
          disabled={menyimpan}
        />
      </FooterBar>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.canvas },
  content: { padding: spacing.lg, gap: spacing.lg, paddingBottom: spacing.xl },
  fotoCard: {
    alignItems: "center",
    backgroundColor: colors.white,
    borderRadius: radius.card,
    padding: spacing.xl,
    gap: spacing.sm,
  },
  namaFoto: { fontSize: 15, fontWeight: "800", color: colors.text, marginTop: spacing.xs },
  petunjukFoto: { fontSize: 12, color: colors.muted, textAlign: "center", marginBottom: spacing.sm, },
  tombolFoto: { paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: radius.md },
  formCard: { backgroundColor: colors.white, borderRadius: radius.card, padding: spacing.lg, gap: spacing.lg },
  heading: { gap: 4, marginBottom: spacing.xs },
  headingTitle: { fontSize: 16, fontWeight: "800", color: colors.text },
  headingDesc: { fontSize: 12, color: colors.muted, lineHeight: 18 },
  info: { backgroundColor: colors.primarySoft, borderRadius: radius.md, padding: spacing.md },
  infoText: { fontSize: 11, color: colors.dark, lineHeight: 17 },
});
