"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AccountMenu({ customer }: { customer: { name: string } | null }) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  async function logout() {
    setIsOpen(false);
    await fetch("/api/auth/logout", { method: "POST" });
    router.refresh();
  }

  if (!customer) {
    return (
      <Link href="/giris" className="text-sm font-medium text-stone-600 transition-colors hover:text-rose-600">
        Giriş Yap
      </Link>
    );
  }

  const firstName = customer.name.split(" ")[0];

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-1.5 text-sm font-medium text-stone-600 transition-colors hover:text-rose-600"
      >
        {firstName}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className={`h-3.5 w-3.5 transition-transform ${isOpen ? "rotate-180" : ""}`}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {isOpen && (
        <>
          <div aria-hidden onClick={() => setIsOpen(false)} className="fixed inset-0 z-40" />
          <div className="absolute right-0 top-full z-50 mt-2 w-44 overflow-hidden rounded-xl border border-stone-200 bg-white py-1 shadow-lg">
            <Link
              href="/hesabim"
              onClick={() => setIsOpen(false)}
              className="block px-4 py-2 text-sm text-stone-700 hover:bg-stone-50"
            >
              Hesabım
            </Link>
            <Link
              href="/siparislerim"
              onClick={() => setIsOpen(false)}
              className="block px-4 py-2 text-sm text-stone-700 hover:bg-stone-50"
            >
              Siparişlerim
            </Link>
            <button
              type="button"
              onClick={logout}
              className="block w-full px-4 py-2 text-left text-sm text-rose-600 hover:bg-stone-50"
            >
              Çıkış Yap
            </button>
          </div>
        </>
      )}
    </div>
  );
}
