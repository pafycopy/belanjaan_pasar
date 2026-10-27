import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Alert, Pressable, StyleSheet, Text, View } from "react-native";
import MapView, { Region } from "react-native-maps";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors } from "@/theme";
import { Alamat, useAlamat } from "@/context/alamat";
import {
  HasilGeocode,
  Koordinat,
  KOORDINAT_DEFAULT,
  ZOOM_DELTA,
  alamatDariKoordinat,
  ambilPosisiSaya,
  pastikanIzinLokasi,
  samaTempat,
} from "@/services/lokasi";

type Params = { id?: string; gps?: string; lat?: string; lng?: string };

/* ---------- pembungkus: tunggu data siap ---------- */

export default function Pinpoint() {
  const { id } = useLocalSearchParams<Params>();
  const { daftar, memuat } = useAlamat();

  if (memuat) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  const existing = id ? daftar.find((a) => a.id === id) : undefined;
  if (id && !existing) {
    return (
      <View style={styles.center}>
        <Text style={styles.muted}>Alamat tidak ditemukan.</Text>
      </View>
    );
  }

  return <Peta existing={existing} />;
}

/* ---------- peta dengan pin di tengah ---------- */

function Peta({ existing }: { existing?: Alamat }) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { gps, lat, lng } = useLocalSearchParams<Params>();

  const mapRef = useRef<MapView>(null);
  const urutanGeocode = useRef(0);

  // Titik awal: alamat yang diubah > hasil pencarian > default (nanti digeser ke posisi user bila izin ada)
  const dariPencarian =
    lat && lng && !Number.isNaN(Number(lat)) && !Number.isNaN(Number(lng))
      ? { latitude: Number(lat), longitude: Number(lng) }
      : null;

  const [wilayahAwal] = useState<Region>(() => {
    const titik = existing
      ? { latitude: existing.latitude, longitude: existing.longitude }
      : (dariPencarian ?? KOORDINAT_DEFAULT);
    return { ...titik, latitudeDelta: ZOOM_DELTA, longitudeDelta: ZOOM_DELTA };
  });
  const [titik, setTitik] = useState<Koordinat>({
    latitude: wilayahAwal.latitude,
    longitude: wilayahAwal.longitude,
  });
  const [hasil, setHasil] = useState<HasilGeocode | null>(null);
  const [mencari, setMencari] = useState(false);
  const [mencariGps, setMencariGps] = useState(false);
  const [adaIzin, setAdaIzin] = useState(false);

  const geserKe = (c: Koordinat) => {
    mapRef.current?.animateToRegion(
      { ...c, latitudeDelta: ZOOM_DELTA, longitudeDelta: ZOOM_DELTA },
      400
    );
  };

  // Saat layar dibuka: minta izin lokasi (dibutuhkan untuk mengisi alamat otomatis dari pin)
  useEffect(() => {
    let aktif = true;
    (async () => {
      const izin = await pastikanIzinLokasi();
      if (!aktif) return;
      setAdaIzin(izin);
      // Alamat baru tanpa titik dari pencarian: buka peta di posisi user
      if (!existing && !dariPencarian) {
        const pos = await ambilPosisiSaya();
        if (!aktif) return;
        if (pos) geserKe(pos);
        else if (gps === "1") {
          Alert.alert(
            "Lokasi tidak tersedia",
            "Izinkan akses lokasi di pengaturan HP, atau geser peta secara manual."
          );
        }
      }
    })();
    return () => {
      aktif = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const perbaruiAlamat = async (c: Koordinat) => {
    const urutan = ++urutanGeocode.current;
    setMencari(true);
    const h = await alamatDariKoordinat(c);
    if (urutan !== urutanGeocode.current) return; // sudah ada permintaan yang lebih baru
    setMencari(false);
    setHasil(h);
  };

  const onRegionChangeComplete = (region: Region) => {
    const c = { latitude: region.latitude, longitude: region.longitude };
    setTitik(c);
    // Mode ubah: selama pin masih di titik tersimpan, pakai data lama (jangan geocode ulang)
    if (existing && samaTempat(c, existing)) {
      urutanGeocode.current++;
      setMencari(false);
      setHasil(null);
      return;
    }
    void perbaruiAlamat(c);
  };

  const onPressLokasiSaya = async () => {
    setMencariGps(true);
    const pos = await ambilPosisiSaya();
    setMencariGps(false);
    if (!pos) {
      Alert.alert(
        "Lokasi tidak tersedia",
        "Izinkan akses lokasi di pengaturan HP, atau geser peta secara manual."
      );
      return;
    }
    setAdaIzin(true);
    geserKe(pos);
  };

  const lanjut = () => {
    router.push({
      pathname: "/alamat/detail",
      params: {
        ...(existing ? { id: existing.id } : {}),
        lat: String(titik.latitude),
        lng: String(titik.longitude),
        ...(hasil
          ? { jalan: hasil.jalan, wilayah: hasil.wilayah, kota: hasil.kota, kodePos: hasil.kodePos }
          : {}),
      },
    });
  };

  const teksLokasi = hasil?.teks
    ? hasil.teks
    : existing && samaTempat(titik, existing)
      ? `${existing.jalan}, ${existing.wilayah}`
      : "Geser peta untuk menentukan titik pengantaran";

  return (
    <View style={styles.screen}>
      <MapView
        ref={mapRef}
        style={StyleSheet.absoluteFill}
        initialRegion={wilayahAwal}
        onRegionChangeComplete={onRegionChangeComplete}
        showsUserLocation={adaIzin}
        showsMyLocationButton={false}
        toolbarEnabled={false}
      />

      {/* Pin tetap di tengah; user menggeser peta, bukan pin-nya */}
      <View pointerEvents="none" style={styles.pinWrap}>
        <Ionicons name="location" size={44} color={colors.primary} style={styles.pinIcon} />
      </View>

      <Pressable
        style={styles.lokasiSaya}
        onPress={onPressLokasiSaya}
        disabled={mencariGps}
        hitSlop={6}
      >
        {mencariGps ? (
          <ActivityIndicator size="small" color={colors.primary} />
        ) : (
          <Ionicons name="locate" size={22} color={colors.primary} />
        )}
      </Pressable>

      <View style={[styles.sheet, { paddingBottom: insets.bottom + 14 }]}>
        <View style={styles.sheetRow}>
          {mencari ? (
            <ActivityIndicator size="small" color={colors.primary} />
          ) : (
            <Ionicons name="navigate-outline" size={18} color={colors.primary} />
          )}
          <Text style={styles.sheetText} numberOfLines={3}>
            {teksLokasi}
          </Text>
        </View>

        <Pressable
          style={[styles.btn, mencari && styles.btnDisabled]}
          onPress={lanjut}
          disabled={mencari}
        >
          <Text style={styles.btnText}>Konfirmasi Lokasi</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.surface },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  muted: { color: colors.muted },
  pinWrap: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  // naikkan setengah tinggi total supaya ujung bawah pin tepat di titik tengah peta
  pinIcon: { marginBottom: 44 },
  lokasiSaya: {
    position: "absolute",
    right: 14,
    top: 14,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  sheet: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 16,
    paddingTop: 16,
    gap: 14,
    elevation: 8,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: -2 },
  },
  sheetRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  sheetText: { flex: 1, fontSize: 13, color: colors.text, lineHeight: 18 },
  btn: {
    height: 48,
    borderRadius: 12,
    backgroundColor: colors.dark,
    alignItems: "center",
    justifyContent: "center",
  },
  btnDisabled: { opacity: 0.6 },
  btnText: { color: "#fff", fontSize: 14, fontWeight: "700" },
});