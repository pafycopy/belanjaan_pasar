import { useState, ComponentProps } from "react";
import { View, Text, TextInput, Pressable, ScrollView, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useAlamat } from "@/context/alamat";
import ConfirmDialog from "@/components/alamat/confirmdialog";
import { colors } from "@/theme";

type IconName = ComponentProps<typeof Ionicons>["name"];

const kategoriStyle: Record<string, { icon: IconName; bg: string; fg: string }> = {
  "Rumah Utama": { icon: "home", bg: "#e8f5e9", fg: "#2e7d32" },
  "Warung / Usaha": { icon: "storefront", bg: "#ffe8d6", fg: "#c2570c" },
  "Dapur Katering": { icon: "restaurant", bg: "#e3ecff", fg: "#3b5bdb" },
  "Kos / Kontrakan": { icon: "business", bg: "#efe7ff", fg: "#6741d9" },
};
const fallbackStyle = { icon: "location" as IconName, bg: "#eeeeee", fg: "#555555" };

export default function PilihLokasi() {
  const router = useRouter();
  const { daftar, pilih, hapus } = useAlamat();
  const [kelola, setKelola] = useState(false);
  const [hapusId, setHapusId] = useState<string | null>(null);

  const goToMap = () => router.push("/alamat/pinpoint");

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.search}>
          <Ionicons name="location-outline" size={18} color={colors.primary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Cari lokasi yang kamu tuju"
            placeholderTextColor="#9e9e9e"
          />
        </View>

        <View style={styles.row}>
          <Pressable style={[styles.btn, styles.btnLight]} onPress={goToMap}>
            <Text style={styles.btnLightText}>Pilih Titik di Peta</Text>
          </Pressable>
          {/* Nanti: minta izin GPS dulu, lalu buka peta di posisi pengguna */}
          <Pressable style={[styles.btn, styles.btnDark]} onPress={goToMap}>
            <Ionicons name="navigate" size={14} color="#fff" />
            <Text style={styles.btnDarkText}>Lokasi Saya saat ini</Text>
          </Pressable>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.cardTitleRow}>
              <Ionicons name="bookmark-outline" size={16} color={colors.text} />
              <Text style={styles.cardTitle}>Alamat Tersimpan Lainnya ({daftar.length})</Text>
            </View>
            <Pressable onPress={() => setKelola((v) => !v)} hitSlop={8}>
              <Text style={styles.manage}>{kelola ? "Selesai" : "Kelola"}</Text>
            </Pressable>
          </View>

          {daftar.map((a) => {
            const s = kategoriStyle[a.kategori] ?? fallbackStyle;
            return (
              <View key={a.id} style={styles.item}>
                <View style={[styles.itemIcon, { backgroundColor: s.bg }]}>
                  <Ionicons name={s.icon} size={16} color={s.fg} />
                </View>

                <View style={{ flex: 1 }}>
                  <Text style={styles.itemName} numberOfLines={1}>
                    {a.namaPenerima}
                  </Text>
                  <Text style={styles.itemAddress} numberOfLines={1}>
                    {a.jalan}
                    {a.jarakKm != null ? ` (${a.jarakKm.toFixed(1)} km)` : ""}
                  </Text>
                </View>

                {kelola ? (
                  <Pressable style={styles.trash} onPress={() => setHapusId(a.id)} hitSlop={8}>
                    <Ionicons name="trash" size={16} color="#e53935" />
                  </Pressable>
                ) : (
                  <Pressable
                    style={styles.use}
                    onPress={() => {
                      pilih(a.id);
                      router.back();
                    }}
                  >
                    <Text style={styles.useText}>Gunakan</Text>
                  </Pressable>
                )}
              </View>
            );
          })}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Pressable style={styles.addButton} onPress={goToMap}>
          <Ionicons name="add" size={18} color="#fff" />
          <Text style={styles.addText}>Tambah Alamat Baru</Text>
        </Pressable>
      </View>

      <ConfirmDialog
        visible={hapusId !== null}
        title="Hapus alamat ini?"
        message="Alamat yang dipilih akan dihapus dari daftar alamat Anda. Tindakan ini tidak dapat dibatalkan."
        confirmLabel="Hapus"
        cancelLabel="Batal"
        onConfirm={() => {
          if (hapusId) hapus(hapusId);
          setHapusId(null);
        }}
        onCancel={() => setHapusId(null)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.surface },
  content: { padding: 16, gap: 12 },
  search: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    height: 44,
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 12,
  },
  searchInput: { flex: 1, fontSize: 13, padding: 0 },
  row: { flexDirection: "row", gap: 10 },
  btn: {
    flex: 1,
    height: 42,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  btnLight: { backgroundColor: "#fff", borderWidth: 1, borderColor: colors.border },
  btnLightText: { fontSize: 13, fontWeight: "700", color: colors.text },
  btnDark: { backgroundColor: colors.dark },
  btnDarkText: { fontSize: 13, fontWeight: "700", color: "#fff" },
  card: {
    backgroundColor: "#f3f4ff",
    borderRadius: 14,
    padding: 12,
    gap: 10,
  },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  cardTitleRow: { flexDirection: "row", alignItems: "center", gap: 6, flex: 1 },
  cardTitle: { fontSize: 12, fontWeight: "700", color: colors.text },
  manage: { fontSize: 12, fontWeight: "700", color: colors.dark },
  item: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 10,
  },
  itemIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  itemName: { fontSize: 13, fontWeight: "700", color: colors.text },
  itemAddress: { fontSize: 11, color: colors.muted, marginTop: 2 },
  use: {
    backgroundColor: "#eceefb",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  useText: { fontSize: 11, fontWeight: "700", color: colors.text },
  trash: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "#fdecea",
    alignItems: "center",
    justifyContent: "center",
  },
  footer: { padding: 16, backgroundColor: colors.surface },
  addButton: {
    height: 48,
    borderRadius: 12,
    backgroundColor: colors.dark,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  addText: { color: "#fff", fontSize: 14, fontWeight: "700" },
});