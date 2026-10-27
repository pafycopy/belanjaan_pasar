import { useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { colors, spacing } from "@/theme";
import { Alamat, useAlamat } from "@/context/alamat";
import { useForm } from "@/hooks/useform";
import { parseKoordinat } from "@/services/lokasi";
import {
  ATURAN_FORM,
  ATURAN_KATEGORI_KUSTOM,
  FIELD_ALAMAT,
  KunciForm,
} from "@/data/formalamat";
import { KATEGORI_ALAMAT, KATEGORI_LAINNYA } from "@/data/kategorialamat";
import { TEKS } from "@/data/teks";
import {
  kategoriIdAwal,
  keAlamatInput,
  labelDenganKota,
  nilaiAwalForm,
  ringkasanWilayah,
} from "@/utils/alamat";
import { cekField } from "@/utils/validasi";
import ConfirmDialog from "@/components/alamat/confirmdialog";
import PatokanCard from "@/components/alamat/patokancard";
import WilayahSheet from "@/components/alamat/wilayahsheet";
import Button from "@/components/ui/button";
import ChipGroup from "@/components/ui/chipgroup";
import FooterBar from "@/components/ui/footerbar";
import FormField from "@/components/ui/formfield";
import PickerRow from "@/components/ui/pickerrow";
import ScreenState from "@/components/ui/screenstate";
import TextField from "@/components/ui/textfield";

type Params = {
  id?: string;
  lat?: string;
  lng?: string;
  jalan?: string;
  wilayah?: string;
  kota?: string;
  kodePos?: string;
};

// Pilihan chip = kategori dari data + "Lainnya"
const PILIHAN_KATEGORI = [...KATEGORI_ALAMAT, KATEGORI_LAINNYA];

/* ---------- pembungkus: tunggu data siap ---------- */

export default function DetailPenerima() {
  const { id, lat, lng } = useLocalSearchParams<Params>();
  const { daftar, memuat } = useAlamat();

  if (memuat) return <ScreenState loading />;

  const existing = id ? daftar.find((a) => a.id === id) : undefined;
  const titik = parseKoordinat(lat, lng);

  if ((id && !existing) || !titik) return <ScreenState message={TEKS.detail.titikBelumDipilih} />;

  return <Form existing={existing} latitude={titik.latitude} longitude={titik.longitude} />;
}

/* ---------- form ---------- */

function Form({
  existing,
  latitude,
  longitude,
}: {
  existing?: Alamat;
  latitude: number;
  longitude: number;
}) {
  const router = useRouter();
  const params = useLocalSearchParams<Params>();
  const { simpan, hapus } = useAlamat();

  // Isian awal: hasil geocode dari pinpoint > data alamat lama > kosong
  const form = useForm<KunciForm>(nilaiAwalForm(existing, params), ATURAN_FORM);
  const { nilai, errors } = form;

  const [kategoriId, setKategoriId] = useState(kategoriIdAwal(existing));
  const [sheetTerbuka, setSheetTerbuka] = useState(false);
  const [konfirmasiHapus, setKonfirmasiHapus] = useState(false);
  const [menyimpan, setMenyimpan] = useState(false);

  const pakaiKustom = kategoriId === KATEGORI_LAINNYA.id;

  const onSimpan = async () => {
    // Label kustom hanya divalidasi bila "Lainnya" dipilih
    const errKustom = pakaiKustom ? cekField(nilai.kategoriKustom, ATURAN_KATEGORI_KUSTOM) : null;
    if (!form.validasi(errKustom ? { kategoriKustom: errKustom } : undefined)) return;

    setMenyimpan(true);
    try {
      await simpan(
        keAlamatInput({ nilai, kategoriId, latitude, longitude, noHp: existing?.noHp }),
        existing?.id
      );
      router.dismissTo("/alamat"); // kembali ke daftar (melewati layar pinpoint)
    } catch {
      Alert.alert(TEKS.peringatan.gagalSimpan.judul, TEKS.peringatan.gagalSimpan.pesan);
    } finally {
      setMenyimpan(false);
    }
  };

  const onHapus = () => {
    if (!existing) return;
    hapus(existing.id);
    setKonfirmasiHapus(false);
    router.dismissTo("/alamat");
  };

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <FormField label={TEKS.detail.labelKategori} wajib>
          <ChipGroup items={PILIHAN_KATEGORI} selectedId={kategoriId} onSelect={setKategoriId} />
        </FormField>
        {pakaiKustom ? (
          <TextField
            field={{ ...FIELD_ALAMAT.kategoriKustom, label: "" }}
            value={nilai.kategoriKustom}
            onChangeText={(v) => form.ubah("kategoriKustom", v)}
            error={errors.kategoriKustom}
            style={styles.rapat}
          />
        ) : null}

        <TextField
          field={FIELD_ALAMAT.namaPenerima}
          value={nilai.namaPenerima}
          onChangeText={(v) => form.ubah("namaPenerima", v)}
          error={errors.namaPenerima}
        />

        <FormField
          label={labelDenganKota(TEKS.detail.labelWilayah, nilai.kota)}
          wajib
          error={errors.wilayah}
        >
          <PickerRow
            icon="map-outline"
            title={nilai.wilayah}
            subtitle={ringkasanWilayah(nilai.rt, nilai.rw, nilai.kodePos)}
            placeholder={TEKS.detail.pilihWilayah}
            invalid={!!errors.wilayah}
            onPress={() => setSheetTerbuka(true)}
          />
        </FormField>

        <TextField
          field={FIELD_ALAMAT.jalan}
          value={nilai.jalan}
          onChangeText={(v) => form.ubah("jalan", v)}
          error={errors.jalan}
        />

        <PatokanCard
          field={FIELD_ALAMAT.patokan}
          value={nilai.patokan}
          onChangeText={(v) => form.ubah("patokan", v)}
        />
      </ScrollView>

      <FooterBar>
        <Button label={TEKS.detail.simpan} onPress={onSimpan} loading={menyimpan} />
        {existing ? (
          <Button
            label={TEKS.hapus}
            variant="outline"
            size="md"
            onPress={() => setKonfirmasiHapus(true)}
          />
        ) : null}
      </FooterBar>

      {sheetTerbuka ? (
        <WilayahSheet
          awal={{
            wilayah: nilai.wilayah,
            kota: nilai.kota,
            rt: nilai.rt,
            rw: nilai.rw,
            kodePos: nilai.kodePos,
          }}
          onSimpan={(data) => {
            form.ubahBanyak(data);
            setSheetTerbuka(false);
          }}
          onTutup={() => setSheetTerbuka(false)}
        />
      ) : null}

      <ConfirmDialog
        visible={konfirmasiHapus}
        title={TEKS.dialogHapus.judul}
        message={TEKS.dialogHapus.pesan}
        confirmLabel={TEKS.hapus}
        cancelLabel={TEKS.batal}
        onConfirm={onHapus}
        onCancel={() => setKonfirmasiHapus(false)}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.white },
  content: { padding: spacing.lg, paddingBottom: spacing.xl },
  rapat: { marginTop: 10 },
});
