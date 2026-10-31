import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, radius, spacing } from "@/theme";
import {
  Notifikasi,
  NadaNotifikasi,
} from "@/types/notifikasi";
import { formatWaktuNotifikasi } from "@/utils/waktu";
import ProdukPreview from "@/components/notifikasi/produkpreview";

type Props = {
  item: Notifikasi;
  onPressProduk?: () => void;
  onPressAksi?: () => void;
};

const WARNA_NADA: Record<NadaNotifikasi, string> = {
  hijau: colors.dark,
  coklat: colors.brown,
};

function BadanTeks({
  isi,
  kode,
}: {
  isi: string;
  kode?: string;
}) {
  const bagian = kode ? isi.split(kode) : [isi];

  return (
    <Text style={styles.isi}>
      {bagian.map((b, i) => (
        <Text key={i}>
          {i > 0 ? (
            <Text style={styles.kode}>{` ${kode} `}</Text>
          ) : null}
          {b}
        </Text>
      ))}
    </Text>
  );
}

export default function NotifikasiCard({
  item,
  onPressProduk,
  onPressAksi,
}: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.meta} numberOfLines={1}>
        <Text
          style={[
            styles.label,
            { color: WARNA_NADA[item.nada] },
          ]}
        >
          {item.label}
        </Text>

        <Text style={styles.waktu}>
          {`  •  ${formatWaktuNotifikasi(item.waktu)}`}
        </Text>
      </Text>

      <Text style={styles.judul}>{item.judul}</Text>

      {item.produk ? (
        <ProdukPreview
          produk={item.produk}
          onPress={onPressProduk}
        />
      ) : (
        <BadanTeks
          isi={item.isi}
          kode={item.kode}
        />
      )}

      {item.aksi ? (
        <Pressable
          style={styles.aksi}
          onPress={onPressAksi}
        >
          <Ionicons
            name={item.aksi.icon}
            size={15}
            color={colors.white}
          />

          <Text style={styles.aksiTeks}>
            {item.aksi.label}
          </Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
    elevation: 1,
    shadowColor: colors.shadow,
    shadowOpacity: 0.06,
    shadowRadius: 4,
    shadowOffset: {
      width: 0,
      height: 1,
    },
  },

  meta: {
    fontSize: 10,
  },

  label: {
    fontWeight: "700",
  },

  waktu: {
    color: colors.muted,
    fontWeight: "600",
  },

  judul: {
    fontSize: 17,
    lineHeight: 23,
    fontWeight: "800",
    color: colors.text,
    marginTop: spacing.sm,
  },

  isi: {
    fontSize: 13,
    lineHeight: 19,
    color: colors.textSoft,
    marginTop: spacing.sm,
  },

  kode: {
    fontWeight: "700",
    color: colors.info,
    backgroundColor: colors.infoSoft,
  },

  aksi: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: 6,
    marginTop: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: 8,
    borderRadius: radius.xl,
    backgroundColor: colors.brown,
  },

  aksiTeks: {
    color: colors.white,
    fontSize: 12,
    fontWeight: "700",
  },
});