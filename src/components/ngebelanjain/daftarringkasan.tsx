import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { MAKS_BARIS_DAFTAR } from "@/data/ngebelanjain";
import { TEKS_NGEBELANJAIN } from "@/data/teksngebelanjain";
import { colors, spacing } from "@/theme";
import { BarisDaftar } from "@/utils/ngebelanjain";

type Props = {
  baris: readonly BarisDaftar[];
  bacaLagi: string; // teks tautan, mis. "Baca selengkapnya…"
};

// Daftar barang (nama di kiri, jumlah di kanan). Lebih dari MAKS_BARIS_DAFTAR baris dipotong
// dan sisanya dibuka lewat tautan "Baca selengkapnya…".
export default function DaftarRingkasan({ baris, bacaLagi }: Props) {
  const [terbuka, setTerbuka] = useState(false);
  const terpotong = baris.length > MAKS_BARIS_DAFTAR;
  const tampil = terpotong && !terbuka ? baris.slice(0, MAKS_BARIS_DAFTAR) : baris;

  return (
    <View style={styles.daftar}>
      {tampil.map((b, i) => (
        <View key={i} style={styles.baris}>
          <Text style={styles.nama}>{b.nama}</Text>
          {b.jumlah ? <Text style={styles.jumlah}>{b.jumlah}</Text> : null}
        </View>
      ))}

      {terpotong ? (
        <Pressable
          onPress={() => setTerbuka((v) => !v)}
          hitSlop={8}
          style={styles.tautan}
          accessibilityRole="button"
        >
          <Text style={styles.tautanTeks}>{terbuka ? TEKS_NGEBELANJAIN.lebihSedikit : bacaLagi}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  daftar: { gap: 6 },
  baris: { flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between", gap: spacing.md },
  nama: { flex: 1, fontSize: 13, color: colors.text },
  jumlah: { fontSize: 13, color: colors.text, textAlign: "right" },
  tautan: { alignSelf: "flex-start" },
  tautanTeks: { fontSize: 12, fontWeight: "800", color: colors.textStrong },
});
