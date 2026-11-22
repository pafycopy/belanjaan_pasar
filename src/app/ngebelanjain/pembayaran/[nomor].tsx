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

// Halaman pilihan metode pembayaran, dibuka dari tombol "Bayar Sekarang" di kartu pesanan
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
                return (
                  <View key={o.id} style={styles.item}>
                    <Pressable
                      onPress={() => setDipilih(o.id)}
                      style={styles.baris}
                      accessibilityRole="radio"
                      accessibilityState={{ selected: aktif }}
                    >
                      <View style={styles.logo}>
                        {o.logoTeks ? (
                          <Text style={styles.logoQris}>{o.logoTeks}</Text>
                        ) : (
                          <Ionicons name={o.ikon} size={22} color={colors.green} />
                        )}
                      </View>

                      <View style={styles.teks}>
                        <Text style={styles.nama}>{o.nama}</Text>
                        {o.keterangan ? <Text style={styles.keterangan}>{o.keterangan}</Text> : null}
                      </View>

                      {o.pilihan ? (
                        <Pressable
                          hitSlop={10}
                          onPress={() => {
                            setDipilih(o.id);
                            setTerbuka((v) => !v);
                          }}
                        >
                          <Ionicons
                            name={terbuka && aktif ? "chevron-up" : "chevron-down"}
                            size={18}
                            color={colors.textSoft}
                          />
                        </Pressable>
                      ) : (
                        <View style={[styles.radio, aktif && styles.radioAktif]}>
                          {aktif ? <View style={styles.titik} /> : null}
                        </View>
                      )}
                    </Pressable>

                    {o.pilihan && aktif && terbuka ? (
                      <Pressable onPress={() => setDipilih(o.id)} style={styles.sub}>
                        {o.pilihan.logoTeks ? <Text style={styles.logoBank}>{o.pilihan.logoTeks}</Text> : null}
                        <Text style={styles.subNama}>{o.pilihan.nama}</Text>
                        <View style={[styles.radio, styles.radioAktif]}>
                          <View style={styles.titik} />
                        </View>
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
  item: { backgroundColor: colors.white, borderRadius: radius.lg, overflow: "hidden" },
  baris: { minHeight: 54, paddingHorizontal: 12, flexDirection: "row", alignItems: "center", gap: 12 },
  logo: { width: 28, alignItems: "center", justifyContent: "center" },
  logoQris: {
    fontSize: 9,
    fontWeight: "900",
    color: colors.textStrong,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 3,
  },
  teks: { flex: 1, gap: 1 },
  nama: { fontSize: 13, fontWeight: "600", color: colors.textStrong },
  keterangan: { fontSize: 11, color: colors.textSoft },
  radio: {
    width: 19,
    height: 19,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  radioAktif: { borderColor: colors.green },
  titik: { width: 9, height: 9, borderRadius: 5, backgroundColor: colors.green },
  sub: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    padding: 12,
    paddingLeft: 48,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  logoBank: { color: colors.brandBca, fontWeight: "900", fontStyle: "italic", fontSize: 12 },
  subNama: { flex: 1, fontSize: 12, color: colors.textStrong },
  footer: { padding: 14, paddingBottom: spacing.lg, backgroundColor: colors.canvas },
});
