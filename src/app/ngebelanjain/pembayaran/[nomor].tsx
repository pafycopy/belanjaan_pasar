import { useState } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import Button from "@/components/ui/button";
import HeaderHijau from "@/components/ui/headerhijau";
import ScreenState from "@/components/ui/screenstate";
import { useNgebelanjain } from "@/context/ngebelanjain";
import { OPSI_METODE_NGEBELANJAIN } from "@/data/ngebelanjain";
import { TEKS_NGEBELANJAIN } from "@/data/teksngebelanjain";
import { colors, radius, spacing } from "@/theme";
import { MetodeNgebelanjain } from "@/types/ngebelanjain";
import { pilihMetode } from "@/utils/ngebelanjain";

const T = TEKS_NGEBELANJAIN;

// Penanda pilihan: lingkaran lavender, atau hijau tua berisi titik putih bila dipilih
function Penanda({ aktif }: { aktif: boolean }) {
  return <View style={[styles.penanda, aktif && styles.penandaAktif]}>{aktif ? <View style={styles.titik} /> : null}</View>;
}

// Halaman pilihan metode pembayaran, dibuka dari tombol "Bayar Sekarang" di kartu pesanan.
// QRIS dan BCA Virtual Account lanjut ke halaman Menunggu Pembayaran; COD kembali ke tab.
export default function PembayaranNgebelanjain() {
  const router = useRouter();
  const { nomor } = useLocalSearchParams<{ nomor?: string }>();
  const { pesanan, memuat, perbarui } = useNgebelanjain();
  const [dipilih, setDipilih] = useState<MetodeNgebelanjain>("cod");
  const [terbuka, setTerbuka] = useState(true); // grup "Transfer Bank" sedang dibuka
  const [menyimpan, setMenyimpan] = useState(false);

  // Hanya pesanan yang tagihannya sudah tersedia yang boleh membayar
  const pesananAktif = pesanan.find((p) => p.nomor === nomor && p.status === "pembayaran");

  const konfirmasi = async () => {
    if (!pesananAktif) return;
    setMenyimpan(true);
    try {
      await perbarui(pesananAktif.nomor, (p) => pilihMetode(p, dipilih));
      if (dipilih === "cod") {
        router.replace({ pathname: "/(tabs)/ngebelanjain", params: { tab: "pembayaran", ts: String(Date.now()) } });
      } else {
        router.replace({ pathname: "/ngebelanjain/tagihan/[nomor]", params: { nomor: pesananAktif.nomor } });
      }
    } catch {
      setMenyimpan(false);
      Alert.alert(T.gagal.judul, T.gagal.pesan);
    }
  };

  return (
    <View style={styles.screen}>
      <HeaderHijau judul={T.metode.judul} />

      {memuat ? (
        <ScreenState loading />
      ) : !pesananAktif ? (
        <ScreenState message={T.halamanDetail.tidakDitemukan} />
      ) : (
        <>
          <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
            <Text style={styles.label}>{T.metode.judul}</Text>

            <View style={styles.daftar}>
              {OPSI_METODE_NGEBELANJAIN.map((o) => {
                const aktif = dipilih === o.id;
                const grup = Boolean(o.pilihan);

                return (
                  <View key={o.id} style={styles.blok}>
                    <Pressable
                      onPress={() => (grup ? setTerbuka((v) => !v) : setDipilih(o.id))}
                      style={styles.kartu}
                      accessibilityRole={grup ? "button" : "radio"}
                      accessibilityState={grup ? { expanded: terbuka } : { selected: aktif }}
                    >
                      <View style={styles.logo}>
                        {o.logoTeks ? (
                          <Text style={styles.logoKotak}>{o.logoTeks}</Text>
                        ) : (
                          <Ionicons name={o.ikon} size={22} color={colors.dark} />
                        )}
                      </View>

                      <View style={styles.teks}>
                        <Text style={styles.nama}>{o.nama}</Text>
                        {o.keterangan ? <Text style={styles.keterangan}>{o.keterangan}</Text> : null}
                      </View>

                      {grup ? (
                        <Ionicons name={terbuka ? "chevron-up" : "chevron-down"} size={18} color={colors.textStrong} />
                      ) : (
                        <Penanda aktif={aktif} />
                      )}
                    </Pressable>

                    {o.pilihan && terbuka ? (
                      <Pressable
                        onPress={() => setDipilih(o.id)}
                        style={[styles.kartu, styles.sub]}
                        accessibilityRole="radio"
                        accessibilityState={{ selected: aktif }}
                      >
                        {o.pilihan.logoTeks ? <Text style={styles.logoBank}>{o.pilihan.logoTeks}</Text> : null}
                        <Text style={styles.subNama}>{o.pilihan.nama}</Text>
                        <Penanda aktif={aktif} />
                      </Pressable>
                    ) : null}
                  </View>
                );
              })}
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <Button
              label={T.metode.konfirmasi[dipilih]}
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
  daftar: { gap: spacing.sm },
  blok: { gap: spacing.sm },
  kartu: {
    minHeight: 54,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 12,
    backgroundColor: colors.accentSoft,
    borderRadius: radius.lg,
  },
  logo: { width: 32, alignItems: "center", justifyContent: "center" },
  logoKotak: {
    fontSize: 9,
    fontWeight: "900",
    color: colors.textStrong,
    borderWidth: 1,
    borderColor: colors.textStrong,
    paddingHorizontal: 3,
    paddingVertical: 2,
  },
  teks: { flex: 1, gap: 1 },
  nama: { fontSize: 13, fontWeight: "700", color: colors.textStrong },
  keterangan: { fontSize: 11, color: colors.textSoft },
  sub: { paddingVertical: 12, paddingLeft: 44 },
  logoBank: { color: colors.brandBca, fontWeight: "900", fontStyle: "italic", fontSize: 14 },
  subNama: { flex: 1, fontSize: 13, fontWeight: "700", color: colors.textStrong },
  penanda: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.accentSoftStrong,
    alignItems: "center",
    justifyContent: "center",
  },
  penandaAktif: { backgroundColor: colors.dark },
  titik: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.white },
  footer: { padding: 14, paddingBottom: spacing.lg, backgroundColor: colors.canvas },
});
