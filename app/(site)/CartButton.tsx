"use client";

import { useCart } from "./CartContext";

export default function CartButton() {
  const { totalItems, toggleCart } = useCart();

  return (
    <button
      type="button"
      onClick={toggleCart}
      aria-label="Sepeti Aç"
      className="relative flex items-center text-stone-600 transition-colors hover:text-rose-600"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        className="h-6 w-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 3h1.5l1.4 12.6A2 2 0 0 0 7.9 17.4h9.2a2 2 0 0 0 2-1.7L20.5 7H6"
        />
        <circle cx="9" cy="20" r="1.3" fill="currentColor" stroke="none" />
        <circle cx="17" cy="20" r="1.3" fill="currentColor" stroke="none" />
      </svg>
      {totalItems > 0 && (
        <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-600 px-1 text-[11px] font-semibold text-white">
          {totalItems}
        </span>
      )}
    </button>
  );
}
