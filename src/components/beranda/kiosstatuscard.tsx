import { useEffect, useState } from "react";
import { View, Text, Pressable, StyleSheet, StyleProp, ViewStyle } from "react-native";
import { colors } from "@/theme";

type Props = {
  openAt?: string;   // format "06:00"
  closeAt?: string;  // format "10:00"
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
};

const OPEN_COLOR = colors.dark;   // hijau saat buka
const CLOSED_COLOR = "#e53935";   // merah saat tutup

const toMinutes = (t: string) => {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
};
const pad = (n: number) => String(n).padStart(2, "0");

// Jam WIB (UTC+7), tidak bergantung pada zona waktu HP
function getWIB() {
  const d = new Date(Date.now() + 7 * 3600 * 1000);
  return { hours: d.getUTCHours(), minutes: d.getUTCMinutes() };
}

// Sisa menit sampai jam buka berikutnya (bisa besok pagi)
function minutesUntilOpen(current: number, open: number) {
  const diff = open - current;
  return diff > 0 ? diff : diff + 24 * 60;
}

export default function KiosStatusCard({
  openAt = "06:00",
  closeAt = "10:00",
  onPress,
  style,
}: Props) {
  const [now, setNow] = useState(getWIB());

  useEffect(() => {
    const timer = setInterval(() => setNow(getWIB()), 1000);
    return () => clearInterval(timer);
  }, []);

  const current = now.hours * 60 + now.minutes;
  const open = toMinutes(openAt);
  const close = toMinutes(closeAt);
  const isOpen = current >= open && current < close;

  const remaining = minutesUntilOpen(current, open);
  const remHours = Math.floor(remaining / 60);
  const remMinutes = remaining % 60;

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: isOpen ? OPEN_COLOR : CLOSED_COLOR },
        style,
      ]}
    >
      <View style={styles.topRow}>
        <Text style={styles.title}>
          Kios Buka ({openAt.replace(":", ".")} - {closeAt.replace(":", ".")} WIB)
        </Text>
        <View style={styles.clock}>
          <Text style={styles.clockText}>
            {pad(now.hours)}.{pad(now.minutes)} WIB
          </Text>
        </View>
      </View>

      {isOpen ? (
        <Pressable onPress={onPress} style={styles.box}>
          <Text style={styles.openText}>Sedang Buka</Text>
        </Pressable>
      ) : (
        <View style={styles.box}>
          <Text style={styles.caption}>KIOS AKAN BUKA DALAM</Text>
          <Text style={styles.countdown}>
            {pad(remHours)} JAM : {pad(remMinutes)} MENIT
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 14,
    padding: 14,
    gap: 12,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: { flex: 1, marginRight: 8, color: "#fff", fontSize: 13, fontWeight: "600" },
  clock: {
    backgroundColor: "#fff",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  clockText: { color: colors.dark, fontSize: 10, fontWeight: "700" },
  box: {
    backgroundColor: "#fff",
    borderRadius: 10,
    minHeight: 60,
    paddingVertical: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  openText: { color: "#1f2937", fontSize: 16, fontWeight: "800" },
  caption: { color: "#1f2937", fontSize: 10, fontWeight: "600", letterSpacing: 0.5 },
  countdown: {
    color: "#111827",
    fontSize: 22,
    fontWeight: "800",
    letterSpacing: 1,
    marginTop: 2,
  },
});