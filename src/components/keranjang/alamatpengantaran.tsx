import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { TEKS } from "@/data/teks";
import { colors, radius, spacing } from "@/theme";
import { Alamat } from "@/types/alamat";
import { formatAlamatLengkap } from "@/utils/alamat";

type Props = { alamat: Alamat | null; };

export default function AlamatPengantaran({ alamat }: Props) {
  const router = useRouter();

  return (
    <View>
      <View style={styles.heading}>
        <Text style={styles.title}>{TEKS.keranjang.alamat.judul}</Text>
        <Pressable onPress={() => router.push("/alamat")} hitSlop={6}>
          <Text style={styles.ubah}>{TEKS.keranjang.alamat.ubah}</Text>
        </Pressable>
      </View>

      <Pressable style={styles.card} onPress={() => router.push("/alamat")}>
        <View style={styles.icon}><Ionicons name="location" size={15} color={colors.primary} /></View>
        {alamat ? (
          <View style={styles.content}>
            <Text style={styles.nama}>{alamat.namaPenerima} <Text style={styles.phone}>{alamat.noHp ?? ""}</Text></Text>
            <Text style={styles.text} numberOfLines={2}>{formatAlamatLengkap(alamat)}</Text>
          </View>
        ) : (
          <View style={styles.content}>
            <Text style={styles.nama}>{TEKS.keranjang.alamat.kosongJudul}</Text>
            <Text style={styles.text}>{TEKS.keranjang.alamat.kosongPesan}</Text>
          </View>
        )}
        <Ionicons name="chevron-forward" size={16} color={colors.muted} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  heading: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 7 },
  title: { fontSize: 12, fontWeight: "700", color: colors.text },
  ubah: { fontSize: 10, color: colors.primary, fontWeight: "700" },
  card: { flexDirection: "row", alignItems: "center", backgroundColor: colors.accentSoft, borderRadius: radius.md, padding: spacing.sm, gap: spacing.sm },
  icon: { width: 25, height: 25, borderRadius: 13, alignItems: "center", justifyContent: "center", backgroundColor: colors.white },
  content: { flex: 1 },
  nama: { fontSize: 10, fontWeight: "700", color: colors.text },
  phone: { fontWeight: "500", color: colors.muted },
  text: { fontSize: 9, lineHeight: 13, color: colors.muted, marginTop: 2 },
});
