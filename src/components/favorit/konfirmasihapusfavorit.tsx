import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { colors, radius, spacing } from "@/theme";

type Props = {
  visible: boolean;
  namaProduk?: string;
  onBatal: () => void;
  onKonfirmasi: () => void;
};

export default function KonfirmasiHapusFavorit({
  visible,
  namaProduk,
  onBatal,
  onKonfirmasi,
}: Props) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onBatal}>
      <View style={styles.overlay}>
        <View style={styles.dialog}>
          <Text style={styles.title}>Hapus produk ini?</Text>
          <Text style={styles.message}>
            {namaProduk
              ? `${namaProduk} akan dihapus dari daftar produk favorit Anda. Apakah Anda yakin ingin melanjutkan?`
              : "Produk yang dipilih akan dihapus dari daftar produk favorit Anda. Apakah Anda yakin ingin melanjutkan?"}
          </Text>
          <View style={styles.actions}>
            <Pressable style={[styles.button, styles.cancel]} onPress={onBatal}>
              <Text style={styles.cancelText}>Batal</Text>
            </Pressable>
            <Pressable style={[styles.button, styles.confirm]} onPress={onKonfirmasi}>
              <Text style={styles.confirmText}>Hapus Produk</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.38)",
    justifyContent: "center",
    alignItems: "center",
    padding: 28,
  },
  dialog: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: spacing.lg,
    elevation: 12,
  },
  title: { textAlign: "center", fontSize: 15, fontWeight: "700", color: colors.text },
  message: {
    textAlign: "center",
    fontSize: 12,
    lineHeight: 17,
    color: colors.muted,
    marginTop: spacing.lg,
    marginBottom: spacing.lg,
  },
  actions: { flexDirection: "row", gap: spacing.sm },
  button: {
    flex: 1,
    height: 36,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },
  cancel: { borderWidth: 1, borderColor: colors.borderStrong, backgroundColor: colors.white },
  confirm: { backgroundColor: colors.dark },
  cancelText: { fontSize: 11, color: colors.textSoft, fontWeight: "600" },
  confirmText: { fontSize: 11, color: colors.white, fontWeight: "700" },
});
