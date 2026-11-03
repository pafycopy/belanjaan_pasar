import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing } from "@/theme";
import { TEKS } from "@/data/teks";

const BARIS_RINGKAS = 4;

// Deskripsi yang bisa dilipat, dengan "Lihat Selengkapnya" untuk teks panjang
export default function DeskripsiProduk({ teks }: { teks: string }) {
  const [terbuka, setTerbuka] = useState(true);
  const [penuh, setPenuh] = useState(false);

  return (
    <View style={styles.wrap}>
      <Pressable style={styles.header} onPress={() => setTerbuka((v) => !v)} hitSlop={8}>
        <Text style={styles.judul}>{TEKS.produk.deskripsi}</Text>
        <Ionicons name={terbuka ? "chevron-down" : "chevron-forward"} size={20} color={colors.text} />
      </Pressable>

      {terbuka ? (
        <>
          <Text style={styles.isi} numberOfLines={penuh ? undefined : BARIS_RINGKAS}>
            {teks}
          </Text>
          <Pressable onPress={() => setPenuh((v) => !v)} hitSlop={8}>
            <Text style={styles.lihat}>
              {penuh ? TEKS.produk.lihatSedikit : TEKS.produk.lihatSelengkapnya}
            </Text>
          </Pressable>
        </>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: spacing.md },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  judul: { fontSize: 14, fontWeight: "700", color: colors.textSoft },
  isi: { fontSize: 13, lineHeight: 19, color: colors.text },
  lihat: { fontSize: 13, color: colors.text, textAlign: "center" },
});
