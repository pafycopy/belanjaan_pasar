import { ComponentProps, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors } from "@/theme";
import { Alamat, AlamatInput, useAlamat } from "@/context/alamat";
import ConfirmDialog from "@/components/alamat/confirmdialog";
import { KATEGORI_ALAMAT } from "@/types/alamat";

type IconName = ComponentProps<typeof Ionicons>["name"];

const IKON_KATEGORI: Record<string, IconName> = {
  "Rumah Utama": "home",
  "Warung / Usaha": "storefront",
  "Dapur Katering": "restaurant",
  "Kos / Kontrakan": "business",
};
const LAINNYA = "__lainnya__";

type Params = {
  id?: string;
  lat?: string;
  lng?: string;
  jalan?: string;
  wilayah?: string;
  kota?: string;
  kodePos?: string;
};

type DataWilayah = { wilayah: string; kota: string; rt: string; rw: string; kodePos: string };

/* ---------- pembungkus: tunggu data siap ---------- */

export default function DetailPenerima() {
  const { id, lat, lng } = useLocalSearchParams<Params>();
  const { daftar, memuat } = useAlamat();

  if (memuat) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  const existing = id ? daftar.find((a) => a.id === id) : undefined;
  const latitude = Number(lat);
  const longitude = Number(lng);

  if ((id && !existing) || !lat || !lng || Number.isNaN(latitude) || Number.isNaN(longitude)) {
    return (
      <View style={styles.center}>
        <Text style={styles.muted}>Titik lokasi belum dipilih. Kembali dan pilih titik di peta.</Text>
      </View>
    );
  }

  return <Form existing={existing} latitude={latitude} longitude={longitude} />;
}

/* ---------- komponen kecil ---------- */

function Label({ teks, wajib }: { teks: string; wajib?: boolean }) {
  return (
    <Text style={styles.label}>
      {teks}
      {wajib ? <Text style={styles.bintang}> *</Text> : null}
    </Text>
  );
}

// Lembar bawah untuk mengisi kecamatan/kelurahan, RT/RW, dan kode pos.
// Dibuat (di-mount) hanya saat dibuka, jadi isiannya selalu mulai dari data terbaru.
function WilayahSheet({
  awal,
  onSimpan,
  onTutup,
}: {
  awal: DataWilayah;
  onSimpan: (d: DataWilayah) => void;
  onTutup: () => void;
}) {
  const insets = useSafeAreaInsets();
  const [draf, setDraf] = useState<DataWilayah>(awal);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const ubah = (k: keyof DataWilayah, v: string) => setDraf((d) => ({ ...d, [k]: v }));

  const simpan = () => {
    const e: Record<string, string> = {};
    if (draf.wilayah.trim().length < 3) e.wilayah = "Kecamatan & kelurahan wajib diisi";
    if (draf.rt.trim() && !/^\d{1,3}$/.test(draf.rt.trim())) e.rt = "RT berupa angka";
    if (draf.rw.trim() && !/^\d{1,3}$/.test(draf.rw.trim())) e.rw = "RW berupa angka";
    if (draf.kodePos.trim() && !/^\d{5}$/.test(draf.kodePos.trim())) e.kodePos = "Kode pos harus 5 angka";
    setErrors(e);
    if (Object.keys(e).length > 0) return;

    onSimpan({
      wilayah: draf.wilayah.trim(),
      kota: draf.kota.trim(),
      rt: draf.rt.trim() ? draf.rt.trim().padStart(2, "0") : "",
      rw: draf.rw.trim() ? draf.rw.trim().padStart(2, "0") : "",
      kodePos: draf.kodePos.trim(),
    });
  };

  return (
    <Modal transparent animationType="slide" onRequestClose={onTutup} statusBarTranslucent>
      <KeyboardAvoidingView
        style={styles.sheetOverlay}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <Pressable style={styles.sheetBackdrop} onPress={onTutup} />
        <View style={[styles.sheet, { paddingBottom: insets.bottom + 16 }]}>
          <View style={styles.sheetHeader}>
            <Text style={styles.sheetTitle}>Kecamatan & Kelurahan</Text>
            <Pressable onPress={onTutup} hitSlop={10}>
              <Ionicons name="close" size={22} color={colors.text} />
            </Pressable>
          </View>

          <Label teks="Kecamatan, Kelurahan" wajib />
          <TextInput
            style={[styles.input, errors.wilayah ? styles.inputError : null]}
            value={draf.wilayah}
            onChangeText={(v) => ubah("wilayah", v)}
            placeholder="Contoh: Kembangan, Meruya"
            placeholderTextColor="#9e9e9e"
          />
          {errors.wilayah ? <Text style={styles.error}>{errors.wilayah}</Text> : null}

          <Label teks="Kota / Kabupaten" />
          <TextInput
            style={styles.input}
            value={draf.kota}
            onChangeText={(v) => ubah("kota", v)}
            placeholder="Contoh: Jakarta Barat"
            placeholderTextColor="#9e9e9e"
          />

          <View style={styles.rowTiga}>
            <View style={{ flex: 1 }}>
              <Label teks="RT" />
              <TextInput
                style={[styles.input, errors.rt ? styles.inputError : null]}
                value={draf.rt}
                onChangeText={(v) => ubah("rt", v)}
                placeholder="04"
                placeholderTextColor="#9e9e9e"
                keyboardType="number-pad"
                maxLength={3}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Label teks="RW" />
              <TextInput
                style={[styles.input, errors.rw ? styles.inputError : null]}
                value={draf.rw}
                onChangeText={(v) => ubah("rw", v)}
                placeholder="02"
                placeholderTextColor="#9e9e9e"
                keyboardType="number-pad"
                maxLength={3}
              />
            </View>
            <View style={{ flex: 1.4 }}>
              <Label teks="Kode Pos" />
              <TextInput
                style={[styles.input, errors.kodePos ? styles.inputError : null]}
                value={draf.kodePos}
                onChangeText={(v) => ubah("kodePos", v)}
                placeholder="11640"
                placeholderTextColor="#9e9e9e"
                keyboardType="number-pad"
                maxLength={5}
              />
            </View>
          </View>
          {errors.rt || errors.rw || errors.kodePos ? (
            <Text style={styles.error}>{errors.rt ?? errors.rw ?? errors.kodePos}</Text>
          ) : null}

          <Pressable style={[styles.btnPrimary, { marginTop: 18 }]} onPress={simpan}>
            <Text style={styles.btnPrimaryText}>Simpan</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
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
  const insets = useSafeAreaInsets();
  const {
    jalan: jalanParam,
    wilayah: wilayahParam,
    kota: kotaParam,
    kodePos: kodePosParam,
  } = useLocalSearchParams<Params>();
  const { simpan, hapus } = useAlamat();

  // Kategori: salah satu dari daftar, atau "Lainnya" dengan teks sendiri
  const kategoriLama = existing?.kategori;
  const kategoriDikenal = !!kategoriLama && (KATEGORI_ALAMAT as readonly string[]).includes(kategoriLama);
  const [pilihan, setPilihan] = useState<string>(
    kategoriLama ? (kategoriDikenal ? kategoriLama : LAINNYA) : KATEGORI_ALAMAT[0]
  );
  const [kategoriKustom, setKategoriKustom] = useState(
    kategoriLama && !kategoriDikenal ? kategoriLama : ""
  );

  // Prioritas isian awal: hasil geocode dari pinpoint > data alamat lama > kosong
  const [namaPenerima, setNamaPenerima] = useState(existing?.namaPenerima ?? "");
  const [jalan, setJalan] = useState(jalanParam ?? existing?.jalan ?? "");
  const [patokan, setPatokan] = useState(existing?.patokan ?? "");
  const [area, setArea] = useState<DataWilayah>({
    wilayah: wilayahParam ?? existing?.wilayah ?? "",
    kota: kotaParam ?? existing?.kota ?? "",
    rt: existing?.rt ?? "",
    rw: existing?.rw ?? "",
    kodePos: kodePosParam ?? existing?.kodePos ?? "",
  });

  const [sheetTerbuka, setSheetTerbuka] = useState(false);
  const [konfirmasiHapus, setKonfirmasiHapus] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [menyimpan, setMenyimpan] = useState(false);

  const rtRw = area.rt || area.rw ? `RT ${area.rt || "-"} / RW ${area.rw || "-"}` : "";
  const ringkasan = [rtRw, area.kodePos ? `(Kode Pos ${area.kodePos})` : ""].filter(Boolean).join(" ");

  const validasi = (): Record<string, string> => {
    const e: Record<string, string> = {};
    if (pilihan === LAINNYA && kategoriKustom.trim().length < 2) {
      e.kategori = "Tulis nama label alamat";
    }
    if (namaPenerima.trim().length < 2) e.namaPenerima = "Nama penerima wajib diisi";
    if (area.wilayah.trim().length < 3) e.wilayah = "Pilih kecamatan & kelurahan";
    if (jalan.trim().length < 5) e.jalan = "Alamat lengkap wajib diisi (jalan dan nomor)";
    return e;
  };

  const onSimpan = async () => {
    const e = validasi();
    setErrors(e);
    if (Object.keys(e).length > 0) return;

    const data: AlamatInput = {
      kategori: pilihan === LAINNYA ? kategoriKustom.trim() : pilihan,
      namaPenerima: namaPenerima.trim(),
      noHp: existing?.noHp,
      jalan: jalan.trim(),
      wilayah: area.wilayah.trim(),
      kota: area.kota.trim() || undefined,
      rt: area.rt || undefined,
      rw: area.rw || undefined,
      kodePos: area.kodePos || undefined,
      patokan: patokan.trim() || undefined,
      latitude,
      longitude,
    };

    setMenyimpan(true);
    try {
      await simpan(data, existing?.id);
      router.dismissTo("/alamat"); // kembali ke daftar (melewati layar pinpoint)
    } catch {
      Alert.alert("Gagal menyimpan", "Terjadi kesalahan, coba lagi.");
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
        {/* Kategori / label alamat */}
        <Label teks="Kategori / Label Alamat" wajib />
        <View style={styles.chipRow}>
          {KATEGORI_ALAMAT.map((k) => {
            const aktif = pilihan === k;
            return (
              <Pressable
                key={k}
                style={[styles.chip, aktif && styles.chipActive]}
                onPress={() => setPilihan(k)}
              >
                <Ionicons name={IKON_KATEGORI[k]} size={13} color={aktif ? "#fff" : colors.text} />
                <Text style={[styles.chipText, aktif && styles.chipTextActive]}>{k}</Text>
              </Pressable>
            );
          })}
          <Pressable
            style={[styles.chip, pilihan === LAINNYA && styles.chipActive]}
            onPress={() => setPilihan(LAINNYA)}
          >
            <Ionicons name="add" size={14} color={pilihan === LAINNYA ? "#fff" : colors.text} />
            <Text style={[styles.chipText, pilihan === LAINNYA && styles.chipTextActive]}>Lainnya</Text>
          </Pressable>
        </View>
        {pilihan === LAINNYA ? (
          <TextInput
            style={[styles.input, { marginTop: 10 }, errors.kategori ? styles.inputError : null]}
            value={kategoriKustom}
            onChangeText={setKategoriKustom}
            placeholder="Nama label, contoh: Rumah Ibu"
            placeholderTextColor="#9e9e9e"
            maxLength={30}
          />
        ) : null}
        {errors.kategori ? <Text style={styles.error}>{errors.kategori}</Text> : null}

        {/* Nama penerima */}
        <Label teks="Nama Penerima" wajib />
        <View style={[styles.inputRow, errors.namaPenerima ? styles.inputError : null]}>
          <Ionicons name="person-outline" size={18} color="#9e9e9e" />
          <TextInput
            style={styles.inputRowText}
            value={namaPenerima}
            onChangeText={setNamaPenerima}
            placeholder="Ketik nama Anda disini"
            placeholderTextColor="#9e9e9e"
          />
        </View>
        {errors.namaPenerima ? <Text style={styles.error}>{errors.namaPenerima}</Text> : null}

        {/* Kecamatan & kelurahan (baris pilihan) */}
        <Label teks={`Kecamatan & Kelurahan${area.kota ? ` (${area.kota})` : ""}`} wajib />
        <Pressable
          style={[styles.pickerRow, errors.wilayah ? styles.inputError : null]}
          onPress={() => setSheetTerbuka(true)}
        >
          <Ionicons name="map-outline" size={18} color="#9e9e9e" />
          <View style={{ flex: 1 }}>
            {area.wilayah ? (
              <>
                <Text style={styles.pickerTitle} numberOfLines={1}>
                  {area.wilayah}
                </Text>
                {ringkasan ? (
                  <Text style={styles.pickerSub} numberOfLines={1}>
                    {ringkasan}
                  </Text>
                ) : null}
              </>
            ) : (
              <Text style={styles.pickerPlaceholder}>Pilih kecamatan & kelurahan</Text>
            )}
          </View>
          <Ionicons name="chevron-forward" size={18} color="#9e9e9e" />
        </Pressable>
        {errors.wilayah ? <Text style={styles.error}>{errors.wilayah}</Text> : null}

        {/* Alamat lengkap */}
        <Label teks="Alamat Lengkap & Nomor Rumah" wajib />
        <TextInput
          style={[styles.input, styles.inputAlamat, errors.jalan ? styles.inputError : null]}
          value={jalan}
          onChangeText={setJalan}
          placeholder="Ketik alamat Anda disini"
          placeholderTextColor="#9e9e9e"
          multiline
        />
        {errors.jalan ? <Text style={styles.error}>{errors.jalan}</Text> : null}

        {/* Patokan */}
        <View style={styles.patokanCard}>
          <View style={styles.patokanHeader}>
            <View style={styles.patokanIcon}>
              <Ionicons name="flag" size={12} color={colors.dark} />
            </View>
            <Text style={styles.patokanTitle}>Patokan Rumah / Tempat Cantolan</Text>
            <Text style={styles.opsional}>Opsional</Text>
          </View>
          <Text style={styles.patokanHelp}>
            Penting saat gerbang komplek masih sepi atau pintu belum dibuka pukul 06.00 pagi.
          </Text>
          <TextInput
            style={styles.patokanInput}
            value={patokan}
            onChangeText={setPatokan}
            placeholder="Contoh: Pagar besi warna hitam tinggi, depan bundaran Blok H. Gantung kantong ayam di cantolan dinding dekat meteran air."
            placeholderTextColor="#9e9e9e"
            multiline
          />
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + 12 }]}>
        <Pressable
          style={[styles.btnPrimary, menyimpan && styles.btnDisabled]}
          onPress={onSimpan}
          disabled={menyimpan}
        >
          {menyimpan ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.btnPrimaryText}>Simpan Alamat Pengantaran</Text>
          )}
        </Pressable>
        {existing ? (
          <Pressable style={styles.btnOutline} onPress={() => setKonfirmasiHapus(true)}>
            <Text style={styles.btnOutlineText}>Hapus</Text>
          </Pressable>
        ) : null}
      </View>

      {sheetTerbuka ? (
        <WilayahSheet
          awal={area}
          onSimpan={(d) => {
            setArea(d);
            setSheetTerbuka(false);
          }}
          onTutup={() => setSheetTerbuka(false)}
        />
      ) : null}

      <ConfirmDialog
        visible={konfirmasiHapus}
        title="Hapus alamat ini?"
        message="Alamat yang dipilih akan dihapus dari daftar alamat Anda. Tindakan ini tidak dapat dibatalkan."
        confirmLabel="Hapus"
        cancelLabel="Batal"
        onConfirm={onHapus}
        onCancel={() => setKonfirmasiHapus(false)}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#fff" },
  center: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24 },
  muted: { color: colors.muted, textAlign: "center" },
  content: { padding: 16, paddingBottom: 24 },

  label: { fontSize: 13, fontWeight: "700", color: colors.text, marginTop: 16, marginBottom: 8 },
  bintang: { color: "#e53935" },
  error: { color: "#e53935", fontSize: 12, marginTop: 4 },

  /* chip kategori */
  chipRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: colors.border,
    elevation: 1,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
  },
  chipActive: { backgroundColor: colors.dark, borderColor: colors.dark },
  chipText: { fontSize: 12, fontWeight: "600", color: colors.text },
  chipTextActive: { color: "#fff" },

  /* input */
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 11,
    fontSize: 14,
    color: colors.text,
    backgroundColor: "#fff",
  },
  inputAlamat: { minHeight: 48, textAlignVertical: "top" },
  inputError: { borderColor: "#e53935" },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    height: 48,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    backgroundColor: "#fff",
  },
  inputRowText: { flex: 1, fontSize: 14, color: colors.text, padding: 0 },

  /* baris pilihan kecamatan & kelurahan */
  pickerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    minHeight: 54,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "#fff",
  },
  pickerTitle: { fontSize: 14, fontWeight: "700", color: colors.text },
  pickerSub: { fontSize: 11, color: colors.muted, marginTop: 2 },
  pickerPlaceholder: { fontSize: 14, color: "#9e9e9e" },

  /* kartu patokan */
  patokanCard: {
    marginTop: 18,
    padding: 12,
    gap: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: "#f7faf7",
  },
  patokanHeader: { flexDirection: "row", alignItems: "center", gap: 8 },
  patokanIcon: {
    width: 22,
    height: 22,
    borderRadius: 6,
    backgroundColor: colors.card,
    alignItems: "center",
    justifyContent: "center",
  },
  patokanTitle: { flex: 1, fontSize: 12, fontWeight: "700", color: colors.text },
  opsional: { fontSize: 11, color: colors.muted },
  patokanHelp: { fontSize: 11, color: colors.muted, lineHeight: 16 },
  patokanInput: {
    minHeight: 84,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    backgroundColor: "#ebedf0",
    padding: 10,
    fontSize: 12,
    color: colors.text,
    textAlignVertical: "top",
  },

  /* footer */
  footer: {
    paddingHorizontal: 16,
    paddingTop: 12,
    gap: 10,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  btnPrimary: {
    height: 48,
    borderRadius: 12,
    backgroundColor: colors.dark,
    alignItems: "center",
    justifyContent: "center",
  },
  btnPrimaryText: { color: "#fff", fontSize: 14, fontWeight: "700" },
  btnDisabled: { opacity: 0.6 },
  btnOutline: {
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  btnOutlineText: { color: "#4b5563", fontSize: 13, fontWeight: "600" },

  /* lembar bawah wilayah */
  sheetOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.4)" },
  sheetBackdrop: { flex: 1 },
  sheet: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  sheetHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  sheetTitle: { fontSize: 16, fontWeight: "700", color: colors.text },
  rowTiga: { flexDirection: "row", gap: 10 },
});