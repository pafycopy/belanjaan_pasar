import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors } from "@/theme";
import { TEKS } from "@/data/teks";

export type IdTabVoucher = "tukar" | "saya";

type Props = {
  aktif: IdTabVoucher;
  jumlahMilik: number;
  onChange: (id: IdTabVoucher) => void;
};

// Pilihan dua tab: Tukar Voucher | Voucher Saya (dengan jumlah voucher yang dimiliki)
export default function TabVoucher({ aktif, jumlahMilik, onChange }: Props) {
  return (
    <View style={[styles.wadah, aktif === "saya" && styles.wadahTerang]}>
      <Pressable
        style={[styles.tab, aktif === "tukar" && styles.tabAktif]}
        onPress={() => onChange("tukar")}
      >
        <Text style={[styles.teks, aktif === "tukar" && styles.teksAktif]}>
          {TEKS.voucher.tab.tukar}
        </Text>
      </Pressable>

      <Pressable
        style={[styles.tab, aktif === "saya" && styles.tabAktif]}
        onPress={() => onChange("saya")}
      >
        <Text style={[styles.teks, aktif === "saya" && styles.teksAktif]}>
          {TEKS.voucher.tab.saya}
        </Text>
        {jumlahMilik > 0 ? (
          <View style={[styles.lencana, aktif === "saya" && styles.lencanaAktif]}>
            <Text style={[styles.lencanaTeks, aktif === "saya" && styles.lencanaTeksAktif]}>
              {jumlahMilik > 99 ? "99+" : jumlahMilik}
            </Text>
          </View>
        ) : null}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wadah: {
    flexDirection: "row",
    padding: 3,
    borderRadius: 14,
    backgroundColor: colors.accentSoftStrong,
  },
  wadahTerang: {
    backgroundColor: colors.white,
    elevation: 1,
    shadowColor: colors.shadow,
    shadowOpacity: 0.06,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
  },
  tab: {
    flex: 1,
    height: 42,
    borderRadius: 11,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  tabAktif: { backgroundColor: colors.dark },
  teks: { fontSize: 13, fontWeight: "700", color: colors.text },
  teksAktif: { color: colors.white },
  lencana: {
    minWidth: 18,
    height: 18,
    paddingHorizontal: 5,
    borderRadius: 9,
    backgroundColor: colors.brown,
    alignItems: "center",
    justifyContent: "center",
  },
  lencanaAktif: { backgroundColor: colors.white },
  lencanaTeks: { fontSize: 10, fontWeight: "700", color: colors.white },
  lencanaTeksAktif: { color: colors.dark },
});
