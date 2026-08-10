"use client";

import { useRef } from "react";
import ProductCard, { type ProductCardData } from "@/components/ProductCard";

export default function FeaturedCarousel({ products }: { products: ProductCardData[] }) {
  const scrollerRef = useRef<HTMLDivElement>(null);

  function scroll(direction: -1 | 1) {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({ left: direction * 260, behavior: "smooth" });
  }

  if (products.length === 0) return null;

  return (
    <div className="relative mb-12">
      <div
        ref={scrollerRef}
        className="flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth pb-2"
      >
        {products.map((product) => (
          <div key={product.id} className="w-44 shrink-0 snap-start sm:w-56">
            <ProductCard product={product} />
          </div>
        ))}
      </div>

      {products.length > 3 && (
        <>
          <button
            type="button"
            onClick={() => scroll(-1)}
            aria-label="Önceki"
            className="absolute -left-3 top-1/3 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white text-stone-900 shadow ring-1 ring-stone-200 hover:bg-stone-50 sm:flex"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={() => scroll(1)}
            aria-label="Sonraki"
            className="absolute -right-3 top-1/3 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white text-stone-900 shadow ring-1 ring-stone-200 hover:bg-stone-50 sm:flex"
          >
            ›
          </button>
        </>
      )}
    </div>
  );
}
