export const colors = {
  primary: "#2e9e44",
  dark: "#1b5e20",
  banner: "#a5d6a7",
  card: "#c8e6c9",
  surface: "#f2f3f5",
  white: "#fff",
  orange: "#ef6c00",
  text: "#1f2937",
  muted: "#6b7280",
  border: "#e5e7eb",
  borderStrong: "#d1d5db",
  darker: "#0f3d17", // hijau paling tua (tombol di atas bar hijau)

  textSoft: "#4b5563",
  placeholder: "#9e9e9e",
  danger: "#e53935",
  dangerSoft: "#fdecea",
  primarySoft: "#e8f5e9",
  tint: "#f7faf7",
  fieldBg: "#ebedf0",
  accentSoft: "#f3f4ff",
  accentSoftStrong: "#eceefb",
  brown: "#92400e",
  gold: "#f59a23",
  goldSoft: "#fdf1df",
  goldFade: "#fdf0e0",
  mintFade: "#d8f5dc",
  peachSoft: "#fde7d3",
  heroA: "#2b8a43",
  heroB: "#14672a",
  green: "#2f7d52",
  lockedBg: "#f7f8fe",
  lockedFg: "#a3a8bd",
  lockedCircle: "#e4e7f7",
  infoSoft: "#e0f2fe",
  info: "#0369a1",
  barBg: "#f9f8fe",                  // latar bar bawah (total + tombol)
  brandBca: "#0060af",               // teks logo BCA (sementara, sebelum file logo dipasang)
  canvas: "#e8e9eb",                 // latar halaman tab (Beranda, Favorit)
  glass: "rgba(255,255,255,0.22)",   // kapsul transparan di atas latar hijau
  shortcutOrange: "#ef7d00",         // ikon menu pintasan: Poin
  shortcutGreen: "#176b38",          // ikon menu pintasan lain
  tabInactive: "#888",
  overlay: "rgba(0,0,0,0.4)",
  shadow: "#000",

  // teks dan status
  textStrong: "#111827",       // teks paling gelap (hitungan mundur kios)
  dangerDark: "#c62828",       // ikon peringatan waktu (klaim harian)

  // promo
  promoTag: "#9c5a12",         // label "PROMO UTAMA HARI INI"
  promoSubtitle: "#ffe0b2",    // subjudul promo

  // poin dan voucher
  accentSoftDeep: "#e3e7fc",   // kotak hari klaim yang siap diambil
  primaryDeep: "#1e7a39",      // chip filter aktif
  couponMid: "#1f8038",        // tengah gradasi kupon aktif
  couponInactive: "#7d8a80",   // kupon terpakai/kedaluwarsa
  couponInactiveLight: "#98a49c",
  ticketLine: "#d5d8e2",       // garis sobekan tiket
};

export const radius = {
  sm: 8,
  md: 10,
  lg: 12,
  card: 14,   // kartu utama (promo, kios, dll.)
  xl: 20,
  pill: 999,  // bentuk kapsul
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
} as const;

export const fontSize = {
  xxs: 10,
  xs: 11,
  sm: 12,
  md: 13,
  lg: 14,
  xl: 16,
  display: 22,
} as const;

// Warna putih/hitam transparan (lapisan di atas gambar atau latar hijau)
export const alpha = {
  white05: "rgba(255,255,255,0.05)",
  white06: "rgba(255,255,255,0.06)",
  white08: "rgba(255,255,255,0.08)",
  white16: "rgba(255,255,255,0.16)",
  white35: "rgba(255,255,255,0.35)",
  white45: "rgba(255,255,255,0.45)",
  white85: "rgba(255,255,255,0.85)",
  black25: "rgba(0,0,0,0.25)",
  black30: "rgba(0,0,0,0.3)",
  black45: "rgba(0,0,0,0.45)",
} as const;

// Pasangan warna ikon per kategori alamat (bg = latar ikon, fg = warna ikon)
export const kategoriWarna = {
  rumah: { bg: colors.primarySoft, fg: "#2e7d32" },
  warung: { bg: "#ffe8d6", fg: "#c2570c" },
  katering: { bg: "#e3ecff", fg: "#3b5bdb" },
  kos: { bg: "#efe7ff", fg: "#6741d9" },
  netral: { bg: "#eeeeee", fg: "#555555" },
} as const;