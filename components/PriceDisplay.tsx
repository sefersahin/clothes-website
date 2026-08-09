function formatTL(amount: number): string {
  return new Intl.NumberFormat("tr-TR", { maximumFractionDigits: 0 }).format(amount) + "₺";
}

export default function PriceDisplay({
  basePrice,
  salePrice,
}: {
  basePrice: number | string;
  salePrice: number | string | null;
}) {
  const base = Number(basePrice);
  const sale = salePrice === null ? null : Number(salePrice);

  if (sale === null) {
    return <span className="text-lg font-semibold">{formatTL(base)}</span>;
  }

  const amountOff = base - sale;
  const percentOff = Math.round((amountOff / base) * 100);

  return (
    <div className="flex flex-wrap items-baseline gap-2">
      <span className="text-sm text-gray-400 line-through">{formatTL(base)}</span>
      <span className="text-lg font-semibold text-rose-600">{formatTL(sale)}</span>
      <span className="rounded bg-rose-50 px-1.5 py-0.5 text-xs font-medium text-rose-600">
        -{formatTL(amountOff)} · %{percentOff} avantaj
      </span>
    </div>
  );
}
