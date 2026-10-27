import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, radius, spacing } from "@/theme";
import { Alamat } from "@/types/alamat";
import { gayaKategori } from "@/data/kategorialamat";
import { TEKS } from "@/data/teks";

type Props = {
  alamat: Alamat;
  terpilih: boolean;
  kelola: boolean; // mode kelola: tampilkan tombol ubah & hapus
  onGunakan: () => void;
  onUbah: () => void;
  onHapus: () => void;
};

export default function AlamatItem({ alamat, terpilih, kelola, onGunakan, onUbah, onHapus }: Props) {
  const gaya = gayaKategori(alamat.kategori);

  return (
    <View style={styles.item}>
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

      {kelola ? (
        <View style={styles.aksi}>
          <Pressable style={[styles.kotak, styles.ubah]} onPress={onUbah} hitSlop={8}>
            <Ionicons name="pencil" size={16} color={colors.dark} />
          </Pressable>
          <Pressable style={[styles.kotak, styles.hapus]} onPress={onHapus} hitSlop={8}>
            <Ionicons name="trash" size={16} color={colors.danger} />
          </Pressable>
        </View>
      ) : terpilih ? (
        <View style={styles.dipakai}>
          <Ionicons name="checkmark-circle" size={14} color={colors.primary} />
          <Text style={styles.dipakaiText}>{TEKS.dipakai}</Text>
        </View>
      ) : (
        <Pressable style={styles.gunakan} onPress={onGunakan}>
          <Text style={styles.gunakanText}>{TEKS.gunakan}</Text>
        </Pressable>
      )}
    </View>
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
  ikon: { width: 32, height: 32, borderRadius: 16, alignItems: "center", justifyContent: "center" },
  body: { flex: 1 },
  nama: { fontSize: 13, fontWeight: "700", color: colors.text },
  alamat: { fontSize: 11, color: colors.muted, marginTop: 2 },
  aksi: { flexDirection: "row", gap: spacing.sm },
  kotak: { width: 32, height: 32, borderRadius: radius.sm, alignItems: "center", justifyContent: "center" },
  ubah: { backgroundColor: colors.primarySoft },
  hapus: { backgroundColor: colors.dangerSoft },
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
