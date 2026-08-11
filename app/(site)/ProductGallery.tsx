"use client";

import { useState } from "react";

type GalleryImage = {
  id: string;
  url: string;
  thumbnailUrl: string;
};

export default function ProductGallery({
  images,
  productName,
}: {
  images: GalleryImage[];
  productName: string;
}) {
  const [selected, setSelected] = useState(0);
  const active = images[selected] ?? images[0];

  return (
    <div>
      <div className="mb-3 aspect-[3/4] overflow-hidden rounded-xl bg-stone-100">
        {active ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={active.url} alt={productName} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-stone-400">
            Görsel yok
          </div>
        )}
      </div>
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-3">
          {images.map((image, index) => (
            <button
              key={image.id}
              type="button"
              onClick={() => setSelected(index)}
              className={`aspect-square overflow-hidden rounded-lg ring-1 transition ${
                index === selected
                  ? "ring-2 ring-rose-600"
                  : "ring-stone-200 hover:ring-stone-400"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={image.thumbnailUrl}
                alt=""
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
