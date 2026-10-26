import { Modal, View, Text, Pressable, StyleSheet } from "react-native";
import { colors } from "@/theme";

type Props = {
  visible: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ConfirmDialog({
  visible,
  title,
  message,
  confirmLabel = "Ya",
  cancelLabel = "Batal",
  onConfirm,
  onCancel,
}: Props) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <View style={styles.overlay}>
        <View style={styles.box}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>

          <Pressable style={styles.confirm} onPress={onConfirm}>
            <Text style={styles.confirmText}>{confirmLabel}</Text>
          </Pressable>
          <Pressable style={styles.cancel} onPress={onCancel}>
            <Text style={styles.cancelText}>{cancelLabel}</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  box: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    gap: 10,
  },
  title: { fontSize: 18, fontWeight: "700", textAlign: "center", color: colors.text },
  message: { fontSize: 13, textAlign: "center", color: colors.muted, marginBottom: 6 },
  confirm: {
    backgroundColor: colors.dark,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
  },
  confirmText: { color: "#fff", fontWeight: "700" },
  cancel: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
  },
  cancelText: { color: colors.text, fontWeight: "600" },
});