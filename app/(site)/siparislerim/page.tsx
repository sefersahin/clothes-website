import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getCurrentCustomer } from "@/lib/customerAuth";
import { formatTL } from "@/lib/format";

const statusLabels: Record<string, string> = {
  accepted: "Alındı",
  preparing: "Hazırlanıyor",
  shipped: "Kargoya Verildi",
  delivered: "Teslim Edildi",
  cancelled: "İptal Edildi",
};

export default async function OrdersPage() {
  const customer = await getCurrentCustomer();
  if (!customer) redirect("/giris");

  const orders = await prisma.order.findMany({
    where: { customerId: customer.id },
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="mb-8 text-2xl font-semibold text-stone-900">Siparişlerim</h1>

      {orders.length === 0 ? (
        <div className="rounded-2xl border border-stone-200 p-8 text-center">
          <p className="mb-4 text-sm text-stone-500">Henüz bir siparişiniz yok.</p>
          <Link
            href="/kategori/tum-urunler"
            className="inline-block rounded-full bg-stone-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-stone-800"
          >
            Ürünlere göz atalım
          </Link>
        </div>
      ) : (
        <ul className="space-y-4">
          {orders.map((order) => {
            const total = order.items.reduce(
              (sum, item) => sum + Number(item.unitPrice) * item.quantity,
              0
            );
            return (
              <li key={order.id} className="rounded-2xl border border-stone-200 p-5">
                <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="text-sm font-medium text-stone-900">
                      Sipariş #{order.orderToken.slice(0, 8).toUpperCase()}
                    </p>
                    <p className="text-xs text-stone-500">
                      {new Intl.DateTimeFormat("tr-TR", { dateStyle: "long" }).format(order.createdAt)}
                    </p>
                  </div>
                  <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-medium text-stone-600">
                    {statusLabels[order.status] ?? order.status}
                  </span>
                </div>
                <ul className="mb-3 space-y-1 text-sm text-stone-600">
                  {order.items.map((item) => (
                    <li key={item.id}>
                      {item.productName} · {item.size} · {item.color} × {item.quantity}
                    </li>
                  ))}
                </ul>
                <p className="text-right text-sm font-semibold text-stone-900">{formatTL(total)}</p>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
