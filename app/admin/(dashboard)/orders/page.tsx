import { prisma } from "@/lib/db";

export default async function AdminOrdersPage() {
  const orderCount = await prisma.order.count();

  return (
    <div>
      <h1 className="mb-6 text-xl font-semibold">Siparişler</h1>
      {orderCount === 0 ? (
        <p className="text-sm text-gray-500">
          Henüz sipariş yok. Sipariş oluşturma (sepet/ödeme akışı) sonraki aşamada eklenecek.
        </p>
      ) : (
        <p className="text-sm text-gray-500">{orderCount} sipariş bulundu.</p>
      )}
    </div>
  );
}
