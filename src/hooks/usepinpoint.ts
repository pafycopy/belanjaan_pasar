import { RefObject, useEffect, useRef, useState } from "react";
import { Alert } from "react-native";
import MapView, { Region } from "react-native-maps";
import { Alamat } from "@/types/alamat";
import { TEKS } from "@/data/teks";
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

type Opsi = {
  mapRef: RefObject<MapView | null>; // ref peta dimiliki layar, hook hanya menggerakkannya
  existing?: Alamat;               // mode ubah
  titikPencarian: Koordinat | null; // titik dari kotak cari (jika ada)
  bukaDiGps: boolean;              // dibuka lewat tombol "Lokasi Saya"
};

/**
 * Seluruh logika layar peta (izin, GPS, geocode, titik pin) dipisah dari tampilan.
 * Layar cukup merender nilai yang dikembalikan hook ini.
 */
export function usePinpoint({ mapRef, existing, titikPencarian, bukaDiGps }: Opsi) {
  const urutanGeocode = useRef(0);

  // Titik awal: alamat yang diubah > hasil pencarian > default (lalu digeser ke posisi user bila izin ada)
  const [wilayahAwal] = useState<Region>(() => {
    const titik = existing
      ? { latitude: existing.latitude, longitude: existing.longitude }
      : (titikPencarian ?? KOORDINAT_DEFAULT);
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

  const peringatanLokasi = () =>
    Alert.alert(TEKS.peringatan.lokasiTidakTersedia.judul, TEKS.peringatan.lokasiTidakTersedia.pesan);

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
      if (!existing && !titikPencarian) {
        const pos = await ambilPosisiSaya();
        if (!aktif) return;
        if (pos) geserKe(pos);
        else if (bukaDiGps) peringatanLokasi();
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

  const pakaiLokasiSaya = async () => {
    setMencariGps(true);
    const pos = await ambilPosisiSaya();
    setMencariGps(false);
    if (!pos) {
      peringatanLokasi();
      return;
    }
    setAdaIzin(true);
    geserKe(pos);
  };

  const teksLokasi = hasil?.teks
    ? hasil.teks
    : existing && samaTempat(titik, existing)
      ? `${existing.jalan}, ${existing.wilayah}`
      : TEKS.pinpoint.petunjuk;

  // Params untuk layar detail (semua string, sesuai aturan route)
  const paramsLanjut = () => ({
    ...(existing ? { id: existing.id } : {}),
    lat: String(titik.latitude),
    lng: String(titik.longitude),
    ...(hasil
      ? { jalan: hasil.jalan, wilayah: hasil.wilayah, kota: hasil.kota, kodePos: hasil.kodePos }
      : {}),
  });

  return {
    wilayahAwal,
    adaIzin,
    mencari,
    mencariGps,
    teksLokasi,
    onRegionChangeComplete,
    pakaiLokasiSaya,
    paramsLanjut,
  };
}
