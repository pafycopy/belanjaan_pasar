import { useEffect, useState } from "react";
import { View, Text, Pressable, StyleSheet, StyleProp, ViewStyle } from "react-native";
import { colors } from "@/theme";

type Props = {
  openAt?: string;   // format "06:00"
  closeAt?: string;  // format "10:00"
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
};

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

export default function KiosStatusCard({
  openAt = "06:00",
  closeAt = "10:00",
  onPress,
  style,
}: Props) {
  const [now, setNow] = useState(getWIB());

  useEffect(() => {
    const timer = setInterval(() => setNow(getWIB()), 30000);
    return () => clearInterval(timer);
  }, []);

  const current = now.hours * 60 + now.minutes;
  const isOpen = current >= toMinutes(openAt) && current < toMinutes(closeAt);

  return (
    <View style={[styles.card, style]}>
      <View style={styles.topRow}>
        <Text style={styles.title}>
          Kios {isOpen ? "Buka" : "Tutup"} ({openAt.replace(":", ".")} - {closeAt.replace(":", ".")} WIB)
        </Text>
        <View style={styles.clock}>
          <Text style={styles.clockText}>
            {pad(now.hours)}.{pad(now.minutes)} WIB
          </Text>
        </View>
      </View>

      <Pressable onPress={onPress} style={[styles.button, !isOpen && { opacity: 0.7 }]}>
        <Text style={styles.buttonText}>{isOpen ? "Sedang Buka" : "Sedang Tutup"}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.dark,
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
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  clockText: { color: colors.dark, fontSize: 10, fontWeight: "700" },
  button: {
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
  },
  buttonText: { color: colors.dark, fontSize: 16, fontWeight: "800" },
});