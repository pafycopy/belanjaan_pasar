import ConfirmDialog from "@/components/alamat/confirmdialog";
import { TEKS } from "@/data/teks";

type Props = {
  visible: boolean;
  namaProduk?: string;
  onBatal: () => void;
  onKonfirmasi: () => void;
};

// Dialog konfirmasi hapus favorit: memakai ConfirmDialog bersama (tata "kompak") dengan teks dari TEKS
export default function KonfirmasiHapusFavorit({ visible, namaProduk, onBatal, onKonfirmasi }: Props) {
  return (
    <ConfirmDialog
      tata="kompak"
      visible={visible}
      title={TEKS.favorit.dialogHapus.judul}
      message={TEKS.favorit.dialogHapus.pesan(namaProduk)}
      confirmLabel={TEKS.favorit.dialogHapus.konfirmasi}
      cancelLabel={TEKS.batal}
      onConfirm={onKonfirmasi}
      onCancel={onBatal}
    />
  );
}
