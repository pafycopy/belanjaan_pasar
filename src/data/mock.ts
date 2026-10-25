export type Product = {
  id: string;
  name: string;
  price: number;
  unit: string;
  shop: string;
};

export const categories = [
  { id: "sayur", name: "Sayur" },
  { id: "daging", name: "Daging" },
  { id: "ikan", name: "Ikan" },
  { id: "bumbu", name: "Bumbu" },
];

export const products: Product[] = [
  { id: "1", name: "Bayam", price: 5000, unit: "ikat", shop: "Bu Siti Sayur" },
  { id: "2", name: "Ayam Potong", price: 38000, unit: "kg", shop: "Pak Joko Daging" },
  { id: "3", name: "Ikan Lele", price: 28000, unit: "kg", shop: "Ikan Segar Mulya" },
  { id: "4", name: "Bawang Merah", price: 40000, unit: "kg", shop: "Bumbu Bu Rina" },
  { id: "5", name: "Beras 5 kg", price: 70000, unit: "karung", shop: "Toko Sembako Jaya" },
];