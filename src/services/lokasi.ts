import * as Location from "expo-location";

export type Koordinat = { latitude: number; longitude: number };

export type HasilGeocode = {
  jalan: string;
  wilayah: string;
  kota: string;
  kodePos: string;
  teks: string; // satu baris ringkas untuk ditampilkan di peta
};

export const KOORDINAT_DEFAULT: Koordinat = { latitude: -6.2088, longitude: 106.8456 }; // Jakarta
export const ZOOM_DELTA = 0.005;

export async function pastikanIzinLokasi(): Promise<boolean> {
  const sekarang = await Location.getForegroundPermissionsAsync();
  if (sekarang.granted) return true;
  if (!sekarang.canAskAgain) return false;
  const minta = await Location.requestForegroundPermissionsAsync();
  return minta.granted;
}

export async function ambilPosisiSaya(): Promise<Koordinat | null> {
  try {
    if (!(await pastikanIzinLokasi())) return null;
    const pos = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
    return { latitude: pos.coords.latitude, longitude: pos.coords.longitude };
  } catch {
    return null;
  }
}

function unik(bagian: (string | null | undefined)[]): string[] {
  const hasil: string[] = [];
  for (const b of bagian) {
    const t = b?.trim();
    if (t && !hasil.some((h) => h.toLowerCase() === t.toLowerCase())) hasil.push(t);
  }
  return hasil;
}

function susunAlamat(a: Location.LocationGeocodedAddress): HasilGeocode {
  const bagianJalan = [a.street, a.streetNumber].filter(Boolean).join(" ").trim();
  const jalan = bagianJalan || a.name || "";
  // Di expo-location: city = locality (umumnya kecamatan), district = sub-locality (umumnya kelurahan),
  // subregion = kota/kabupaten. Hasil geocoder di Indonesia tidak selalu rapi, jadi isinya bisa diedit user.
  const wilayah = unik([a.city, a.district]).join(", ");
  const kota = (a.subregion ?? "").replace(/^Kota\s+/i, "").trim();
  const kodePos = a.postalCode ?? "";
  const teks = a.formattedAddress || unik([jalan, wilayah, kota, a.region, kodePos]).join(", ");
  return { jalan, wilayah, kota, kodePos, teks };
}

// Di Android, geocoding butuh izin lokasi sudah diberikan. Di sini tidak minta izin (tidak mengganggu).
export async function alamatDariKoordinat(c: Koordinat): Promise<HasilGeocode | null> {
  try {
    const izin = await Location.getForegroundPermissionsAsync();
    if (!izin.granted) return null;
    const hasil = await Location.reverseGeocodeAsync(c);
    return hasil[0] ? susunAlamat(hasil[0]) : null;
  } catch {
    return null;
  }
}

// Cari koordinat dari teks (kotak "Cari lokasi"). Aksi eksplisit user, jadi boleh minta izin.
export async function koordinatDariTeks(teks: string): Promise<Koordinat | null> {
  try {
    if (!(await pastikanIzinLokasi())) return null;
    const hasil = await Location.geocodeAsync(teks);
    return hasil[0] ? { latitude: hasil[0].latitude, longitude: hasil[0].longitude } : null;
  } catch {
    return null;
  }
}

// Params route selalu string: ubah ke koordinat, atau null bila tidak valid
export function parseKoordinat(lat?: string, lng?: string): Koordinat | null {
  if (!lat || !lng) return null;
  const latitude = Number(lat);
  const longitude = Number(lng);
  if (Number.isNaN(latitude) || Number.isNaN(longitude)) return null;
  return { latitude, longitude };
}

export function samaTempat(a: Koordinat, b: Koordinat): boolean {
  return Math.abs(a.latitude - b.latitude) < 0.00005 && Math.abs(a.longitude - b.longitude) < 0.00005;
}
