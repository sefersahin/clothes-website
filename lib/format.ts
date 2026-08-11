export function formatTL(amount: number): string {
  return new Intl.NumberFormat("tr-TR", { maximumFractionDigits: 0 }).format(amount) + "₺";
}
