import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, radius } from "@/theme";
import { Alamat } from "@/types/alamat";
import { gayaKategori } from "@/data/kategorialamat";
import { TEKS } from "@/data/teks";

type Props = {
  alamat: Alamat;
  terpilih: boolean;
  onPress: () => void;   // ketuk kartu: buka halaman ubah alamat
  onGunakan: () => void; // tombol "Gunakan": jadikan alamat pengantaran
};

export default function AlamatItem({ alamat, terpilih, onPress, onGunakan }: Props) {
  const gaya = gayaKategori(alamat.kategori);

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityHint={TEKS.daftar.ubahHint}
      style={({ pressed }) => [styles.item, pressed && styles.ditekan]}
    >
      <View style={[styles.ikon, { backgroundColor: gaya.bg }]}>
        <Ionicons name={gaya.icon} size={16} color={gaya.fg} />
      </View>

      <View style={styles.body}>
        <Text style={styles.nama} numberOfLines={1}>
          {alamat.namaPenerima}
        </Text>
        <Text style={styles.alamat} numberOfLines={1}>
          {alamat.jalan}
          {alamat.jarakKm != null ? ` (${alamat.jarakKm.toFixed(1)} km)` : ""}
        </Text>
      </View>

      {terpilih ? (
        <View style={styles.dipakai}>
          <Ionicons name="checkmark-circle" size={14} color={colors.primary} />
          <Text style={styles.dipakaiText}>{TEKS.dipakai}</Text>
        </View>
      ) : (
        <Pressable style={styles.gunakan} onPress={onGunakan}>
          <Text style={styles.gunakanText}>{TEKS.gunakan}</Text>
        </Pressable>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  item: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: 10,
  },
  ditekan: { opacity: 0.85 },
  ikon: { width: 32, height: 32, borderRadius: 16, alignItems: "center", justifyContent: "center" },
  body: { flex: 1 },
  nama: { fontSize: 13, fontWeight: "700", color: colors.text },
  alamat: { fontSize: 11, color: colors.muted, marginTop: 2 },
  dipakai: { flexDirection: "row", alignItems: "center", gap: 4, paddingHorizontal: 6 },
  dipakaiText: { fontSize: 11, fontWeight: "700", color: colors.primary },
  gunakan: {
    backgroundColor: colors.accentSoftStrong,
    borderRadius: radius.sm,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  gunakanText: { fontSize: 11, fontWeight: "700", color: colors.text },
});
