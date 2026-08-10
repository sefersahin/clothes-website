"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

type Category = { id: string; name: string };

type HeroSlide = {
  id: string;
  imageUrl: string;
  sortOrder: number;
  categoryId: string | null;
};

export default function HeroSlideManager({
  slides,
  categories,
}: {
  slides: HeroSlide[];
  categories: Category[];
}) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [newCategoryId, setNewCategoryId] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setBusy(true);

    const formData = new FormData();
    formData.append("file", file);
    if (newCategoryId) formData.append("categoryId", newCategoryId);

    const res = await fetch("/api/admin/hero-slides", { method: "POST", body: formData });

    setBusy(false);
    if (fileInputRef.current) fileInputRef.current.value = "";

    if (!res.ok) {
      setError("Görsel yüklenemedi.");
      return;
    }
    setNewCategoryId("");
    router.refresh();
  }

  async function updateCategory(slideId: string, categoryId: string) {
    setBusy(true);
    await fetch(`/api/admin/hero-slides/${slideId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ categoryId: categoryId || null }),
    });
    setBusy(false);
    router.refresh();
  }

  async function deleteSlide(slideId: string) {
    setBusy(true);
    await fetch(`/api/admin/hero-slides/${slideId}`, { method: "DELETE" });
    setBusy(false);
    router.refresh();
  }

  async function move(index: number, direction: -1 | 1) {
    const target = slides[index + direction];
    const current = slides[index];
    if (!target) return;

    setBusy(true);
    await Promise.all([
      fetch(`/api/admin/hero-slides/${current.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sortOrder: target.sortOrder }),
      }),
      fetch(`/api/admin/hero-slides/${target.id}`, {
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
      <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
        {slides.map((slide, index) => (
          <div key={slide.id} className="rounded border border-gray-200 p-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={slide.imageUrl}
              alt=""
              className="mb-2 aspect-video w-full rounded object-cover"
            />
            <select
              value={slide.categoryId ?? ""}
              onChange={(e) => updateCategory(slide.id, e.target.value)}
              disabled={busy}
              className="mb-2 w-full rounded border border-gray-300 px-2 py-1 text-xs"
            >
              <option value="">Kategori Yok</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            <div className="flex items-center justify-between text-xs">
              <div className="space-x-1">
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
                  disabled={busy || index === slides.length - 1}
                  onClick={() => move(index, 1)}
                  className="disabled:opacity-30"
                >
                  ↓
                </button>
              </div>
              <button
                type="button"
                disabled={busy}
                onClick={() => deleteSlide(slide.id)}
                className="text-rose-600 hover:underline disabled:opacity-50"
              >
                Sil
              </button>
            </div>
          </div>
        ))}
        {slides.length === 0 && (
          <p className="col-span-full text-sm text-gray-500">Henüz görsel eklenmedi.</p>
        )}
      </div>

      <div className="flex flex-wrap items-end gap-3">
        <div>
          <label className="mb-1 block text-sm text-gray-700">Kategori (opsiyonel)</label>
          <select
            value={newCategoryId}
            onChange={(e) => setNewCategoryId(e.target.value)}
            className="rounded border border-gray-300 px-3 py-2 text-sm"
          >
            <option value="">Kategori Yok</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm text-gray-700">Yeni Görsel</label>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,.heic,.heif"
            onChange={handleUpload}
            disabled={busy}
            className="text-sm"
          />
        </div>
      </div>

      {busy && <p className="mt-2 text-sm text-gray-500">İşleniyor…</p>}
      {error && <p className="mt-2 text-sm text-rose-600">{error}</p>}
    </div>
  );
}
