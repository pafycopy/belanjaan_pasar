import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { colors, radius, spacing } from "@/theme";
import { TEKS } from "@/data/teks";
import { Alamat } from "@/types/alamat";
import { formatAlamatLengkap, judulAlamat, samarkanNoHp } from "@/utils/alamat";

type Props = { alamat: Alamat | null };

const T = TEKS.keranjang.alamat;

// Kartu alamat pengantaran: judul + "Ubah Alamat", lalu kotak ringkasan alamat terpilih
export default function AlamatPengantaran({ alamat }: Props) {
  const router = useRouter();
  const keAlamat = () => router.push("/alamat");
  const tampilan = alamat ? judulAlamat(alamat) : null;

  return (
    <View style={styles.kartu}>
      <View style={styles.heading}>
        <View style={styles.judulBaris}>
          <Ionicons name="location" size={18} color={colors.dark} />
          <Text style={styles.title}>{T.judul}</Text>
        </View>
        <Pressable onPress={keAlamat} hitSlop={6}>
          <Text style={styles.ubah}>{T.ubah}</Text>
        </Pressable>
      </View>

      <Pressable style={styles.kotak} onPress={keAlamat}>
        {alamat && tampilan ? (
          <>
            <View style={styles.namaBaris}>
              <Text style={styles.nama}>{tampilan.judul}</Text>
              {tampilan.utama ? (
                <View style={styles.lencana}>
                  <Text style={styles.lencanaText}>{T.utama}</Text>
                </View>
              ) : null}
            </View>
            <Text style={styles.alamat}>{formatAlamatLengkap(alamat)}</Text>
            {alamat.patokan ? <Text style={styles.detail}>{T.patokan(alamat.patokan)}</Text> : null}
            {alamat.noHp ? <Text style={styles.detail}>({samarkanNoHp(alamat.noHp)})</Text> : null}
          </>
        ) : (
          <>
            <Text style={styles.nama}>{T.kosongJudul}</Text>
            <Text style={styles.alamat}>{T.kosongPesan}</Text>
          </>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  kartu: { backgroundColor: colors.white, borderRadius: radius.lg, padding: spacing.md, gap: spacing.md },
  heading: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  judulBaris: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  title: { fontSize: 14, fontWeight: "700", color: colors.text },
  ubah: { fontSize: 12, fontWeight: "700", color: colors.dark },
  kotak: { backgroundColor: colors.accentSoft, borderRadius: radius.md, padding: spacing.md, gap: spacing.xs },
  namaBaris: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  nama: { fontSize: 12, fontWeight: "700", color: colors.text },
  lencana: { backgroundColor: colors.lockedCircle, borderRadius: radius.xl, paddingHorizontal: spacing.sm, paddingVertical: 2 },
  lencanaText: { fontSize: 10, fontWeight: "600", color: colors.textSoft },
  alamat: { fontSize: 12, lineHeight: 18, color: colors.muted, marginTop: spacing.xs },
  detail: { fontSize: 11, lineHeight: 16, color: colors.muted },
});
