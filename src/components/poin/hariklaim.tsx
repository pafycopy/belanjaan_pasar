import { ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { colors, radius, spacing } from "@/theme";
import { TEKS } from "@/data/teks";
import { HadiahHarian, StatusHari } from "@/types/poin";

type Props = { item: HadiahHarian; status: StatusHari };

const T = TEKS.poin;

function Bulatan({ ukuran, bg, children }: { ukuran: number; bg: string; children: ReactNode }) {
  return (
    <View
      style={{
        width: ukuran,
        height: ukuran,
        borderRadius: ukuran / 2,
        backgroundColor: bg,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {children}
    </View>
  );
}

const Centang = ({ ukuran }: { ukuran: number }) => (
  <Bulatan ukuran={ukuran} bg={colors.green}>
    <Ionicons name="checkmark" size={ukuran * 0.52} color={colors.white} />
  </Bulatan>
);

// Lencana "Hari Ini!" yang melayang di atas kotak, di tengah
function LencanaHariIni() {
  return (
    <View style={styles.lencanaWrap} pointerEvents="none">
      <View style={styles.lencanaHariIni}>
        <Text style={styles.lencanaHariIniTeks}>{T.klaim.hariIni}</Text>
      </View>
    </View>
  );
}

// Satu kotak hari di grid klaim. Hari bonus tampil lebar (2 kolom).
export default function HariKlaim({ item, status }: Props) {
  const terklaim = status === "terklaim";
  const siap = status === "siap";
  const terkunci = status === "besok" || status === "terkunci";
  const labelStatus = T.statusHari[status];

  // ---------- Hari bonus (kartu lebar, latar gradasi) ----------
  if (item.bonus) {
    return (
      <View style={[styles.lebar, siap && styles.timbul]}>
        <LinearGradient
          colors={[colors.goldFade, colors.mintFade]}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={styles.bonus}
        >
          {terklaim ? (
            <Centang ukuran={38} />
          ) : (
            <Bulatan ukuran={38} bg={colors.gold}>
              <Ionicons name="gift-outline" size={20} color={colors.brown} />
            </Bulatan>
          )}

          <View style={styles.bonusTeks}>
            <View style={styles.bonusBaris}>
              <Text style={styles.hariHijau}>{T.klaim.hari(item.hari)}</Text>
              <View style={styles.lencanaBonus}>
                <Text style={styles.lencanaBonusTeks}>{T.klaim.superBonus}</Text>
              </View>
            </View>
            <Text style={styles.bonusIsi}>
              {T.klaim.tambahPoin(item.poin)}
              {item.keterangan ? ` + ${item.keterangan}` : ""}
            </Text>
            <Text style={[styles.label, (terklaim || siap) && styles.labelHijau]}>
              {terklaim || siap ? labelStatus : T.klaim.voucher}
            </Text>
          </View>
        </LinearGradient>
        {siap ? <LencanaHariIni /> : null}
      </View>
    );
  }

  // ---------- Hari biasa ----------
  return (
    <View
      style={[
        styles.kotak,
        siap ? styles.kotakSiap : terkunci ? styles.kotakKunci : styles.kotakTerklaim,
        siap && styles.timbul,
      ]}
    >
      {siap ? <LencanaHariIni /> : null}

      <Text style={[styles.hari, siap && styles.hariHijau, terkunci && styles.teksKunci]}>
        {T.klaim.hari(item.hari)}
      </Text>

      {terklaim ? (
        <Centang ukuran={34} />
      ) : siap ? (
        <Bulatan ukuran={34} bg={colors.gold}>
          <View style={styles.cincin}>
            <Ionicons name="star" size={11} color={colors.white} />
          </View>
        </Bulatan>
      ) : (
        <Bulatan ukuran={34} bg={colors.lockedCircle}>
          <Ionicons name="lock-closed-outline" size={16} color={colors.lockedFg} />
        </Bulatan>
      )}

      <Text
        style={[
          styles.poin,
          terklaim && styles.poinHijau,
          siap && styles.poinSiap,
          terkunci && styles.teksKunci,
        ]}
      >
        {T.klaim.tambahPoin(item.poin)}
      </Text>
      <Text
        style={[styles.label, siap && styles.labelHijau, terkunci && styles.teksKunci]}
        numberOfLines={1}
      >
        {labelStatus}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  // kotak biasa: 4 per baris. Lebar % + space-between di grid menjaga kolom tetap sejajar
  kotak: {
    width: "23.5%",
    minHeight: 108,
    borderRadius: 14,
    paddingVertical: spacing.md,
    paddingHorizontal: 4,
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
  },
  kotakTerklaim: { backgroundColor: colors.accentSoft },
  kotakSiap: { backgroundColor: "#e3e7fc" },
  kotakKunci: { backgroundColor: colors.lockedBg },
  timbul: {
    elevation: 3,
    shadowColor: colors.shadow,
    shadowOpacity: 0.14,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },

  hari: { fontSize: 12, fontWeight: "600", color: colors.textSoft },
  hariHijau: { fontSize: 12, fontWeight: "700", color: colors.green },
  poin: { fontSize: 12, fontWeight: "700", color: colors.textSoft },
  poinHijau: { color: colors.green },
  poinSiap: { fontSize: 15, fontWeight: "800", color: colors.brown },
  label: { fontSize: 10, color: colors.muted, textAlign: "center" },
  labelHijau: { fontWeight: "700", color: colors.green },
  teksKunci: { color: colors.lockedFg },

  cincin: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
  },

  // "Hari Ini!" menempel di atas kotak (tidak menutupi isinya)
  lencanaWrap: { position: "absolute", top: -28, left: 0, right: 0, alignItems: "center" },
  lencanaHariIni: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.xl,
    backgroundColor: colors.brown,
  },
  lencanaHariIniTeks: { fontSize: 10, fontWeight: "700", color: colors.white },

  // kartu bonus (2 kolom)
  lebar: { width: "49%", minHeight: 108 },
  bonus: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: spacing.md,
  },
  bonusTeks: { flex: 1, gap: 3 },
  bonusBaris: { flexDirection: "row", alignItems: "center", flexWrap: "wrap", columnGap: 4, rowGap: 2 },
  lencanaBonus: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    backgroundColor: colors.brown,
  },
  lencanaBonusTeks: { fontSize: 9, fontWeight: "700", color: colors.white },
  bonusIsi: { fontSize: 12, lineHeight: 16, fontWeight: "800", color: colors.text },
});
