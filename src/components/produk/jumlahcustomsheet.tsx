import { useState } from "react";
import { StyleSheet } from "react-native";
import { TEKS } from "@/data/teks";
import { FIELD_JUMLAH_CUSTOM } from "@/data/produk";
import BottomSheet from "@/components/ui/bottomsheet";
import Button from "@/components/ui/button";
import TextField from "@/components/ui/textfield";

type Props = {
  awal: number;
  maks: number;
  satuan: string;
  onTerapkan: (n: number) => void;
  onTutup: () => void;
};

// Lembar untuk mengetik jumlah sendiri (di luar tombol cepat)
export default function JumlahCustomSheet({ awal, maks, satuan, onTerapkan, onTutup }: Props) {
  const [teks, setTeks] = useState(String(awal));
  const [error, setError] = useState<string | undefined>();

  const terapkan = () => {
    const n = Number(teks);
    if (!/^\d{1,3}$/.test(teks.trim()) || n < 1 || n > maks) {
      setError(TEKS.produk.jumlahCustom.galat(maks));
      return;
    }
    onTerapkan(n);
  };

  return (
    <BottomSheet title={TEKS.produk.jumlahCustom.judul} onClose={onTutup}>
      <TextField
        field={{ ...FIELD_JUMLAH_CUSTOM, label: TEKS.produk.jumlahCustom.label(satuan) }}
        value={teks}
        onChangeText={(v) => {
          setTeks(v);
          setError(undefined);
        }}
        error={error}
      />
      <Button label={TEKS.produk.jumlahCustom.terapkan} onPress={terapkan} style={styles.tombol} />
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  tombol: { marginTop: 18 },
});
