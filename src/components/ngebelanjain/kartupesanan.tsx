import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Button from "@/components/ui/button";
import KepalaPesanan from "@/components/ngebelanjain/kepalapesanan";
import { MAKS_BARIS_DAFTAR } from "@/data/ngebelanjain";
import { TEKS_NGEBELANJAIN } from "@/data/teksngebelanjain";
import { colors, radius, spacing } from "@/theme";
import { PesananNgebelanjain } from "@/types/ngebelanjain";
import { pecahDaftar } from "@/utils/ngebelanjain";

type Props = {
  pesanan: PesananNgebelanjain;
  onDetail: () => void; // buka halaman detail pesanan
  onChat: () => void;   // dipakai saat status "dibelanjain"
};

const T = TEKS_NGEBELANJAIN;

// Kartu pesanan untuk tahap "Sedang Diproses" dan "Sedang Dibelanjain"
export default function KartuNgebelanjain({ pesanan: p, onDetail, onChat }: Props) {
  const dibelanjain = p.status === "dibelanjain";
  const [terbuka, setTerbuka] = useState(false);

  // Daftar panjang dipotong sampai MAKS_BARIS_DAFTAR baris; sisanya lewat "Baca selengkapnya"
  const baris = pecahDaftar(p.daftar);
  const terpotong = baris.length > MAKS_BARIS_DAFTAR;
  const tampil = terpotong && !terbuka ? baris.slice(0, MAKS_BARIS_DAFTAR) : baris;

  return (
    <View style={styles.kartu}>
      <KepalaPesanan pesanan={p} />

      <View style={styles.daftar}>
        <Text style={styles.judul}>{T.pesananAnda}</Text>
        {tampil.map((b, i) => (
          <Text key={i} style={styles.baris}>
            {b.teks}
          </Text>
        ))}

        {terpotong ? (
          <Pressable
            onPress={() => setTerbuka((v) => !v)}
            hitSlop={8}
            style={styles.bacaLagi}
            accessibilityRole="button"
          >
            <Text style={styles.bacaLagiTeks}>{terbuka ? T.lebihSedikit : T.bacaSelengkapnya}</Text>
          </Pressable>
        ) : null}
      </View>

      <View style={styles.aksi}>
        <Button
          label={T.detail}
          variant="outline"
          size="lg"
          onPress={onDetail}
          style={dibelanjain ? styles.tombolDetail : styles.tombolPenuh}
        />
        {dibelanjain ? <Button label={T.chatWa} size="lg" onPress={onChat} style={styles.tombolChat} /> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  kartu: {
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    padding: spacing.lg,
    gap: spacing.lg,
    shadowColor: colors.shadow,
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  daftar: { gap: 3 },
  judul: { fontSize: 15, fontWeight: "800", color: colors.textStrong, marginBottom: 2 },
  baris: { fontSize: 13, lineHeight: 19, color: colors.text },
  bacaLagi: { alignSelf: "flex-start", marginTop: spacing.xs },
  bacaLagiTeks: { fontSize: 12, fontWeight: "700", color: colors.dark },
  aksi: { flexDirection: "row", gap: spacing.sm },
  tombolPenuh: { flex: 1 },
  tombolDetail: { flex: 1 },
  tombolChat: { flex: 2 },
});
