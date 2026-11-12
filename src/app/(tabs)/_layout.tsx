
import { Tabs } from "expo-router";
import { Image } from "expo-image";
import { colors } from "@/theme";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.tabInactive,
        tabBarLabelStyle: {
          fontSize: 11,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Beranda",
          tabBarIcon: () => (
            <Image
              source={require("../../../assets/icon/home-nav.svg")}
              style={{ width: 21, height: 18 }}
              contentFit="contain"
            />
          ),
        }}
      />

      <Tabs.Screen
        name="produk"
        options={{
          title: "Produk",
          tabBarIcon: () => (
            <Image
              source={require("../../../assets/icon/produk-nav.svg")}
              style={{ width: 20, height: 20 }}
              contentFit="contain"
            />
          ),
        }}
      />

      <Tabs.Screen
        name="ngebelanjain"
        options={{
          title: "Ngebelanjain",
          tabBarIcon: () => (
            <Image
              source={require("../../../assets/icon/ngeblanjain-nav.svg")}
              style={{ width: 29, height: 21 }}
              contentFit="contain"
            />
          ),
        }}
      />

      {/* Favorit dibuka dari menu Beranda */}
      <Tabs.Screen
        name="favorit"
        options={{ href: null }}
      />

      <Tabs.Screen
        name="pesanan"
        options={{
          title: "Pesanan",
          tabBarIcon: () => (
            <Image
              source={require("../../../assets/icon/pesanan-nav.svg")}
              style={{ width: 20, height: 20 }}
              contentFit="contain"
            />
          ),
        }}
      />

      <Tabs.Screen
        name="akun"
        options={{
          title: "Akun",
          tabBarIcon: () => (
            <Image
              source={require("../../../assets/icon/akun-nav.svg")}
              style={{ width: 20, height: 20 }}
              contentFit="contain"
            />
          ),
        }}
      />
    </Tabs>
  );
}
