"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type CartItem = {
  key: string;
  productId: string;
  slug: string;
  name: string;
  size: string;
  color: string | null;
  image: string | null;
  basePrice: number;
  salePrice: number | null;
  quantity: number;
};

type NewCartItem = Omit<CartItem, "key" | "quantity">;

type CartContextValue = {
  items: CartItem[];
  isOpen: boolean;
  totalItems: number;
  totalBasePrice: number;
  totalPayable: number;
  addItem: (item: NewCartItem, quantity?: number) => void;
  removeItem: (key: string) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = "hilay-cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // One-time sync from browser-only localStorage after mount; can't read it during
    // SSR/lazy-init without a server/client hydration mismatch.
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (raw) setItems(JSON.parse(raw));
    } catch {
      // ignore malformed storage
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, hydrated]);

  const addItem = useCallback((item: NewCartItem, quantity = 1) => {
    const key = `${item.productId}::${item.size}`;
    setItems((prev) => {
      const existing = prev.find((i) => i.key === key);
      if (existing) {
        return prev.map((i) => (i.key === key ? { ...i, quantity: i.quantity + quantity } : i));
      }
      return [...prev, { ...item, key, quantity }];
    });
    setIsOpen(true);
  }, []);

  const removeItem = useCallback((key: string) => {
    setItems((prev) => prev.filter((i) => i.key !== key));
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);
  const toggleCart = useCallback(() => setIsOpen((prev) => !prev), []);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalBasePrice = items.reduce((sum, i) => sum + i.basePrice * i.quantity, 0);
  const totalPayable = items.reduce((sum, i) => sum + (i.salePrice ?? i.basePrice) * i.quantity, 0);

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      isOpen,
      totalItems,
      totalBasePrice,
      totalPayable,
      addItem,
      removeItem,
      clearCart,
      openCart,
      closeCart,
      toggleCart,
    }),
    [
      items,
      isOpen,
      totalItems,
      totalBasePrice,
      totalPayable,
      addItem,
      removeItem,
      clearCart,
      openCart,
      closeCart,
      toggleCart,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
