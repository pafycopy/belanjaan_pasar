import { Modal, View, Text, Pressable, StyleSheet } from "react-native";
import { colors, radius, spacing } from "@/theme";
import { TEKS } from "@/data/teks";

type Props = {
  visible: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  // vertikal: tombol bertumpuk (bawaan). kompak: dua tombol bulat berdampingan, Batal di kiri.
  tata?: "vertikal" | "kompak";
};

export default function ConfirmDialog({
  visible,
  title,
  message,
  confirmLabel = TEKS.ya,
  cancelLabel = TEKS.batal,
  onConfirm,
  onCancel,
  tata = "vertikal",
}: Props) {
  const kompak = tata === "kompak";

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <View style={[styles.overlay, kompak && styles.overlayKompak]}>
        <View style={[styles.box, kompak && styles.boxKompak]}>
          <Text style={[styles.title, kompak && styles.titleKompak]}>{title}</Text>
          <Text style={[styles.message, kompak && styles.messageKompak]}>{message}</Text>

          {kompak ? (
            <View style={styles.aksiKompak}>
              <Pressable style={[styles.tombolKompak, styles.batalKompak]} onPress={onCancel}>
                <Text style={styles.batalTextKompak}>{cancelLabel}</Text>
              </Pressable>
              <Pressable style={[styles.tombolKompak, styles.konfirmasiKompak]} onPress={onConfirm}>
                <Text style={styles.konfirmasiTextKompak}>{confirmLabel}</Text>
              </Pressable>
            </View>
          ) : (
            <>
              <Pressable style={styles.confirm} onPress={onConfirm}>
                <Text style={styles.confirmText}>{confirmLabel}</Text>
              </Pressable>
              <Pressable style={styles.cancel} onPress={onCancel}>
                <Text style={styles.cancelText}>{cancelLabel}</Text>
              </Pressable>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  /* vertikal (bawaan) */
  overlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  box: {
    width: "100%",
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 20,
    gap: 10,
  },
  title: { fontSize: 18, fontWeight: "700", textAlign: "center", color: colors.text },
  message: { fontSize: 13, textAlign: "center", color: colors.muted, marginBottom: 6 },
  confirm: {
    backgroundColor: colors.dark,
    borderRadius: radius.md,
    paddingVertical: 12,
    alignItems: "center",
  },
  confirmText: { color: colors.white, fontWeight: "700" },
  cancel: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingVertical: 12,
    alignItems: "center",
  },
  cancelText: { color: colors.text, fontWeight: "600" },

  /* kompak */
  overlayKompak: { padding: 28 },
  boxKompak: {
    maxWidth: 360,
    padding: spacing.lg,
    borderRadius: radius.lg,
    gap: 0,
    elevation: 12,
  },
  titleKompak: { fontSize: 15 },
  messageKompak: {
    fontSize: 12,
    lineHeight: 17,
    marginTop: spacing.lg,
    marginBottom: spacing.lg,
  },
  aksiKompak: { flexDirection: "row", gap: spacing.sm },
  tombolKompak: {
    flex: 1,
    height: 36,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },
  batalKompak: { borderWidth: 1, borderColor: colors.borderStrong, backgroundColor: colors.white },
  konfirmasiKompak: { backgroundColor: colors.dark },
  batalTextKompak: { fontSize: 11, color: colors.textSoft, fontWeight: "600" },
  konfirmasiTextKompak: { fontSize: 11, color: colors.white, fontWeight: "700" },
});
