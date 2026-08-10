"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Category = {
  id: string;
  name: string;
  slug: string;
};

export default function CategoryManager({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function addCategory(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);

    const res = await fetch("/api/admin/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });

    setBusy(false);
    if (!res.ok) {
      setError("Kategori eklenemedi.");
      return;
    }
    setName("");
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
      <table className="mb-6 w-full max-w-md text-left text-sm">
        <thead>
          <tr className="border-b border-gray-200 text-gray-500">
            <th className="py-2 pr-4">Kategori</th>
            <th className="py-2 pr-4" />
          </tr>
        </thead>
        <tbody>
          {categories.map((category) => (
            <tr key={category.id} className="border-b border-gray-100">
              <td className="py-2 pr-4">{category.name}</td>
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
              <td colSpan={2} className="py-4 text-gray-500">
                Henüz kategori eklenmedi.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <form onSubmit={addCategory} className="flex items-end gap-3">
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
