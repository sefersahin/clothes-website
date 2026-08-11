"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { formatTL } from "@/lib/format";

type OrderItem = {
  id: string;
  productName: string;
  size: string;
  color: string;
  unitPrice: string;
  quantity: number;
};

export type Order = {
  id: string;
  orderToken: string;
  customerName: string;
  phone: string;
  email: string | null;
  province: string;
  district: string;
  addressLine: string;
  postalCode: string;
  addressNotes: string | null;
  status: string;
  createdAt: string;
  items: OrderItem[];
};

const STATUS_OPTIONS = [
  { value: "accepted", label: "Alındı" },
  { value: "preparing", label: "Hazırlanıyor" },
  { value: "shipped", label: "Kargoya Verildi" },
  { value: "delivered", label: "Teslim Edildi" },
  { value: "cancelled", label: "İptal Edildi" },
];

function orderTotal(items: OrderItem[]) {
  return items.reduce((sum, item) => sum + Number(item.unitPrice) * item.quantity, 0);
}

export default function OrderList({ orders }: { orders: Order[] }) {
  return (
    <ul className="space-y-3">
      {orders.map((order) => (
        <OrderRow key={order.id} order={order} />
      ))}
    </ul>
  );
}

function OrderRow({ order }: { order: Order }) {
  const router = useRouter();
  const [expanded, setExpanded] = useState(false);
  const [status, setStatus] = useState(order.status);
  const [busy, setBusy] = useState(false);
  const total = orderTotal(order.items);

  async function updateStatus(newStatus: string) {
    setStatus(newStatus);
    setBusy(true);
    await fetch(`/api/admin/orders/${order.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    setBusy(false);
    router.refresh();
  }

  return (
    <li className="overflow-hidden rounded-xl border border-gray-200">
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-gray-900">
            #{order.orderToken.slice(0, 8).toUpperCase()}
          </span>
          <span className="text-sm text-gray-600">{formatTL(total)}</span>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={status}
            disabled={busy}
            onChange={(e) => updateStatus(e.target.value)}
            className="rounded border border-gray-300 px-2 py-1 text-xs disabled:opacity-50"
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => setExpanded((prev) => !prev)}
            className="text-xs font-medium text-gray-600 hover:text-gray-900"
          >
            {expanded ? "Gizle" : "Detaylar"}
          </button>
        </div>
      </div>

      {expanded && (
        <div className="border-t border-gray-100 px-4 py-4 text-sm text-gray-600">
          <div className="mb-3 grid gap-3 sm:grid-cols-2">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-gray-400">Müşteri</p>
              <p>{order.customerName}</p>
              <p>{order.phone}</p>
              {order.email && <p>{order.email}</p>}
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-gray-400">Adres</p>
              <p>{order.addressLine}</p>
              <p>
                {order.district} / {order.province} {order.postalCode}
              </p>
              {order.addressNotes && <p className="text-gray-500">Not: {order.addressNotes}</p>}
            </div>
          </div>

          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-gray-400">Ürünler</p>
          <ul className="mb-3 space-y-1">
            {order.items.map((item) => (
              <li key={item.id} className="flex items-center justify-between gap-2">
                <span>
                  {item.productName} · {item.size} · {item.color} × {item.quantity}
                </span>
                <span className="shrink-0 font-medium text-gray-900">
                  {formatTL(Number(item.unitPrice) * item.quantity)}
                </span>
              </li>
            ))}
          </ul>

          <p className="text-xs text-gray-400">
            Sipariş Tarihi:{" "}
            {new Intl.DateTimeFormat("tr-TR", { dateStyle: "long", timeStyle: "short" }).format(
              new Date(order.createdAt)
            )}
          </p>
        </div>
      )}
    </li>
  );
}
