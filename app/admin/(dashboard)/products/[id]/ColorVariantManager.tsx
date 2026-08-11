"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Sibling = {
  id: string;
  name: string;
  color: string | null;
};

export default function ColorVariantManager({
  productId,
  siblings,
}: {
  productId: string;
  siblings: Sibling[];
}) {
  const router = useRouter();
  const [color, setColor] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function addColorVariant(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);

    const res = await fetch(`/api/admin/products/${productId}/color-variants`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ color }),
    });

    setBusy(false);
    if (!res.ok) {
      setError("Renk seçeneği eklenemedi.");
      return;
    }

    const newProduct = await res.json();
    router.push(`/admin/products/${newProduct.id}`);
    router.refresh();
  }

  return (
    <div>
      <h2 className="mb-1 text-sm font-medium text-gray-500">Renk Seçenekleri</h2>
      <p className="mb-3 text-xs text-gray-400">
        Aynı ürünün farklı renkteki versiyonları — müşteriler ürün sayfasında bu renkler arasında
        geçiş yapabilir. Her renk kendi fotoğraflarına ve bedenlerine sahiptir.
      </p>

      {siblings.length > 0 && (
        <ul className="mb-4 space-y-1">
          {siblings.map((sibling) => (
            <li key={sibling.id}>
              <Link
                href={`/admin/products/${sibling.id}`}
                className="text-sm text-gray-700 hover:underline"
              >
                {sibling.color ?? "(renk belirtilmedi)"} — {sibling.name}
              </Link>
            </li>
          ))}
        </ul>
      )}

      <form onSubmit={addColorVariant} className="flex items-end gap-3">
        <div>
          <label className="mb-1 block text-sm text-gray-700">Yeni Renk</label>
          <input
            type="text"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            required
            placeholder="ör. Mavi"
            className="w-48 rounded border border-gray-300 px-3 py-2 text-sm"
          />
        </div>
        <button
          type="submit"
          disabled={busy}
          className="rounded border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-50 disabled:opacity-50"
        >
          Farklı Renkte Ekle
        </button>
      </form>

      {error && <p className="mt-2 text-sm text-rose-600">{error}</p>}
    </div>
  );
}
