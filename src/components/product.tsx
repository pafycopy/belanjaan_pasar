import { View, Text, Pressable, StyleSheet } from "react-native";
import { Product } from "../data/mock";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Pressable style={styles.card}>
      <View style={styles.image} />
      <Text style={styles.name} numberOfLines={1}>{product.name}</Text>
      <Text style={styles.shop} numberOfLines={1}>{product.shop}</Text>
      <Text style={styles.price}>
        Rp {product.price.toLocaleString("id-ID")} / {product.unit}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "48%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 10,
    marginBottom: 12,
  },
  image: {
    aspectRatio: 1,
    backgroundColor: "#e0e0e0",
    borderRadius: 8,
    marginBottom: 8,
  },
  name: { fontSize: 15, fontWeight: "600" },
  shop: { color: "#666", fontSize: 12, marginTop: 2 },
  price: { marginTop: 6, fontWeight: "500", color: "#2e7d32", fontSize: 13 },
});