import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing } from "@/theme";
import { TEKS } from "@/data/teks";

// Akordeon "Syarat & Ketentuan Penggunaan" di bawah daftar voucher saya
export default function SyaratKetentuan() {
  const [terbuka, setTerbuka] = useState(false);

  return (
    <View style={styles.card}>
      <Pressable style={styles.kepala} onPress={() => setTerbuka((t) => !t)}>
        <Ionicons name="help-circle-outline" size={20} color={colors.dark} />
        <Text style={styles.judul}>{TEKS.voucher.syarat.judul}</Text>
        <Ionicons name={terbuka ? "chevron-up" : "chevron-down"} size={18} color={colors.text} />
      </Pressable>

      {terbuka ? (
        <View style={styles.isi}>
          {TEKS.voucher.syarat.daftar.map((butir, i) => (
            <View key={i} style={styles.butir}>
              <Text style={styles.nomor}>{i + 1}.</Text>
              <Text style={styles.teks}>{butir}</Text>
            </View>
          ))}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.white, borderRadius: 14, marginTop: spacing.md },
  kepala: { flexDirection: "row", alignItems: "center", gap: 10, padding: spacing.lg },
  judul: { flex: 1, fontSize: 13, fontWeight: "700", color: colors.text },
  isi: { paddingHorizontal: spacing.lg, paddingBottom: spacing.lg, gap: 6 },
  butir: { flexDirection: "row", gap: 6 },
  nomor: { fontSize: 12, color: colors.textSoft },
  teks: { flex: 1, fontSize: 12, lineHeight: 17, color: colors.textSoft },
});
