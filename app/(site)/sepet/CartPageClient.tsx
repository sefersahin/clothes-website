"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCart } from "@/app/(site)/CartContext";
import { formatTL } from "@/lib/format";

type Customer = { name: string; email: string; phone: string | null };

export default function CartPageClient({ customer }: { customer: Customer | null }) {
  const router = useRouter();
  const { items, removeItem, clearCart, totalBasePrice, totalPayable } = useCart();
  const hasDiscount = totalPayable < totalBasePrice;

  const [promoCode, setPromoCode] = useState("");
  const [promoMessage, setPromoMessage] = useState<string | null>(null);

  const [customerName, setCustomerName] = useState(customer?.name ?? "");
  const [phone, setPhone] = useState(customer?.phone ?? "");
  const [email, setEmail] = useState(customer?.email ?? "");
  const [province, setProvince] = useState("");
  const [district, setDistrict] = useState("");
  const [addressLine, setAddressLine] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [addressNotes, setAddressNotes] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  function applyPromoCode(e: React.FormEvent) {
    e.preventDefault();
    setPromoMessage(
      promoCode.trim()
        ? "Promosyon kodları yakında kullanılabilir olacak."
        : "Lütfen bir promosyon kodu girin."
    );
  }

  async function submitOrder(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);

    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customerName,
        phone,
        email: email || undefined,
        province,
        district,
        addressLine,
        postalCode,
        addressNotes: addressNotes || undefined,
        items: items.map((item) => ({
          productName: item.name,
          size: item.size,
          color: item.color ?? "-",
          unitPrice: item.salePrice ?? item.basePrice,
          quantity: item.quantity,
        })),
      }),
    });

    setBusy(false);
    if (!res.ok) {
      setError("Sipariş oluşturulamadı. Lütfen bilgilerinizi kontrol edip tekrar deneyin.");
      return;
    }

    const data = await res.json();
    clearCart();
    router.push(`/siparis-onay/${data.orderToken}`);
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-2xl border border-stone-200 px-6 py-16 text-center">
        <p className="text-sm text-stone-500">Sepetiniz boş.</p>
        <Link
          href="/kategori/tum-urunler"
          className="rounded-full bg-stone-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-stone-800"
        >
          Ürünlere göz atalım
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-10 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <ul className="space-y-4">
          {items.map((item) => {
            const unit = item.salePrice ?? item.basePrice;
            return (
              <li
                key={item.key}
                className="flex gap-4 rounded-2xl border border-stone-200 p-4"
              >
                <div className="h-24 w-20 shrink-0 overflow-hidden rounded-lg bg-stone-100">
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
                    {" "}
                    · Adet: <span className="font-medium text-stone-700">{item.quantity}</span>
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

      <div className="space-y-6">
        <div className="rounded-2xl border border-stone-200 p-5">
          <h2 className="mb-3 text-sm font-semibold text-stone-900">Promosyon Kodu</h2>
          <form onSubmit={applyPromoCode} className="flex gap-2">
            <input
              type="text"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              placeholder="Kod girin"
              className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm"
            />
            <button
              type="submit"
              className="shrink-0 rounded-lg border border-stone-300 px-4 py-2 text-sm font-medium text-stone-700 transition hover:bg-stone-50"
            >
              Uygula
            </button>
          </form>
          {promoMessage && <p className="mt-2 text-xs text-stone-500">{promoMessage}</p>}
        </div>

        <div className="rounded-2xl border border-stone-200 p-5">
          <div className="mb-1 flex items-center justify-between gap-2">
            <span className="text-sm text-stone-600">Toplam</span>
            <div className="flex items-baseline gap-2">
              {hasDiscount && (
                <span className="text-sm text-stone-400 line-through">{formatTL(totalBasePrice)}</span>
              )}
              <span className={`text-lg font-semibold ${hasDiscount ? "text-rose-600" : "text-stone-900"}`}>
                {formatTL(totalPayable)}
              </span>
            </div>
          </div>
          {hasDiscount && (
            <p className="text-right text-xs font-medium text-rose-600">
              {formatTL(totalBasePrice - totalPayable)} tasarruf ediyorsunuz
            </p>
          )}
        </div>

        <div className="rounded-2xl border border-stone-200 p-5">
          <h2 className="mb-1 text-sm font-semibold text-stone-900">Teslimat Bilgileri</h2>
          {!customer && (
            <p className="mb-4 text-xs text-stone-500">
              Üye olmadan alışverişe devam edebilirsiniz.{" "}
              <Link href="/giris" className="font-medium text-rose-600 hover:underline">
                Zaten üye misiniz? Giriş yapın
              </Link>
            </p>
          )}
          <form onSubmit={submitOrder} className="space-y-3">
            <div>
              <label className="mb-1 block text-xs text-stone-600">Ad Soyad</label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                required
                className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-stone-600">Telefon</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-stone-600">E-posta (opsiyonel)</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm"
              />
            </div>
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="mb-1 block text-xs text-stone-600">İl</label>
                <input
                  type="text"
                  value={province}
                  onChange={(e) => setProvince(e.target.value)}
                  required
                  className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm"
                />
              </div>
              <div className="flex-1">
                <label className="mb-1 block text-xs text-stone-600">İlçe</label>
                <input
                  type="text"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  required
                  className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm"
                />
              </div>
            </div>
            <div>
              <label className="mb-1 block text-xs text-stone-600">Adres</label>
              <textarea
                value={addressLine}
                onChange={(e) => setAddressLine(e.target.value)}
                required
                rows={2}
                className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-stone-600">Posta Kodu</label>
              <input
                type="text"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                required
                className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-stone-600">Adres Notu (opsiyonel)</label>
              <textarea
                value={addressNotes}
                onChange={(e) => setAddressNotes(e.target.value)}
                rows={2}
                className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm"
              />
            </div>

            {error && <p className="text-sm text-rose-600">{error}</p>}

            <button
              type="submit"
              disabled={busy}
              className="w-full rounded-full bg-stone-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-stone-800 disabled:opacity-50"
            >
              {busy ? "Sipariş oluşturuluyor…" : "Siparişi Tamamla"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
