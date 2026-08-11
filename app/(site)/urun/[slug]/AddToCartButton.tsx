"use client";

import { useState } from "react";
import { useCart } from "@/app/(site)/CartContext";

type Variant = { id: string; size: string; stockQuantity: number };

export default function AddToCartButton({
  productId,
  slug,
  name,
  color,
  image,
  basePrice,
  salePrice,
  variants,
  disabled,
}: {
  productId: string;
  slug: string;
  name: string;
  color: string | null;
  image: string | null;
  basePrice: number;
  salePrice: number | null;
  variants: Variant[];
  disabled: boolean;
}) {
  const { addItem } = useCart();
  const [showPicker, setShowPicker] = useState(false);
  const [justAdded, setJustAdded] = useState<string | null>(null);

  const hasStock = variants.some((v) => v.stockQuantity > 0);
  const isDisabled = disabled || !hasStock;

  function pickSize(size: string) {
    addItem({ productId, slug, name, color, image, basePrice, salePrice, size });
    setShowPicker(false);
    setJustAdded(size);
    window.setTimeout(() => setJustAdded((current) => (current === size ? null : current)), 2000);
  }

  return (
    <div className="mb-8">
      {variants.length > 0 && (
        <>
          <h2 className="mb-3 text-sm font-semibold text-stone-900">Beden</h2>
          <div className="mb-4 flex flex-wrap gap-2">
            {variants.map((variant) => {
              const inStock = variant.stockQuantity > 0;
              return (
                <span
                  key={variant.id}
                  className={`rounded-lg border px-3 py-1.5 text-sm ${
                    inStock
                      ? "border-stone-900 font-semibold text-stone-900"
                      : "border-stone-200 text-stone-300 line-through"
                  }`}
                >
                  {variant.size}
                </span>
              );
            })}
          </div>
        </>
      )}

      <button
        type="button"
        disabled={isDisabled}
        onClick={() => setShowPicker(true)}
        className="w-full rounded-full bg-stone-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:bg-stone-200 disabled:text-stone-400 sm:w-auto"
      >
        {isDisabled ? "Stokta Yok" : "Sepete Ekle"}
      </button>

      {justAdded && (
        <p className="mt-2 text-sm font-medium text-emerald-600">{justAdded} beden sepete eklendi.</p>
      )}

      {showPicker && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-stone-900/40 sm:items-center"
          onClick={() => setShowPicker(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm rounded-t-2xl bg-white p-6 sm:rounded-2xl"
          >
            <h3 className="mb-4 text-base font-semibold text-stone-900">Hangi bedeni istersiniz?</h3>
            <div className="flex flex-wrap gap-2">
              {variants.map((variant) => {
                const inStock = variant.stockQuantity > 0;
                return (
                  <button
                    key={variant.id}
                    type="button"
                    disabled={!inStock}
                    onClick={() => pickSize(variant.size)}
                    className={`rounded-lg border px-4 py-2 text-sm font-medium transition ${
                      inStock
                        ? "border-stone-900 text-stone-900 hover:bg-stone-900 hover:text-white"
                        : "cursor-not-allowed border-stone-200 text-stone-300 line-through"
                    }`}
                  >
                    {variant.size}
                  </button>
                );
              })}
            </div>
            <button
              type="button"
              onClick={() => setShowPicker(false)}
              className="mt-5 w-full text-center text-sm text-stone-500 hover:text-stone-700"
            >
              Vazgeç
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
