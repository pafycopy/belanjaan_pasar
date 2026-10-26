import { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  Pressable,
  StyleSheet,
  StyleProp,
  ViewStyle,
  ImageSourcePropType,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export type Promo = {
  id: string;
  tag: string;          // contoh: "PROMO UTAMA HARI INI"
  until?: string;       // contoh: "s/d 10.00 WIB"
  title: string;        // contoh: "BOCIN"
  subtitle?: string;    // contoh: "(Beli Obral Cuan!)"
  description: string;
  image?: ImageSourcePropType; // gambar latar (opsional)
};

type Props = {
  promos: Promo[];
  onPressPromo?: (promo: Promo) => void;
  autoPlay?: boolean;                // bergeser otomatis (bawaan: aktif)
  cardHeight?: number;                // ← baru: tinggi semua kartu
  interval?: number;                 // jeda antar geseran, milidetik
  style?: StyleProp<ViewStyle>;      // gaya pembungkus
  cardStyle?: StyleProp<ViewStyle>;  // gaya tiap kartu
};

export default function PromoCarousel({
  promos,
  onPressPromo,
  autoPlay = true,
  interval = 4000,
  cardHeight = 170, 
  style,
  cardStyle,
}: Props) {
  const [width, setWidth] = useState(0);
  const [index, setIndex] = useState(0);
  const listRef = useRef<FlatList<Promo>>(null);
  const touching = useRef(false);

  const onScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (width > 0) setIndex(Math.round(e.nativeEvent.contentOffset.x / width));
  };

  // Geser otomatis. Timer dimulai ulang setiap kali index berubah,
  // jadi setelah pengguna menggeser sendiri, hitungan 4 detik mulai dari awal.
  useEffect(() => {
    if (!autoPlay || promos.length < 2 || width === 0) return;
    const timer = setTimeout(() => {
      if (touching.current) {
        setIndex((i) => i); // sedang disentuh: lewati, jadwalkan lagi
        return;
      }
      const next = (index + 1) % promos.length;
      listRef.current?.scrollToOffset({ offset: next * width, animated: true });
      setIndex(next);
    }, interval);
    return () => clearTimeout(timer);
  }, [index, autoPlay, interval, promos.length, width]);

  return (
    <View style={style} onLayout={(e) => setWidth(e.nativeEvent.layout.width)}>
      {width > 0 ? (
        <FlatList
          ref={listRef}
          data={promos}
          keyExtractor={(p) => p.id}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScrollBeginDrag={() => (touching.current = true)}
          onScrollEndDrag={() => (touching.current = false)}
          onMomentumScrollEnd={onScrollEnd}
          renderItem={({ item }) => (
            <View style={{ width, paddingHorizontal: 16 }}>
              <Pressable
                onPress={() => onPressPromo?.(item)}
                style={[styles.card, { height: cardHeight }, cardStyle]}
              >
                {item.image ? (
                  <>
                    <Image
                      source={item.image}
                      resizeMode="cover"
                      style={StyleSheet.absoluteFill}
                    />
                    <View style={[StyleSheet.absoluteFill, styles.overlay]} />
                  </>
                ) : null}

                <View style={styles.content}>
                  <View style={styles.topRow}>
                    <View style={styles.tag}>
                      <Ionicons name="flash" size={12} color="#fff" />
                      <Text style={styles.tagText}>{item.tag}</Text>
                    </View>
                    {item.until ? (
                      <View style={styles.timer}>
                        <Ionicons name="alarm-outline" size={13} color="#fff" />
                        <Text style={styles.timerText}>{item.until}</Text>
                      </View>
                    ) : null}
                  </View>

                  <Text style={styles.title}>
                    {item.title}
                    {item.subtitle ? (
                      <Text style={styles.subtitle}>  {item.subtitle}</Text>
                    ) : null}
                  </Text>
                  <Text style={styles.description}>{item.description}</Text>
                </View>
              </Pressable>
            </View>
          )}
        />
      ) : null}

      {/* Titik penanda: melayang di atas bagian bawah kartu */}
      {promos.length > 1 ? (
        <View pointerEvents="none" style={styles.dots}>
          {promos.map((p, i) => (
            <View key={p.id} style={[styles.dot, i === index && styles.dotActive]} />
          ))}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#1b5e20",
    borderRadius: 14,
    padding: 14,
    paddingBottom: 30, // ruang untuk titik penanda di dalam kartu
    overflow: "hidden",
  },
  overlay: { backgroundColor: "rgba(0,0,0,0.45)" },
  content: { gap: 8 },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  tag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#9c5a12",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  tagText: { color: "#fff", fontSize: 10, fontWeight: "700" },
  timer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(0,0,0,0.3)",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  timerText: { color: "#fff", fontSize: 10, fontWeight: "600" },
  title: { color: "#fff", fontSize: 22, fontWeight: "800" },
  subtitle: { fontSize: 14, fontWeight: "600", color: "#ffe0b2" },
  description: { color: "#e8f5e9", fontSize: 12, lineHeight: 17 },
  dots: {
    position: "absolute",
    bottom: 10,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    gap: 5,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "rgba(255,255,255,0.45)",
  },
  dotActive: { width: 16, backgroundColor: "#fff" },
});