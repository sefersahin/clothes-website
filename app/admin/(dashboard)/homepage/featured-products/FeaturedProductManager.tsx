"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type FeaturedItem = {
  id: string;
  sortOrder: number;
  product: { id: string; name: string; basePrice: string };
};

type Product = { id: string; name: string };

export default function FeaturedProductManager({
  featured,
  availableProducts,
}: {
  featured: FeaturedItem[];
  availableProducts: Product[];
}) {
  const router = useRouter();
  const [productId, setProductId] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function addFeatured(e: React.FormEvent) {
    e.preventDefault();
    if (!productId) return;
    setError(null);
    setBusy(true);

    const res = await fetch("/api/admin/featured-products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId }),
    });

    setBusy(false);
    if (!res.ok) {
      setError("Ürün eklenemedi (zaten öne çıkarılmış olabilir).");
      return;
    }
    setProductId("");
    router.refresh();
  }

  async function removeFeatured(id: string) {
    setBusy(true);
    await fetch(`/api/admin/featured-products/${id}`, { method: "DELETE" });
    setBusy(false);
    router.refresh();
  }

  async function move(index: number, direction: -1 | 1) {
    const target = featured[index + direction];
    const current = featured[index];
    if (!target) return;

    setBusy(true);
    await Promise.all([
      fetch(`/api/admin/featured-products/${current.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sortOrder: target.sortOrder }),
      }),
      fetch(`/api/admin/featured-products/${target.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sortOrder: current.sortOrder }),
      }),
    ]);
    setBusy(false);
    router.refresh();
  }

  return (
    <div>
      <table className="mb-6 w-full max-w-xl text-left text-sm">
        <thead>
          <tr className="border-b border-gray-200 text-gray-500">
            <th className="py-2 pr-4">Ürün</th>
            <th className="py-2 pr-4">Fiyat</th>
            <th className="py-2 pr-4" />
          </tr>
        </thead>
        <tbody>
          {featured.map((item, index) => (
            <tr key={item.id} className="border-b border-gray-100">
              <td className="py-2 pr-4">{item.product.name}</td>
              <td className="py-2 pr-4">{item.product.basePrice}₺</td>
              <td className="py-2 pr-4 space-x-2">
                <button
                  type="button"
                  disabled={busy || index === 0}
                  onClick={() => move(index, -1)}
                  className="disabled:opacity-30"
                >
                  ↑
                </button>
                <button
                  type="button"
                  disabled={busy || index === featured.length - 1}
                  onClick={() => move(index, 1)}
                  className="disabled:opacity-30"
                >
                  ↓
                </button>
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => removeFeatured(item.id)}
                  className="text-rose-600 hover:underline disabled:opacity-50"
                >
                  Kaldır
                </button>
              </td>
            </tr>
          ))}
          {featured.length === 0 && (
            <tr>
              <td colSpan={3} className="py-4 text-gray-500">
                Henüz öne çıkan ürün yok.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <form onSubmit={addFeatured} className="flex items-end gap-3">
        <div>
          <label className="mb-1 block text-sm text-gray-700">Ürün Ekle</label>
          <select
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
            className="w-64 rounded border border-gray-300 px-3 py-2 text-sm"
          >
            <option value="">Ürün seçin</option>
            {availableProducts.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          disabled={busy || !productId}
          className="rounded bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50"
        >
          Ekle
        </button>
      </form>

      {error && <p className="mt-2 text-sm text-rose-600">{error}</p>}
    </div>
  );
}
