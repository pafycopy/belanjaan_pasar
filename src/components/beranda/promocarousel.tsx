import { useState } from "react";
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
  style?: StyleProp<ViewStyle>;      // gaya pembungkus
  cardStyle?: StyleProp<ViewStyle>;  // gaya tiap kartu
};

export default function PromoCarousel({ promos, onPressPromo, style, cardStyle }: Props) {
  const [width, setWidth] = useState(0);
  const [index, setIndex] = useState(0);

  const onScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (width > 0) setIndex(Math.round(e.nativeEvent.contentOffset.x / width));
  };

  return (
    <View style={style} onLayout={(e) => setWidth(e.nativeEvent.layout.width)}>
      {width > 0 ? (
        <FlatList
          data={promos}
          keyExtractor={(p) => p.id}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={onScrollEnd}
          renderItem={({ item }) => (
            <View style={{ width, paddingHorizontal: 16 }}>
              <Pressable
                onPress={() => onPressPromo?.(item)}
                style={[styles.card, cardStyle]}
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
                      <Ionicons name="flame" size={12} color="#fff" />
                      <Text style={styles.tagText}>{item.tag}</Text>
                    </View>
                    {item.until ? (
                      <View style={styles.timer}>
                        <Ionicons name="time-outline" size={12} color="#fff" />
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

      {promos.length > 1 ? (
        <View style={styles.dots}>
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
    padding: 16,
    minHeight: 180,
    overflow: "hidden", // agar gambar ikut melengkung mengikuti borderRadius
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
    backgroundColor: "#ef6c00",
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  tagText: { color: "#fff", fontSize: 10, fontWeight: "700" },
  timer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.6)",
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  timerText: { color: "#fff", fontSize: 10, fontWeight: "600" },
  title: { color: "#fff", fontSize: 22, fontWeight: "800" },
  subtitle: { fontSize: 14, fontWeight: "600" },
  description: { color: "#e8f5e9", fontSize: 12, lineHeight: 17 },
  dots: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 5,
    marginTop: 8,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#bdbdbd",
  },
  dotActive: { width: 16, backgroundColor: "#2e7d32" },
});