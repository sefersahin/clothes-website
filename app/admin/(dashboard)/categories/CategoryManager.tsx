"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { SIZE_CHART_TYPES, DEFAULT_SIZE_CHART_TYPE, type SizeChartType } from "@/lib/sizeChart";

type Category = {
  id: string;
  name: string;
  slug: string;
  sizeChartType: SizeChartType;
  isAllProducts: boolean;
};

export default function CategoryManager({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [sizeChartType, setSizeChartType] = useState<SizeChartType>(DEFAULT_SIZE_CHART_TYPE);
  const [isAllProducts, setIsAllProducts] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function addCategory(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);

    const res = await fetch("/api/admin/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, sizeChartType, isAllProducts }),
    });

    setBusy(false);
    if (!res.ok) {
      setError("Kategori eklenemedi.");
      return;
    }
    setName("");
    setSizeChartType(DEFAULT_SIZE_CHART_TYPE);
    setIsAllProducts(false);
    router.refresh();
  }

  async function updateSizeChartType(id: string, value: SizeChartType) {
    setBusy(true);
    await fetch(`/api/admin/categories/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sizeChartType: value }),
    });
    setBusy(false);
    router.refresh();
  }

  async function updateIsAllProducts(id: string, value: boolean) {
    setBusy(true);
    await fetch(`/api/admin/categories/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isAllProducts: value }),
    });
    setBusy(false);
    router.refresh();
  }

  async function deleteCategory(id: string) {
    setBusy(true);
    await fetch(`/api/admin/categories/${id}`, { method: "DELETE" });
    setBusy(false);
    router.refresh();
  }

  return (
    <div>
      <table className="mb-6 w-full max-w-3xl text-left text-sm">
        <thead>
          <tr className="border-b border-gray-200 text-gray-500">
            <th className="py-2 pr-4">Kategori</th>
            <th className="py-2 pr-4">Beden Tablosu Tipi</th>
            <th className="py-2 pr-4">Tüm Ürünler Sayfası</th>
            <th className="py-2 pr-4" />
          </tr>
        </thead>
        <tbody>
          {categories.map((category) => (
            <tr key={category.id} className="border-b border-gray-100">
              <td className="py-2 pr-4">{category.name}</td>
              <td className="py-2 pr-4">
                <select
                  value={category.sizeChartType}
                  disabled={busy}
                  onChange={(e) => updateSizeChartType(category.id, e.target.value as SizeChartType)}
                  className="rounded border border-gray-300 px-2 py-1 text-sm disabled:opacity-50"
                >
                  {SIZE_CHART_TYPES.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </td>
              <td className="py-2 pr-4">
                <input
                  type="checkbox"
                  checked={category.isAllProducts}
                  disabled={busy}
                  onChange={(e) => updateIsAllProducts(category.id, e.target.checked)}
                />
              </td>
              <td className="py-2 pr-4">
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => deleteCategory(category.id)}
                  className="text-rose-600 hover:underline disabled:opacity-50"
                >
                  Sil
                </button>
              </td>
            </tr>
          ))}
          {categories.length === 0 && (
            <tr>
              <td colSpan={4} className="py-4 text-gray-500">
                Henüz kategori eklenmedi.
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <p className="mb-6 max-w-2xl text-xs text-gray-400">
        &quot;Tüm Ürünler Sayfası&quot; işaretli bir kategori, kendisine atanmış ürünlerin yanı
        sıra sitedeki tüm aktif ürünleri listeler. Kategorisi olmayan veya geçici ürünleri bu
        kategoriye atayabilirsiniz.
      </p>

      <form onSubmit={addCategory} className="flex flex-wrap items-end gap-3">
        <div>
          <label className="mb-1 block text-sm text-gray-700">Yeni Kategori</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="ör. Elbise"
            className="w-48 rounded border border-gray-300 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm text-gray-700">Beden Tablosu Tipi</label>
          <select
            value={sizeChartType}
            onChange={(e) => setSizeChartType(e.target.value as SizeChartType)}
            className="rounded border border-gray-300 px-3 py-2 text-sm"
          >
            {SIZE_CHART_TYPES.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>
        <label className="mb-2 flex items-center gap-2 text-sm text-gray-700">
          <input
            type="checkbox"
            checked={isAllProducts}
            onChange={(e) => setIsAllProducts(e.target.checked)}
          />
          Tüm Ürünler Sayfası
        </label>
        <button
          type="submit"
          disabled={busy}
          className="rounded bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50"
        >
          Ekle
        </button>
      </form>

      {error && <p className="mt-2 text-sm text-rose-600">{error}</p>}
    </div>
  );
}
