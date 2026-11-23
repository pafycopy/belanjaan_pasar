import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors, radius, spacing } from "@/theme";
import { VarianProduk } from "@/types/produk";
import { formatHarga } from "@/utils/produk";

type Props = { pilihan: readonly VarianProduk[]; dipilihId: string; onPilih: (id: string) => void };

export default function PilihVarianProduk({ pilihan, dipilihId, onPilih }: Props) {
  // Data varian dapat berasal dari API/backend. Saring nilai kosong agar
  // satu data varian yang tidak lengkap tidak membuat halaman detail crash.
  const daftarAman = Array.isArray(pilihan)
    ? pilihan.filter((item): item is VarianProduk => !!item && typeof item === "object" && typeof item.id === "string")
    : [];

  if (daftarAman.length === 0) return null;

  return (
    <View style={styles.wrap}>
      <Text style={styles.judul}>Pilih Varian</Text>
      <View style={styles.daftar}>
        {daftarAman.map((varian, index) => {
          const aktif = varian.id === dipilihId;
          const stok = typeof varian.stok === "number" && Number.isFinite(varian.stok) ? varian.stok : undefined;
          const harga = typeof varian.harga === "number" && Number.isFinite(varian.harga) ? varian.harga : undefined;
          const hargaCoret = typeof varian.hargaCoret === "number" && Number.isFinite(varian.hargaCoret)
            ? varian.hargaCoret
            : undefined;
          const nonaktif = varian.aktif === false || (stok !== undefined && stok <= 0);
          const nama = typeof varian.nama === "string" && varian.nama.trim() ? varian.nama : `Varian ${index + 1}`;

          return (
            <Pressable
              key={`${varian.id}-${index}`}
              style={[styles.kartu, aktif ? styles.kartuAktif : undefined, nonaktif ? styles.kartuNonaktif : undefined]}
              onPress={() => onPilih(varian.id)}
              disabled={nonaktif}
              accessibilityRole="radio"
              accessibilityState={{ checked: aktif, disabled: nonaktif }}
            >
              <Text style={[styles.nama, aktif ? styles.teksAktif : undefined]}>{nama}</Text>
              {harga !== undefined ? (
                <Text style={[styles.harga, aktif ? styles.teksAktif : undefined]}>{formatHarga(harga)}</Text>
              ) : null}
              {hargaCoret !== undefined && harga !== undefined && hargaCoret > harga ? (
                <Text style={[styles.hargaCoret, aktif ? styles.teksAktif : undefined]}>{formatHarga(hargaCoret)}</Text>
              ) : null}
              {stok !== undefined ? (
                <Text style={[styles.stok, aktif ? styles.teksAktif : undefined]}>
                  Stok {stok} {varian.satuan ?? "paket"}
                </Text>
              ) : null}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: spacing.sm }, judul: { fontSize: 13, color: colors.textSoft, fontWeight: "600" },
  daftar: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  kartu: { minWidth: "30%", flexGrow: 1, padding: spacing.sm, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.white, gap: 3 },
  kartuAktif: { backgroundColor: colors.dark, borderColor: colors.dark }, kartuNonaktif: { opacity: 0.35 },
  nama: { color: colors.text, fontSize: 12, fontWeight: "700" }, harga: { color: colors.primary, fontSize: 11, fontWeight: "700" },
  stok: { color: colors.textSoft, fontSize: 10 }, hargaCoret: { color: colors.textSoft, fontSize: 10, textDecorationLine: "line-through" }, teksAktif: { color: colors.white },
});
