import { StyleSheet, View } from "react-native";
import BottomSheet from "@/components/ui/bottomsheet";
import TextField from "@/components/ui/textfield";
import Button from "@/components/ui/button";
import { useForm } from "@/hooks/useform";
import { BARIS_WILAYAH, FIELD_WILAYAH, KunciWilayah, ATURAN_WILAYAH } from "@/data/formalamat";
import { TEKS } from "@/data/teks";
import { padRtRw } from "@/utils/alamat";

export type DataWilayah = Record<KunciWilayah, string>;

type Props = {
  awal: DataWilayah;
  onSimpan: (data: DataWilayah) => void;
  onTutup: () => void;
};

// Lembar pengisian kecamatan/kelurahan, RT/RW, kode pos. Susunan field datang dari BARIS_WILAYAH.
export default function WilayahSheet({ awal, onSimpan, onTutup }: Props) {
  const form = useForm<KunciWilayah>(awal, ATURAN_WILAYAH);

  const simpan = () => {
    if (!form.validasi()) return;
    const n = form.nilai;
    onSimpan({
      wilayah: n.wilayah.trim(),
      kota: n.kota.trim(),
      rt: padRtRw(n.rt),
      rw: padRtRw(n.rw),
      kodePos: n.kodePos.trim(),
    });
  };

  return (
    <BottomSheet title={TEKS.detail.labelWilayah} onClose={onTutup}>
      {BARIS_WILAYAH.map((baris, i) => (
        <View key={i} style={styles.baris}>
          {baris.map(({ kunci, flex }) => (
            <TextField
              key={kunci}
              field={FIELD_WILAYAH[kunci]}
              value={form.nilai[kunci]}
              onChangeText={(v) => form.ubah(kunci, v)}
              error={form.errors[kunci]}
              style={{ flex: flex ?? 1 }}
            />
          ))}
        </View>
      ))}

      <Button label={TEKS.detail.simpanSheet} onPress={simpan} style={styles.tombol} />
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  baris: { flexDirection: "row", gap: 10 },
  tombol: { marginTop: 18 },
});
