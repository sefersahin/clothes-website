import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { formatTL } from "@/lib/format";

export default async function OrderConfirmationPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  const order = await prisma.order.findUnique({
    where: { orderToken: token },
    include: { items: true },
  });

  if (!order) notFound();

  const total = order.items.reduce((sum, item) => sum + Number(item.unitPrice) * item.quantity, 0);

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 text-center sm:px-6">
      <div className="mb-6 flex justify-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-3xl text-emerald-600">
          ✓
        </div>
      </div>
      <h1 className="mb-2 text-2xl font-semibold text-stone-900">Siparişiniz Alındı</h1>
      <p className="mb-8 text-sm text-stone-500">
        Teşekkürler {order.customerName}, siparişiniz başarıyla oluşturuldu. Sipariş numaranız:{" "}
        <span className="font-medium text-stone-700">{order.orderToken.slice(0, 8).toUpperCase()}</span>
      </p>

      <div className="mb-8 rounded-2xl border border-stone-200 p-6 text-left">
        <h2 className="mb-3 text-sm font-semibold text-stone-900">Sipariş Özeti</h2>
        <ul className="mb-4 space-y-1 text-sm text-stone-600">
          {order.items.map((item) => (
            <li key={item.id} className="flex items-center justify-between gap-2">
              <span>
                {item.productName} · {item.size} · {item.color} × {item.quantity}
              </span>
              <span className="shrink-0 font-medium text-stone-900">
                {formatTL(Number(item.unitPrice) * item.quantity)}
              </span>
            </li>
          ))}
        </ul>
        <div className="flex items-center justify-between border-t border-stone-200 pt-3">
          <span className="text-sm font-semibold text-stone-900">Toplam</span>
          <span className="text-lg font-semibold text-rose-600">{formatTL(total)}</span>
        </div>
      </div>

      <div className="rounded-2xl border border-stone-200 p-6 text-left">
        <h2 className="mb-3 text-sm font-semibold text-stone-900">Teslimat Adresi</h2>
        <p className="text-sm text-stone-600">
          {order.customerName}
          <br />
          {order.addressLine}
          <br />
          {order.district} / {order.province} {order.postalCode}
          <br />
          {order.phone}
        </p>
      </div>

      <Link
        href="/"
        className="mt-8 inline-block rounded-full bg-stone-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-stone-800"
      >
        Alışverişe Devam Et
      </Link>
    </div>
  );
}
