import { Alert, Linking } from "react-native";
import { NOMOR_WA_NGEBELANJAIN } from "@/data/ngebelanjain";
import { TEKS_NGEBELANJAIN } from "@/data/teksngebelanjain";
import { PesananNgebelanjain } from "@/types/ngebelanjain";

const T = TEKS_NGEBELANJAIN;

/** Chat langsung ke WhatsApp admin dengan pesan yang sudah terisi nomor pesanan. */
export function useChatNgebelanjain() {
  return async (p: PesananNgebelanjain) => {
    if (!NOMOR_WA_NGEBELANJAIN) {
      Alert.alert(T.waBelumDiatur.judul, T.waBelumDiatur.pesan);
      return;
    }
    try {
      await Linking.openURL(
        `https://wa.me/${NOMOR_WA_NGEBELANJAIN}?text=${encodeURIComponent(T.chatWaPesan(p.nomor))}`
      );
    } catch {
      Alert.alert(T.waGagal.judul, T.waGagal.pesan);
    }
  };
}
