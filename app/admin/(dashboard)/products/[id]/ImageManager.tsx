"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

type ProductImage = {
  id: string;
  sortOrder: number;
  url: string;
  thumbnailUrl: string;
};

export default function ImageManager({
  productId,
  images,
}: {
  productId: string;
  images: ProductImage[];
}) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch(`/api/admin/products/${productId}/images`, {
      method: "POST",
      body: formData,
    });

    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";

    if (!res.ok) {
      setError("Fotoğraf yüklenemedi.");
      return;
    }
    router.refresh();
  }

  async function deleteImage(imageId: string) {
    setUploading(true);
    await fetch(`/api/admin/images/${imageId}`, { method: "DELETE" });
    setUploading(false);
    router.refresh();
  }

  async function move(index: number, direction: -1 | 1) {
    const target = images[index + direction];
    const current = images[index];
    if (!target) return;

    setUploading(true);
    await Promise.all([
      fetch(`/api/admin/images/${current.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sortOrder: target.sortOrder }),
      }),
      fetch(`/api/admin/images/${target.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sortOrder: current.sortOrder }),
      }),
    ]);
    setUploading(false);
    router.refresh();
  }

  return (
    <div>
      <h2 className="mb-3 text-sm font-medium text-gray-500">Fotoğraflar</h2>

      <div className="mb-4 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {images.map((image, index) => (
          <div key={image.id} className="rounded border border-gray-200 p-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={image.thumbnailUrl}
              alt=""
              className="mb-2 aspect-square w-full rounded object-cover"
            />
            <div className="flex items-center justify-between text-xs">
              <div className="space-x-1">
                <button
                  type="button"
                  disabled={uploading || index === 0}
                  onClick={() => move(index, -1)}
                  className="disabled:opacity-30"
                >
                  ↑
                </button>
                <button
                  type="button"
                  disabled={uploading || index === images.length - 1}
                  onClick={() => move(index, 1)}
                  className="disabled:opacity-30"
                >
                  ↓
                </button>
              </div>
              <button
                type="button"
                disabled={uploading}
                onClick={() => deleteImage(image.id)}
                className="text-rose-600 hover:underline disabled:opacity-50"
              >
                Sil
              </button>
            </div>
            {index === 0 && (
              <div className="mt-1 text-center text-[10px] text-gray-400">Kapak Fotoğrafı</div>
            )}
          </div>
        ))}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,.heic,.heif"
        onChange={handleUpload}
        disabled={uploading}
        className="text-sm"
      />
      {uploading && <p className="mt-1 text-sm text-gray-500">İşleniyor…</p>}
      {error && <p className="mt-1 text-sm text-rose-600">{error}</p>}
    </div>
  );
}
