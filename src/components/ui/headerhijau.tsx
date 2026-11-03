import { ReactNode } from "react";
import { Pressable } from "react-native";
import { Stack, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/theme";

type Props = {
  judul?: string;   // kosong -> header tanpa judul (mis. detail produk)
  kanan?: ReactNode; // aksi di kanan header (mis. tombol bagikan)
};

// Header hijau dengan judul di tengah dan tombol kembali (dipakai Notifikasi, Poin, Voucher, Produk, dst.)
export default function HeaderHijau({ judul, kanan }: Props) {
  const router = useRouter();
  return (
    <Stack.Screen
      options={{
        headerShown: true,
        title: judul ?? "",
        headerStyle: { backgroundColor: colors.primary },
        headerTintColor: colors.white,
        headerTitleAlign: "center",
        headerTitleStyle: { fontSize: 14, fontWeight: "700" },
        headerShadowVisible: false,
        headerLeft: () => (
          <Pressable onPress={() => router.back()} hitSlop={12}>
            <Ionicons name="chevron-back" size={24} color={colors.white} />
          </Pressable>
        ),
        headerRight: kanan ? () => kanan : undefined,
      }}
    />
  );
}
