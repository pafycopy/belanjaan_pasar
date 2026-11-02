import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing } from "@/theme";
import { TEKS } from "@/data/teks";
import { NadaTag, Voucher } from "@/types/voucher";
import { formatRibuan } from "@/utils/angka";
import { formatTanggal } from "@/utils/waktu";
import Button from "@/components/ui/button";
import PemisahTiket from "@/components/voucher/pemisahtiket";

type Props = {
  voucher: Voucher;
  kedaluwarsa?: boolean;
  menukar?: boolean;
  onTukar: () => void;
};

const T = TEKS.voucher;

const WARNA_TAG: Record<NadaTag, { bg: string; fg: string }> = {
  hijau: { bg: colors.primarySoft, fg: colors.dark },
  peach: { bg: colors.peachSoft, fg: colors.brown },
};

export default function KartuVoucher({ voucher, kedaluwarsa, menukar, onTukar }: Props) {
  const tag = WARNA_TAG[voucher.nadaTag];
  const info = voucher.berlakuSampai
    ? T.berlaku(formatTanggal(voucher.berlakuSampai))
    : voucher.catatan;

  return (
    <View style={styles.card}>
      {voucher.populer ? (
        <View style={styles.pita}>
          <Ionicons name="flame" size={12} color={colors.brown} />
          <Text style={styles.pitaTeks}>{T.populer}</Text>
        </View>
      ) : null}

      <View style={styles.barisTag}>
        <View style={[styles.tag, { backgroundColor: tag.bg }]}>
          <Text style={[styles.tagTeks, { color: tag.fg }]}>{voucher.tag}</Text>
        </View>
        {voucher.kategori ? <Text style={styles.kategori}>{voucher.kategori}</Text> : null}
      </View>

      <Text style={styles.judul}>{voucher.judul}</Text>
      <Text style={styles.deskripsi}>{voucher.deskripsi}</Text>

      <View style={styles.pemisah}>
        <PemisahTiket warnaGaris="#d5d8e2" />
      </View>

      <View style={styles.footer}>
        <View style={styles.footerKiri}>
          {info ? <Text style={styles.info}>{info}</Text> : null}
          <Text style={styles.biaya}>{T.biaya(formatRibuan(voucher.biaya))}</Text>
        </View>

        <Button
          label={kedaluwarsa ? T.kedaluwarsa : T.tombolTukar(formatRibuan(voucher.biaya))}
          size="md"
          onPress={onTukar}
          disabled={kedaluwarsa}
          loading={menukar}
          style={styles.tombol}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: 14,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.lg,
    elevation: 1,
    shadowColor: colors.shadow,
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  pita: {
    position: "absolute",
    top: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderTopRightRadius: 14,
    borderBottomLeftRadius: 12,
    backgroundColor: colors.gold,
  },
  pitaTeks: { fontSize: 11, fontWeight: "700", color: colors.brown },

  barisTag: { flexDirection: "row", alignItems: "center", gap: spacing.sm, minHeight: 24 },
  tag: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  tagTeks: { fontSize: 11, fontWeight: "700" },
  kategori: { fontSize: 11, color: colors.muted },

  judul: { fontSize: 18, lineHeight: 24, fontWeight: "800", color: colors.text, marginTop: 10 },
  deskripsi: { fontSize: 12.5, lineHeight: 18, color: colors.textSoft, marginTop: 6, paddingRight: 24 },

  pemisah: { marginTop: 14 },

  footer: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: spacing.md, marginTop: 12 },
  footerKiri: { flex: 1, gap: 2 },
  info: { fontSize: 11, color: colors.muted },
  biaya: { fontSize: 14, fontWeight: "800", color: colors.green },
  tombol: { paddingHorizontal: 18, minWidth: 124, borderRadius: 24 },
});
