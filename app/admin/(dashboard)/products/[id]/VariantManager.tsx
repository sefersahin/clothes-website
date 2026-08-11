"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Variant = {
  id: string;
  size: string;
  stockQuantity: number;
  sku: string | null;
};

export default function VariantManager({
  productId,
  variants,
}: {
  productId: string;
  variants: Variant[];
}) {
  const router = useRouter();
  const [size, setSize] = useState("");
  const [stockQuantity, setStockQuantity] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [stockEdits, setStockEdits] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);

  async function addVariant(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);

    const res = await fetch(`/api/admin/products/${productId}/variants`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ size, stockQuantity: Number(stockQuantity) }),
    });

    setBusy(false);
    if (!res.ok) {
      setError("Beden eklenemedi (bu beden zaten var olabilir).");
      return;
    }
    setSize("");
    setStockQuantity("");
    router.refresh();
  }

  async function saveStock(variantId: string) {
    const value = stockEdits[variantId];
    if (value === undefined) return;
    setBusy(true);
    await fetch(`/api/admin/variants/${variantId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stockQuantity: Number(value) }),
    });
    setBusy(false);
    router.refresh();
  }

  async function deleteVariant(variantId: string) {
    setBusy(true);
    await fetch(`/api/admin/variants/${variantId}`, { method: "DELETE" });
    setBusy(false);
    router.refresh();
  }

  return (
    <div>
      <h2 className="mb-3 text-sm font-medium text-gray-500">Beden / Stok</h2>

      <table className="mb-4 w-full text-left text-sm">
        <thead>
          <tr className="border-b border-gray-200 text-gray-500">
            <th className="py-2 pr-4">Beden</th>
            <th className="py-2 pr-4">Stok</th>
            <th className="py-2 pr-4" />
          </tr>
        </thead>
        <tbody>
          {variants.map((variant) => (
            <tr key={variant.id} className="border-b border-gray-100">
              <td className="py-2 pr-4">{variant.size}</td>
              <td className="py-2 pr-4">
                <input
                  type="number"
                  min="0"
                  defaultValue={variant.stockQuantity}
                  onChange={(e) =>
                    setStockEdits((prev) => ({ ...prev, [variant.id]: e.target.value }))
                  }
                  className="w-20 rounded border border-gray-300 px-2 py-1"
                />
              </td>
              <td className="py-2 pr-4 space-x-3">
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => saveStock(variant.id)}
                  className="text-gray-700 hover:underline disabled:opacity-50"
                >
                  Kaydet
                </button>
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => deleteVariant(variant.id)}
                  className="text-rose-600 hover:underline disabled:opacity-50"
                >
                  Sil
                </button>
              </td>
            </tr>
          ))}
          {variants.length === 0 && (
            <tr>
              <td colSpan={3} className="py-4 text-gray-500">
                Henüz beden eklenmedi.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <form onSubmit={addVariant} className="flex flex-wrap items-end gap-3">
        <div>
          <label className="mb-1 block text-sm text-gray-700">Beden</label>
          <input
            type="text"
            value={size}
            onChange={(e) => setSize(e.target.value)}
            required
            className="w-24 rounded border border-gray-300 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm text-gray-700">Stok</label>
          <input
            type="number"
            min="0"
            value={stockQuantity}
            onChange={(e) => setStockQuantity(e.target.value)}
            required
            className="w-20 rounded border border-gray-300 px-3 py-2 text-sm"
          />
        </div>
        <button
          type="submit"
          disabled={busy}
          className="rounded border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-50 disabled:opacity-50"
        >
          Ekle
        </button>
      </form>

      {error && <p className="mt-2 text-sm text-rose-600">{error}</p>}
    </div>
  );
}
