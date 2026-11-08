import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import TeksTebal from "@/components/ui/tekstebal";
import { DataPetunjuk, PetunjukBank } from "@/data/pembayaran";
import { TEKS } from "@/data/teks";
import { colors, radius, spacing } from "@/theme";

type Props = {
  petunjuk: readonly PetunjukBank[];
  data: DataPetunjuk;
};

// Daftar cara bayar yang bisa dibuka satu per satu (yang pertama terbuka di awal)
export default function PetunjukPembayaran({ petunjuk, data }: Props) {
  const [terbuka, setTerbuka] = useState<string | null>(petunjuk[0]?.id ?? null);

  return (
    <View style={styles.kartu}>
      <Text style={styles.judul}>{TEKS.pembayaran.petunjuk.judul}</Text>

      <View style={styles.daftar}>
        {petunjuk.map((p) => {
          const buka = terbuka === p.id;
          return (
            <View key={p.id} style={styles.item}>
              <Pressable
                onPress={() => setTerbuka(buka ? null : p.id)}
                style={styles.kepala}
                accessibilityRole="button"
                accessibilityState={{ expanded: buka }}
              >
                <Ionicons name={p.ikon} size={18} color={colors.dark} />
                <Text style={styles.nama}>{p.judul}</Text>
                <Ionicons name={buka ? "chevron-up" : "chevron-down"} size={18} color={colors.textSoft} />
              </Pressable>

              {buka ? (
                <View style={styles.langkah}>
                  {p.langkah(data).map((teks, i) => (
                    <View key={i} style={styles.barisLangkah}>
                      <View style={styles.nomor}>
                        <Text style={styles.nomorTeks}>{i + 1}</Text>
                      </View>
                      <TeksTebal teks={teks} style={styles.teksLangkah} />
                    </View>
                  ))}
                </View>
              ) : null}
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  kartu: { backgroundColor: colors.white, borderRadius: radius.lg, padding: spacing.lg, gap: spacing.md },
  judul: { fontSize: 15, fontWeight: "800", color: colors.text },
  daftar: { gap: spacing.sm },
  item: { backgroundColor: colors.accentSoft, borderRadius: radius.md, overflow: "hidden" },
  kepala: { flexDirection: "row", alignItems: "center", gap: spacing.sm, padding: spacing.md },
  nama: { flex: 1, fontSize: 13, fontWeight: "700", color: colors.text },
  langkah: { paddingHorizontal: spacing.md, paddingBottom: spacing.md, paddingTop: spacing.xs, gap: spacing.md },
  barisLangkah: { flexDirection: "row", alignItems: "flex-start", gap: spacing.md },
  nomor: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.dark,
    alignItems: "center",
    justifyContent: "center",
  },
  nomorTeks: { fontSize: 12, fontWeight: "700", color: colors.white },
  teksLangkah: { flex: 1, fontSize: 13, lineHeight: 20, color: colors.text },
});
