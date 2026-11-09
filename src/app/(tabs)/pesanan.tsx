import { useMemo, useState } from "react";
import { Alert, ScrollView, StyleSheet, View } from "react-native";
import { useRouter } from "expo-router";
import HeaderTab from "@/components/ui/headertab";
import SearchField from "@/components/ui/searchfield";
import ScreenState from "@/components/ui/screenstate";
import KartuPesanan from "@/components/pesanan/kartupesanan";
import SegmenStatus from "@/components/pesanan/segmenstatus";
import { useKeranjang } from "@/context/keranjang";
import { usePesanan } from "@/context/pesanan";
import { TAB_PESANAN } from "@/data/pesanan";
import { TEKS } from "@/data/teks";
import { usePesanUlang } from "@/hooks/usepesanulang";
import { colors, spacing } from "@/theme";
import { Pesanan, StatusPesanan } from "@/types/pesanan";
import { saringPesanan } from "@/utils/pesanan";

const T = TEKS.pesanan;

export default function PesananScreen() {
  const router = useRouter();
  const { jumlahBaris } = useKeranjang();
  const { pesanan, memuat, majukan } = usePesanan();
  const pesanUlang = usePesanUlang();

  const [tab, setTab] = useState<StatusPesanan>("disiapkan");
  const [cari, setCari] = useState("");

  // Kolom cari hanya ada di tab Selesai (riwayat); tab lain selalu menampilkan semuanya
  const bisaCari = tab === "selesai";
  const kata = bisaCari ? cari : "";

  const daftar = useMemo(() => saringPesanan(pesanan, tab, kata), [pesanan, tab, kata]);
  const sekarang = Date.now();

  const keDetail = (p: Pesanan) =>
    router.push({ pathname: "/pesanan/[invoice]", params: { invoice: p.invoice } });

  const segera = (pesan: string) => Alert.alert(T.segera.judul, pesan);

  return (
    <View style={styles.screen}>
      <HeaderTab
        judul={T.judul}
        ikonKanan="cart-outline"
        jumlahBadge={jumlahBaris}
        labelKanan={TEKS.katalog.keranjangAksesibilitas}
        onKembali={() => router.back()}
        onKanan={() => router.push("/keranjang")}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.content}
      >
        <View style={styles.atas}>
          {bisaCari ? (
            <SearchField
              value={cari}
              onChangeText={setCari}
              onSubmit={() => undefined}
              placeholder={T.cari}
              icon="search-outline"
            />
          ) : null}
          <SegmenStatus items={TAB_PESANAN} selectedId={tab} onSelect={setTab} />
        </View>

        {memuat ? (
          <ScreenState loading />
        ) : daftar.length > 0 ? (
          <View style={styles.daftar}>
            {daftar.map((p) => (
              <KartuPesanan
                key={p.invoice}
                pesanan={p}
                sekarang={sekarang}
                onDetail={() => keDetail(p)}
                onChat={() => segera(T.segera.chat)}
                onNilai={() => segera(T.segera.nilai)}
                onLihatFoto={() => segera(T.segera.foto)}
                onPesanUlang={() => void pesanUlang(p)}
                onMajukan={__DEV__ ? () => void majukan(p.invoice) : undefined}
              />
            ))}
          </View>
        ) : (
          <View style={styles.kosong}>
            <ScreenState message={kata.trim() ? T.kosong.cari : T.kosong[tab]} />
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.canvas },
  content: { paddingBottom: spacing.xl },
  atas: { paddingHorizontal: 14, paddingTop: spacing.md, gap: spacing.md },
  daftar: { paddingHorizontal: 14, paddingTop: spacing.md, gap: spacing.md },
  kosong: { minHeight: 240 },
});
