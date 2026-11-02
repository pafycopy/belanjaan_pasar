// 2450 -> "2.450" (tidak memakai Intl supaya hasilnya sama di semua HP)
export function formatRibuan(n: number): string {
  return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}
