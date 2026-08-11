"use client";

import Link from "next/link";
import { useCart } from "./CartContext";
import { formatTL } from "@/lib/format";

export default function CartPanel() {
  const { items, isOpen, closeCart, removeItem, totalBasePrice, totalPayable } = useCart();
  const hasDiscount = totalPayable < totalBasePrice;

  return (
    <>
      <div
        aria-hidden
        onClick={closeCart}
        className={`fixed inset-0 z-40 bg-stone-900/40 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />
      <aside
        aria-hidden={!isOpen}
        className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-sm flex-col bg-white shadow-xl transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-stone-200 px-5 py-4">
          <h2 className="text-base font-semibold text-stone-900">Sepetim</h2>
          <button
            type="button"
            onClick={closeCart}
            aria-label="Sepeti Kapat"
            className="text-xl leading-none text-stone-400 hover:text-stone-700"
          >
            ✕
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
            <p className="text-sm text-stone-500">Sepetiniz boş.</p>
            <Link
              href="/kategori/tum-urunler"
              onClick={closeCart}
              className="rounded-full bg-stone-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-stone-800"
            >
              Ürünlere göz atalım
            </Link>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-5 py-4">
              <ul className="space-y-4">
                {items.map((item) => {
                  const unit = item.salePrice ?? item.basePrice;
                  return (
                    <li key={item.key} className="flex gap-3">
                      <div className="h-20 w-16 shrink-0 overflow-hidden rounded-lg bg-stone-100">
                        {item.image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={item.image} alt="" className="h-full w-full object-cover" />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-[10px] text-stone-400">
                            Görsel yok
                          </div>
                        )}
                      </div>
                      <div className="flex flex-1 flex-col">
                        <div className="flex items-start justify-between gap-2">
                          <Link
                            href={`/urun/${item.slug}`}
                            onClick={closeCart}
                            className="text-sm font-medium text-stone-900 hover:text-rose-600"
                          >
                            {item.name}
                          </Link>
                          <button
                            type="button"
                            onClick={() => removeItem(item.key)}
                            aria-label="Ürünü sepetten kaldır"
                            className="text-stone-400 hover:text-rose-600"
                          >
                            ✕
                          </button>
                        </div>
                        <p className="mt-1 text-xs text-stone-500">
                          Beden: <span className="font-medium text-stone-700">{item.size}</span>
                          {item.color && (
                            <>
                              {" "}
                              · Renk: <span className="font-medium text-stone-700">{item.color}</span>
                            </>
                          )}
                          {item.quantity > 1 && <span> · Adet: {item.quantity}</span>}
                        </p>
                        <div className="mt-auto flex items-baseline gap-2 pt-2">
                          {item.salePrice !== null && (
                            <span className="text-xs text-stone-400 line-through">
                              {formatTL(item.basePrice * item.quantity)}
                            </span>
                          )}
                          <span
                            className={`text-sm font-semibold ${
                              item.salePrice !== null ? "text-rose-600" : "text-stone-900"
                            }`}
                          >
                            {formatTL(unit * item.quantity)}
                          </span>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="border-t border-stone-200 px-5 py-4">
              <div className="mb-1 flex items-center justify-between gap-2">
                <span className="text-sm text-stone-600">Toplam</span>
                <div className="flex items-baseline gap-2">
                  {hasDiscount && (
                    <span className="text-sm text-stone-400 line-through">{formatTL(totalBasePrice)}</span>
                  )}
                  <span
                    className={`text-lg font-semibold ${hasDiscount ? "text-rose-600" : "text-stone-900"}`}
                  >
                    {formatTL(totalPayable)}
                  </span>
                </div>
              </div>
              {hasDiscount && (
                <p className="mb-3 text-right text-xs font-medium text-rose-600">
                  {formatTL(totalBasePrice - totalPayable)} tasarruf ediyorsunuz
                </p>
              )}
              <Link
                href="/sepet"
                onClick={closeCart}
                className="block w-full rounded-full bg-stone-900 px-5 py-3 text-center text-sm font-semibold text-white transition hover:bg-stone-800"
              >
                Sepete Git
              </Link>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
