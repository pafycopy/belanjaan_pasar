import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Radio from "@/components/ui/radio";
import { IdMetode, METODE_PEMBAYARAN, MetodePembayaran } from "@/data/keranjang";
import { colors, radius, spacing } from "@/theme";

type Props = { dipilih: IdMetode; onPilih: (id: IdMetode) => void };

// Logo metode: file logo > ikon dalam kotak lavender > teks singkatan
function LogoMetode({ metode }: { metode: MetodePembayaran }) {
  if (metode.logo) {
    return <Image source={metode.logo} style={styles.logoGambar} contentFit="contain" />;
  }
  if (metode.ikon) {
    return (
      <View style={styles.kotakIkon}>
        <Ionicons name={metode.ikon} size={22} color={colors.dark} />
      </View>
    );
  }
  return (
    <Text style={[styles.singkatan, { color: metode.warnaSingkatan ?? colors.text }]}>
      {metode.singkatan ?? metode.nama}
    </Text>
  );
}

// Daftar pilihan metode pembayaran (pilihan tunggal); isinya dari METODE_PEMBAYARAN
export default function MetodePembayaranList({ dipilih, onPilih }: Props) {
  return (
    <View style={styles.daftar}>
      {METODE_PEMBAYARAN.map((metode) => (
        <Pressable key={metode.id} style={styles.kartu} onPress={() => onPilih(metode.id)}>
          <View style={styles.logo}>
            <LogoMetode metode={metode} />
          </View>

          <View style={styles.info}>
            <Text style={styles.nama}>{metode.nama}</Text>
            {metode.keterangan ? <Text style={styles.keterangan}>{metode.keterangan}</Text> : null}
          </View>

          <Radio dipilih={metode.id === dipilih} />
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  daftar: { gap: spacing.sm, marginTop: spacing.sm },
  kartu: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    minHeight: 60,
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  logo: { width: 52, alignItems: "center", justifyContent: "center" },
  logoGambar: { width: 52, height: 24 },
  singkatan: { fontSize: 14, fontWeight: "800", fontStyle: "italic" },
  kotakIkon: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    backgroundColor: colors.accentSoftStrong,
    alignItems: "center",
    justifyContent: "center",
  },
  info: { flex: 1 },
  nama: { fontSize: 14, fontWeight: "700", color: colors.text },
  keterangan: { fontSize: 12, color: colors.muted, marginTop: 2 },
});
