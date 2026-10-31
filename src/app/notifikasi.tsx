import { useMemo, useState } from "react";
import { Alert, FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { Stack, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing } from "@/theme";
import { TEKS } from "@/data/teks";
import { FILTER_NOTIFIKASI, FILTER_SEMUA, notifikasiContoh } from "@/data/notifikasi";
import { Notifikasi } from "@/types/notifikasi";
import ChipGroup from "@/components/ui/chipgroup";
import ScreenState from "@/components/ui/screenstate";
import NotifikasiCard from "@/components/notifikasi/notifikasicard";

export default function NotifikasiScreen() {
  const router = useRouter();
  const [filter, setFilter] = useState<string>(FILTER_SEMUA);

  const data = useMemo(
    () =>
      filter === FILTER_SEMUA
        ? notifikasiContoh
        : notifikasiContoh.filter((n) => n.kategori === filter),
    [filter]
  );

  // TODO: klaim voucher sungguhan setelah backend voucher siap
  const klaim = (n: Notifikasi) => {
    if (n.kode) {
      Alert.alert(
        TEKS.notifikasi.judulVoucher,
        TEKS.notifikasi.voucherDiklaim(n.kode)
      );
    }
  };

  return (
    <View style={styles.screen}>
      <Stack.Screen
        options={{
          headerShown: true,
          title: TEKS.notifikasi.judul,
          headerStyle: { backgroundColor: colors.primary },
          headerTintColor: colors.white,
          headerTitleAlign: "center",
          headerTitleStyle: { fontSize: 14, fontWeight: "700" },
          headerShadowVisible: false,
          headerLeft: () => (
            <Pressable onPress={() => router.back()} hitSlop={12}>
              <Ionicons
                name="chevron-back"
                size={24}
                color={colors.white}
              />
            </Pressable>
          ),
        }}
      />

      <View style={styles.filter}>
        <ChipGroup
          items={FILTER_NOTIFIKASI}
          selectedId={filter}
          onSelect={setFilter}
          scroll
          inactiveBg={colors.accentSoft}
        />
      </View>

      <FlatList
        data={data}
        keyExtractor={(n) => n.id}
        renderItem={({ item }) => (
          <NotifikasiCard
            item={item}
            onPressProduk={
              item.produk ? () => router.push("/pesanan") : undefined
            }
            onPressAksi={() => klaim(item)}
          />
        )}
        ListHeaderComponent={
          <Text style={styles.judulDaftar}>
            {TEKS.notifikasi.terbaru}
          </Text>
        }
        ListEmptyComponent={
          <ScreenState message={TEKS.notifikasi.kosong} />
        }
        contentContainerStyle={styles.daftar}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.surface,
  },

  filter: {
    backgroundColor: colors.white,
    paddingVertical: spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },

  daftar: {
    paddingBottom: spacing.xl,
  },

  judulDaftar: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.textSoft,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
});