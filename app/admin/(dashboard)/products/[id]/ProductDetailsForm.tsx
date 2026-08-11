"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Category = { id: string; name: string };

type Product = {
  id: string;
  name: string;
  description: string;
  basePrice: string;
  salePrice: string | null;
  status: string;
  categoryId: string | null;
  color: string | null;
};

const statusOptions = [
  { value: "draft", label: "Taslak" },
  { value: "active", label: "Aktif" },
  { value: "archived", label: "Arşivlendi" },
];

export default function ProductDetailsForm({
  product,
  categories,
}: {
  product: Product;
  categories: Category[];
}) {
  const router = useRouter();
  const [name, setName] = useState(product.name);
  const [description, setDescription] = useState(product.description);
  const [basePrice, setBasePrice] = useState(product.basePrice);
  const [status, setStatus] = useState(product.status);
  const [categoryId, setCategoryId] = useState(product.categoryId ?? "");
  const [color, setColor] = useState(product.color ?? "");
  const [salePercent, setSalePercent] = useState("");
  const [salePrice, setSalePrice] = useState(product.salePrice ?? "");
  const [saleMode, setSaleMode] = useState<"percent" | "price">("price");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function saveDetails(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);

    const body: Record<string, unknown> = {
      name,
      description,
      basePrice: Number(basePrice),
      status,
      categoryId: categoryId || null,
      color: color || null,
    };

    const res = await fetch(`/api/admin/products/${product.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    setSaving(false);
    if (!res.ok) {
      setError("Kaydedilemedi.");
      return;
    }
    router.refresh();
  }

  async function applySale(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);

    const body =
      saleMode === "percent"
        ? { salePercent: Number(salePercent) }
        : { salePrice: salePrice === "" ? null : Number(salePrice) };

    const res = await fetch(`/api/admin/products/${product.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    setSaving(false);
    if (!res.ok) {
      setError("İndirim uygulanamadı.");
      return;
    }
    router.refresh();
  }

  async function clearSale() {
    setSaving(true);
    await fetch(`/api/admin/products/${product.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ salePrice: null }),
    });
    setSaving(false);
    setSalePrice("");
    router.refresh();
  }

  return (
    <div className="space-y-8">
      <form onSubmit={saveDetails} className="space-y-4">
        <h2 className="text-sm font-medium text-gray-500">Ürün Bilgileri</h2>

        <div>
          <label className="mb-1 block text-sm text-gray-700">Ürün Adı</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm text-gray-700">Açıklama</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows={3}
            className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
          />
        </div>

        <div className="flex gap-4">
          <div className="flex-1">
            <label className="mb-1 block text-sm text-gray-700">Fiyat (₺)</label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={basePrice}
              onChange={(e) => setBasePrice(e.target.value)}
              required
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
            />
          </div>
          <div className="flex-1">
            <label className="mb-1 block text-sm text-gray-700">Durum</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
            >
              {statusOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="flex-1">
            <label className="mb-1 block text-sm text-gray-700">Kategori</label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
            >
              <option value="">Kategori Yok</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <label className="mb-1 block text-sm text-gray-700">Renk</label>
            <input
              type="text"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              placeholder="ör. Kırmızı"
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="rounded bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50"
        >
          Bilgileri Kaydet
        </button>
      </form>

      <div className="border-t border-gray-200 pt-6">
        <h2 className="mb-3 text-sm font-medium text-gray-500">İndirim</h2>
        {product.salePrice && (
          <p className="mb-3 text-sm text-gray-600">
            Şu anki indirimli fiyat: <strong>{product.salePrice}₺</strong>{" "}
            <button
              type="button"
              onClick={clearSale}
              disabled={saving}
              className="ml-2 text-rose-600 hover:underline"
            >
              indirimi kaldır
            </button>
          </p>
        )}
        <form onSubmit={applySale} className="flex flex-wrap items-end gap-3">
          <div>
            <label className="mb-1 block text-sm text-gray-700">
              <input
                type="radio"
                checked={saleMode === "percent"}
                onChange={() => setSaleMode("percent")}
                className="mr-1"
              />
              Yüzde indirim (%)
            </label>
            <input
              type="number"
              min="0"
              max="100"
              value={salePercent}
              onChange={(e) => {
                setSaleMode("percent");
                setSalePercent(e.target.value);
              }}
              className="w-28 rounded border border-gray-300 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm text-gray-700">
              <input
                type="radio"
                checked={saleMode === "price"}
                onChange={() => setSaleMode("price")}
                className="mr-1"
              />
              Yeni fiyat (₺)
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={salePrice}
              onChange={(e) => {
                setSaleMode("price");
                setSalePrice(e.target.value);
              }}
              className="w-28 rounded border border-gray-300 px-3 py-2 text-sm"
            />
          </div>
          <button
            type="submit"
            disabled={saving}
            className="rounded border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-50 disabled:opacity-50"
          >
            İndirimi Uygula
          </button>
        </form>
      </div>

      {error && <p className="text-sm text-rose-600">{error}</p>}
    </div>
  );
}
