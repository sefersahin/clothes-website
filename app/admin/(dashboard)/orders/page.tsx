import { prisma } from "@/lib/db";
import OrderList from "./OrderList";

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });

  const shaped = orders.map((order) => ({
    id: order.id,
    orderToken: order.orderToken,
    customerName: order.customerName,
    phone: order.phone,
    email: order.email,
    province: order.province,
    district: order.district,
    addressLine: order.addressLine,
    postalCode: order.postalCode,
    addressNotes: order.addressNotes,
    status: order.status,
    createdAt: order.createdAt.toISOString(),
    items: order.items.map((item) => ({
      id: item.id,
      productName: item.productName,
      size: item.size,
      color: item.color,
      unitPrice: item.unitPrice.toString(),
      quantity: item.quantity,
    })),
  }));

  return (
    <div>
      <h1 className="mb-6 text-xl font-semibold">Siparişler</h1>
      {shaped.length === 0 ? (
        <p className="text-sm text-gray-500">Henüz sipariş yok.</p>
      ) : (
        <OrderList orders={shaped} />
      )}
    </div>
  );
}
