import { StyleSheet, Text, View } from "react-native";
import { colors, spacing } from "@/theme";
import { TEKS } from "@/data/teks";
import { OpsiPotongan } from "@/types/produk";
import KartuPilihan from "@/components/ui/kartupilihan";

const WARNA_IKON: Record<OpsiPotongan["warna"], string> = {
  hijau: colors.dark,
  cokelat: colors.brown,
};

type Props = {
  opsi: readonly OpsiPotongan[];
  dipilihId?: string;
  onPilih: (id: string) => void;
};

// Bagian "Request Potongan Gratis": grid 2 kolom pilihan tunggal
export default function OpsiPotonganProduk({ opsi, dipilihId, onPilih }: Props) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.judul}>{TEKS.produk.potongan}</Text>
      <View style={styles.grid}>
        {opsi.map((o) => (
          <KartuPilihan
            key={o.id}
            ikon={o.ikon}
            judul={o.judul}
            deskripsi={o.deskripsi}
            warnaIkon={WARNA_IKON[o.warna]}
            dipilih={o.id === dipilihId}
            onPress={() => onPilih(o.id)}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: spacing.md },
  judul: { fontSize: 18, fontWeight: "700", color: colors.text },
  grid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", rowGap: spacing.md },
});
