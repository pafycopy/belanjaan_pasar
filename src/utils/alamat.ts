import { Alamat, AlamatInput } from "@/types/alamat";
import { KATEGORI_ALAMAT, KATEGORI_LAINNYA, cariKategori } from "@/data/kategorialamat";
import { KunciForm } from "@/data/formalamat";

export type NilaiForm = Record<KunciForm, string>;

// Isian yang datang dari layar peta (hasil geocode); menang atas data alamat lama
export type IsianDariPeta = { jalan?: string; wilayah?: string; kota?: string; kodePos?: string };

export function kategoriIdAwal(existing?: Alamat): string {
  if (!existing) return KATEGORI_ALAMAT[0].id;
  return cariKategori(existing.kategori)?.id ?? KATEGORI_LAINNYA.id;
}

export function nilaiAwalForm(existing: Alamat | undefined, dariPeta: IsianDariPeta): NilaiForm {
  const kustom = existing && !cariKategori(existing.kategori) ? existing.kategori : "";
  return {
    namaPenerima: existing?.namaPenerima ?? "",
    jalan: dariPeta.jalan ?? existing?.jalan ?? "",
    patokan: existing?.patokan ?? "",
    kategoriKustom: kustom,
    wilayah: dariPeta.wilayah ?? existing?.wilayah ?? "",
    kota: dariPeta.kota ?? existing?.kota ?? "",
    rt: existing?.rt ?? "",
    rw: existing?.rw ?? "",
    kodePos: dariPeta.kodePos ?? existing?.kodePos ?? "",
  };
}

export function labelKategori(kategoriId: string, kustom: string): string {
  if (kategoriId === KATEGORI_LAINNYA.id) return kustom.trim();
  return KATEGORI_ALAMAT.find((k) => k.id === kategoriId)?.label ?? KATEGORI_ALAMAT[0].label;
}

export function keAlamatInput(p: {
  nilai: NilaiForm;
  kategoriId: string;
  latitude: number;
  longitude: number;
  noHp?: string;
}): AlamatInput {
  const n = p.nilai;
  return {
    kategori: labelKategori(p.kategoriId, n.kategoriKustom),
    namaPenerima: n.namaPenerima.trim(),
    noHp: p.noHp,
    jalan: n.jalan.trim(),
    wilayah: n.wilayah.trim(),
    kota: n.kota.trim() || undefined,
    rt: n.rt.trim() || undefined,
    rw: n.rw.trim() || undefined,
    kodePos: n.kodePos.trim() || undefined,
    patokan: n.patokan.trim() || undefined,
    latitude: p.latitude,
    longitude: p.longitude,
  };
}

// "4" -> "04"
export function padRtRw(v: string): string {
  const t = v.trim();
  return t ? t.padStart(2, "0") : "";
}

// "RT 04 / RW 02 (Kode Pos 11640)"
export function ringkasanWilayah(rt: string, rw: string, kodePos: string): string {
  const rtRw = rt || rw ? `RT ${rt || "-"} / RW ${rw || "-"}` : "";
  const kp = kodePos ? `(Kode Pos ${kodePos})` : "";
  return [rtRw, kp].filter(Boolean).join(" ");
}

// "Kecamatan & Kelurahan (Jakarta Barat)"
export function labelDenganKota(dasar: string, kota: string): string {
  return kota ? `${dasar} (${kota})` : dasar;
}
