import { useRef } from "react";
import { StyleSheet, View } from "react-native";
import MapView from "react-native-maps";
import { useLocalSearchParams, useRouter } from "expo-router";
import { colors } from "@/theme";
import { Alamat, useAlamat } from "@/context/alamat";
import { usePinpoint } from "@/hooks/usepinpoint";
import { parseKoordinat } from "@/services/lokasi";
import { TEKS } from "@/data/teks";
import ScreenState from "@/components/ui/screenstate";
import RoundIconButton from "@/components/ui/roundiconbutton";
import PinMarker from "@/components/alamat/pinmarker";
import PinCard from "@/components/alamat/pincard";

type Params = { id?: string; gps?: string; lat?: string; lng?: string };

/* ---------- pembungkus: tunggu data siap ---------- */

export default function Pinpoint() {
  const { id } = useLocalSearchParams<Params>();
  const { daftar, memuat } = useAlamat();

  if (memuat) return <ScreenState loading />;

  const existing = id ? daftar.find((a) => a.id === id) : undefined;
  if (id && !existing) return <ScreenState message={TEKS.alamatTidakDitemukan} />;

  return <Peta existing={existing} />;
}

/* ---------- peta dengan pin di tengah ---------- */

function Peta({ existing }: { existing?: Alamat }) {
  const router = useRouter();
  const { gps, lat, lng } = useLocalSearchParams<Params>();

  const mapRef = useRef<MapView>(null);
  const peta = usePinpoint({
    mapRef,
    existing,
    titikPencarian: parseKoordinat(lat, lng),
    bukaDiGps: gps === "1",
  });

  return (
    <View style={styles.screen}>
      <MapView
        ref={mapRef}
        style={StyleSheet.absoluteFill}
        initialRegion={peta.wilayahAwal}
        onRegionChangeComplete={peta.onRegionChangeComplete}
        showsUserLocation={peta.adaIzin}
        showsMyLocationButton={false}
        toolbarEnabled={false}
      />

      <PinMarker />

      <RoundIconButton
        icon="locate"
        loading={peta.mencariGps}
        onPress={peta.pakaiLokasiSaya}
        style={styles.lokasiSaya}
      />

      <PinCard
        teks={peta.teksLokasi}
        mencari={peta.mencari}
        onKonfirmasi={() => router.push({ pathname: "/alamat/detail", params: peta.paramsLanjut() })}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.surface },
  lokasiSaya: { position: "absolute", right: 14, top: 14 },
});
