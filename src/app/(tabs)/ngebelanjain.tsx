import { ReactNode, useEffect, useMemo, useState } from "react";
import { Alert, Linking, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import Button from "@/components/ui/button";
import HeaderTab from "@/components/ui/headertab";
import ScreenState from "@/components/ui/screenstate";
import IlustrasiKosong from "@/components/ngebelanjain/ilustrasikosong";
import KartuNgebelanjain from "@/components/ngebelanjain/kartupesanan";
import MetodeBayar from "@/components/ngebelanjain/metodebayar";
import MenungguBayar from "@/components/ngebelanjain/menunggubayar";
import SudahDibayar from "@/components/ngebelanjain/sudahdibayar";
import TabStatusNgebelanjain from "@/components/ngebelanjain/statuspesanan";
import { useNgebelanjain } from "@/context/ngebelanjain";
import { ILUSTRASI_NGEBELANJAIN_KOSONG, NOMOR_WA_NGEBELANJAIN, TAB_NGEBELANJAIN } from "@/data/ngebelanjain";
import { TEKS_NGEBELANJAIN } from "@/data/teksngebelanjain";
import { colors, spacing } from "@/theme";
import { MetodeNgebelanjain, PesananNgebelanjain, StatusNgebelanjain } from "@/types/ngebelanjain";
import { batalkanMetode, majukanNgebelanjain, pilihMetode } from "@/utils/ngebelanjain";

const T = TEKS_NGEBELANJAIN;

const adaStatus = (x: string | undefined): x is StatusNgebelanjain => TAB_NGEBELANJAIN.some((t) => t.id === x);

export default function NgebelanjainScreen() {
  const router = useRouter();
  const { tab: tabParam, ts } = useLocalSearchParams<{ tab?: string; ts?: string }>();
  const { pesanan, memuat, perbarui } = useNgebelanjain();

  const [tab, setTab] = useState<StatusNgebelanjain>("diproses");
  const [metodeDipilih, setMetodeDipilih] = useState<MetodeNgebelanjain>("qris");

  // Setelah mengirim permintaan, layar daftar membuka tab ini langsung di "Sedang Diproses"
  useEffect(() => {
    if (adaStatus(tabParam)) setTab(tabParam);
  }, [tabParam, ts]);

  const daftar = useMemo(() => pesanan.filter((p) => p.status === tab), [pesanan, tab]);
  const pertama: PesananNgebelanjain | undefined = daftar[0];

  const ubah = async (p: PesananNgebelanjain, fn: (x: PesananNgebelanjain) => PesananNgebelanjain) => {
    try {
      await perbarui(p.nomor, fn);
    } catch {
      Alert.alert(T.gagal.judul, T.gagal.pesan);
    }
  };

  const mulai = () => router.push("/ngebelanjain/daftar");

  // Chat langsung ke WhatsApp admin dengan pesan yang sudah terisi nomor pesanan
  const chat = async (p: PesananNgebelanjain) => {
    if (!NOMOR_WA_NGEBELANJAIN) {
      Alert.alert(T.waBelumDiatur.judul, T.waBelumDiatur.pesan);
      return;
    }
    try {
      await Linking.openURL(
        `https://wa.me/${NOMOR_WA_NGEBELANJAIN}?text=${encodeURIComponent(T.chatWaPesan(p.nomor))}`
      );
    } catch {
      Alert.alert(T.waGagal.judul, T.waGagal.pesan);
    }
  };

  /* ---------- isi sesuai tahap ---------- */

  let isi: ReactNode;
  let footer: ReactNode = null;
  let latar: string = colors.canvas;

  if (memuat) {
    isi = <ScreenState loading />;
  } else if (!pertama) {
    latar = colors.white;
    isi = (
      <View style={styles.kosong}>
        <IlustrasiKosong gambar={ILUSTRASI_NGEBELANJAIN_KOSONG} />
        <Text style={styles.kosongJudul}>{T.kosongJudul}</Text>
        <Text style={styles.kosongPesan}>{T.kosongPesan}</Text>
      </View>
    );
    footer = <Button label={T.mulai} size="lg" onPress={mulai} />;
  } else if (tab === "pembayaran") {
    // QRIS hanya dianggap menunggu selama batas waktunya belum lewat
    const qrisAktif = pertama.metode === "qris" && (pertama.batasBayar ?? 0) > Date.now();
    const menunggu = pertama.metode === "cod" || qrisAktif;
    const kembali = () => void ubah(pertama, batalkanMetode);

    if (menunggu) {
      isi = <MenungguBayar pesanan={pertama} onKembali={kembali} />;
    } else {
      isi = (
        <ScrollView showsVerticalScrollIndicator={false}>
          <MetodeBayar dipilih={metodeDipilih} onPilih={setMetodeDipilih} />
        </ScrollView>
      );
      footer = (
        <Button
          label={T.metode.bayar}
          size="lg"
          onPress={() => void ubah(pertama, (p) => pilihMetode(p, metodeDipilih))}
        />
      );
    }
  } else if (tab === "dibayar") {
    isi = (
      <ScrollView contentContainerStyle={styles.daftar} showsVerticalScrollIndicator={false}>
        {daftar.map((p) => (
          <SudahDibayar key={p.nomor} pesanan={p} />
        ))}
      </ScrollView>
    );
    footer = (
      <Button
        label={T.dibayar.detail}
        size="lg"
        onPress={() => Alert.alert(T.dibayar.segera.judul, T.dibayar.segera.pesan)}
      />
    );
  } else {
    isi = (
      <ScrollView contentContainerStyle={styles.daftar} showsVerticalScrollIndicator={false}>
        {daftar.map((p) => (
          <KartuNgebelanjain key={p.nomor} pesanan={p} onChat={() => void chat(p)} />
        ))}
      </ScrollView>
    );
  }

  return (
    <View style={styles.screen}>
      <HeaderTab judul={T.judul} />

      <View style={styles.status}>
        <Text style={styles.statusJudul}>{T.pesananSaya}</Text>
        <TabStatusNgebelanjain items={TAB_NGEBELANJAIN} selectedId={tab} onSelect={setTab} />
      </View>

      {/* Hanya mode pengembangan: aslinya admin yang memindahkan pesanan ke tahap berikutnya */}
      {__DEV__ && pertama ? (
        <Pressable onPress={() => void ubah(pertama, (p) => majukanNgebelanjain(p))} style={styles.dev}>
          <Text style={styles.devTeks}>{T.dev(pertama.nomor)}</Text>
        </Pressable>
      ) : null}

      <View style={[styles.isi, { backgroundColor: latar }]}>{isi}</View>

      {footer ? <View style={[styles.footer, { backgroundColor: latar }]}>{footer}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.white },
  status: {
    backgroundColor: colors.white,
    paddingHorizontal: 14,
    paddingTop: spacing.lg,
    gap: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  statusJudul: { fontSize: 14, fontWeight: "800", color: colors.textStrong },
  dev: {
    alignSelf: "center",
    marginVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: 3,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: colors.muted,
    borderRadius: 6,
  },
  devTeks: { fontSize: 10, color: colors.muted },
  isi: { flex: 1 },
  daftar: { padding: 14, gap: spacing.md },
  kosong: { flex: 1, alignItems: "center", justifyContent: "center", gap: spacing.sm, paddingHorizontal: spacing.xl },
  kosongJudul: { fontSize: 14, fontWeight: "800", color: colors.textStrong, marginTop: spacing.md },
  kosongPesan: { fontSize: 12, lineHeight: 18, color: colors.textSoft, textAlign: "center" },
  footer: { paddingHorizontal: 14, paddingTop: spacing.sm, paddingBottom: spacing.lg },
});
