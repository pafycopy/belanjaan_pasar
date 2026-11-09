import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import Constants from "expo-constants";
import { Ionicons } from "@expo/vector-icons";
import HeaderAddress from "@/components/beranda/headeraddress";
import KartuProfil from "@/components/akun/kartuprofil";
import { BarisMenu, GrupMenu } from "@/components/akun/barismenu";
import { useAlamat } from "@/context/alamat";
import { usePoin } from "@/context/poin";
import { useVoucher } from "@/context/voucher";
import { GRUP_MENU_AKUN, MenuAkun, PROFIL_CONTOH } from "@/data/akun";
import { TEKS } from "@/data/teks";
import { colors, radius, spacing } from "@/theme";
import { hitungVoucherAktif } from "@/utils/akun";
import { formatRibuan } from "@/utils/angka";

const T = TEKS.akun;

export default function AkunScreen() {
  const router = useRouter();
  const { terpilih, memuat } = useAlamat();
  const { total: totalPoin } = usePoin();
  const { milik } = useVoucher();

  const alamatHeader = memuat ? TEKS.header.memuat : terpilih ? terpilih.jalan : TEKS.header.kosong;
  const versi = Constants.expoConfig?.version ?? "-";

  const segera = (nama: string) => Alert.alert(T.segera.judul, T.segera.pesan(nama));

  const bukaMenu = (m: MenuAkun) => (m.href ? router.push(m.href) : segera(m.label));

  return (
    <View style={styles.screen}>
      <HeaderAddress address={alamatHeader} showActions={false} onPressAddress={() => router.push("/alamat")} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={styles.profil}>
          <KartuProfil
            nama={PROFIL_CONTOH.nama}
            telepon={PROFIL_CONTOH.telepon}
            terverifikasi={PROFIL_CONTOH.terverifikasi}
            poin={T.poinNilai(formatRibuan(totalPoin))}
            voucher={T.voucherNilai(hitungVoucherAktif(milik))}
            onEdit={() => segera(T.editProfil)}
            onFoto={() => segera(T.ubahFoto)}
            onPoin={() => router.push("/poin")}
            onVoucher={() => router.push("/voucher")}
          />
        </View>

        <View style={styles.isi}>
          {GRUP_MENU_AKUN.map((g) => (
            <GrupMenu key={g.judul} judul={g.judul}>
              {g.menu.map((m) => (
                <BarisMenu key={m.id} ikon={m.ikon} label={m.label} onPress={() => bukaMenu(m)} />
              ))}
              {/* versi aplikasi: baris informasi di akhir kelompok "Lainnya" */}
              {g.judul === "Lainnya" ? (
                <BarisMenu ikon="phone-portrait-outline" label="Versi Aplikasi" keterangan={T.versi(versi)} />
              ) : null}
            </GrupMenu>
          ))}

          <Pressable onPress={() => segera(T.keluar)} style={styles.keluar} accessibilityRole="button">
            <Ionicons name="log-out-outline" size={18} color={colors.danger} />
            <Text style={styles.keluarTeks}>{T.keluar}</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.canvas },
  content: { paddingBottom: spacing.xl },
  profil: { paddingHorizontal: 14, paddingTop: spacing.lg },
  isi: { paddingHorizontal: 14, paddingTop: spacing.xl, gap: spacing.lg },
  keluar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    backgroundColor: colors.dangerSoft,
    borderRadius: radius.lg,
    minHeight: 48,
  },
  keluarTeks: { fontSize: 14, fontWeight: "800", color: colors.danger },
});
