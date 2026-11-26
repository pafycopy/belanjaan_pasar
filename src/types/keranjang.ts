export type ItemKeranjang = {
  uid: string;
  produkId: string;
  jumlah: number;
  hargaSatuan: number;   // harga saat ditambahkan
  catatan?: string;      // catatan khusus pelanggan untuk produk
};

// Data yang dikirim dari layar produk. uid dibuat oleh repository (nanti: oleh server).
export type ItemKeranjangInput = Omit<ItemKeranjang, "uid">;
