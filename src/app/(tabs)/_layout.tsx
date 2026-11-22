
import { Pressable } from "react-native";
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
        // Hilangkan efek ripple (bulatan besar) bawaan Android saat tab ditekan
        tabBarButton: (props) => <Pressable {...props} android_ripple={null} />,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Beranda",
          tabBarIcon: ({ color }) => (
            <Image
              source={require("../../../assets/icon/home-nav.svg")}
              tintColor={color}
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
          tabBarIcon: ({ color }) => (
            <Image
              source={require("../../../assets/icon/produk-nav.svg")}
              tintColor={color}
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
          tabBarIcon: ({ color }) => (
            <Image
              source={require("../../../assets/icon/ngeblanjain-nav.svg")}
              tintColor={color}
              style={{ width: 29, height: 21 }}
              contentFit="contain"
            />
          ),
        }}
      />

      <Tabs.Screen
        name="pesanan"
        options={{
          title: "Pesanan",
          tabBarIcon: ({ color }) => (
            <Image
              source={require("../../../assets/icon/pesanan-nav.svg")}
              tintColor={color}
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
          tabBarIcon: ({ color }) => (
            <Image
              source={require("../../../assets/icon/akun-nav.svg")}
              tintColor={color}
              style={{ width: 20, height: 20 }}
              contentFit="contain"
            />
          ),
        }}
      />
    </Tabs>
  );
}
