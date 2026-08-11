import Link from "next/link";
import { prisma } from "@/lib/db";

const statusLabels: Record<string, string> = {
  draft: "Taslak",
  active: "Aktif",
  archived: "Arşivlendi",
};

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    include: { variants: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold">Ürünler</h1>
        <Link
          href="/admin/products/new"
          className="rounded bg-gray-900 px-3 py-2 text-sm font-medium text-white hover:bg-gray-800"
        >
          + Yeni Ürün
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px] text-left text-sm">
          <thead>
            <tr className="border-b border-gray-200 text-gray-500">
              <th className="py-2 pr-4">Ürün</th>
              <th className="py-2 pr-4">Renk</th>
              <th className="py-2 pr-4">Durum</th>
              <th className="py-2 pr-4">Fiyat</th>
              <th className="py-2 pr-4">Toplam Stok</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => {
              const totalStock = product.variants.reduce((sum, v) => sum + v.stockQuantity, 0);
              return (
                <tr key={product.id} className="border-b border-gray-100">
                  <td className="py-2 pr-4">
                    <Link href={`/admin/products/${product.id}`} className="hover:underline">
                      {product.name}
                    </Link>
                  </td>
                  <td className="py-2 pr-4">{product.color ?? "—"}</td>
                  <td className="py-2 pr-4">{statusLabels[product.status] ?? product.status}</td>
                  <td className="py-2 pr-4">
                    {product.salePrice ? `${product.salePrice}₺` : `${product.basePrice}₺`}
                  </td>
                  <td className="py-2 pr-4">{totalStock}</td>
                </tr>
              );
            })}
            {products.length === 0 && (
              <tr>
                <td colSpan={5} className="py-6 text-center text-gray-500">
                  Henüz ürün eklenmedi.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
