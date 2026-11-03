export type ItemKeranjang = {
  uid: string;
  produkId: string;
  jumlah: number;
  hargaSatuan: number;   // harga saat ditambahkan
  potonganId?: string;   // pilihan potongan (bila produk bisa dipotong)
  catatan?: string;      // catatan untuk pemotong
};

// Data yang dikirim dari layar produk. uid dibuat oleh repository (nanti: oleh server).
export type ItemKeranjangInput = Omit<ItemKeranjang, "uid">;
