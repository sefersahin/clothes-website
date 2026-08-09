import Link from "next/link";
import { prisma } from "@/lib/db";

export default async function AdminHomePage() {
  const [outOfStockVariants, soldOutProducts] = await Promise.all([
    prisma.productVariant.findMany({
      where: { stockQuantity: 0, product: { status: "active" } },
      include: { product: true },
      orderBy: { product: { name: "asc" } },
    }),
    prisma.product.findMany({
      where: { status: "archived" },
      orderBy: { updatedAt: "desc" },
    }),
  ]);

  const hasAlerts = outOfStockVariants.length > 0 || soldOutProducts.length > 0;

  return (
    <div>
      <h1 className="mb-6 text-xl font-semibold">Dikkat Gerekenler</h1>

      {!hasAlerts && (
        <p className="text-sm text-gray-500">Şu anda dikkat gerektiren bir durum yok.</p>
      )}

      {soldOutProducts.length > 0 && (
        <div className="mb-6">
          <h2 className="mb-2 text-sm font-medium text-gray-500">Tamamen Stokta Yok</h2>
          <ul className="space-y-1">
            {soldOutProducts.map((product) => (
              <li key={product.id}>
                <Link
                  href={`/admin/products/${product.id}`}
                  className="text-sm text-rose-600 hover:underline"
                >
                  {product.name} stokta yok
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {outOfStockVariants.length > 0 && (
        <div>
          <h2 className="mb-2 text-sm font-medium text-gray-500">Bazı Bedenler Stokta Yok</h2>
          <ul className="space-y-1">
            {outOfStockVariants.map((variant) => (
              <li key={variant.id}>
                <Link
                  href={`/admin/products/${variant.productId}`}
                  className="text-sm text-amber-600 hover:underline"
                >
                  {variant.product.name} - {variant.size} {variant.color} stokta yok
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
