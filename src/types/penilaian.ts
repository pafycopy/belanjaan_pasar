export type PenilaianProduk = {
  id: string;
  pesananId: string;
  produkId: string;
  rating: number;
  ulasan: string;
  dibuatPada: string;
};

export type RingkasanPenilaian = {
  rating: number;
  jumlahUlasan: number;
};
