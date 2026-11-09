import { Tabs } from "expo-router";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { colors } from "@/theme";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.tabInactive,
        tabBarLabelStyle: { fontSize: 11 },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Beranda",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color as string} />
          ),
        }}
      />
      <Tabs.Screen
        name="produk"
        options={{
          title: "Produk",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="cube-outline" size={size} color={color as string} />
          ),
        }}
      />
      <Tabs.Screen
        name="ngebelanjain"
        options={{
          title: "Ngebelanjain",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="moped" size={size} color={color as string} />
          ),
        }}
      />
      {/* Favorit dibuka dari menu di Beranda, jadi tidak muncul di bar bawah */}
      <Tabs.Screen name="favorit" options={{ href: null }} />
      <Tabs.Screen
        name="pesanan"
        options={{
          title: "Pesanan",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="pricetag-outline" size={size} color={color as string} />
          ),
        }}
      />
      <Tabs.Screen
        name="akun"
        options={{
          title: "Akun",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-circle-outline" size={size} color={color as string} />
          ),
        }}
      />
    </Tabs>
  );
}