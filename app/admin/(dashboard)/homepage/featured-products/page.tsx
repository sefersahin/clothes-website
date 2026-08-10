import { prisma } from "@/lib/db";
import FeaturedProductManager from "./FeaturedProductManager";

export default async function AdminFeaturedProductsPage() {
  const [featured, products] = await Promise.all([
    prisma.featuredProduct.findMany({
      include: { product: true },
      orderBy: { sortOrder: "asc" },
    }),
    prisma.product.findMany({ where: { status: "active" }, orderBy: { name: "asc" } }),
  ]);

  const featuredProductIds = new Set(featured.map((f) => f.productId));
  const availableProducts = products.filter((p) => !featuredProductIds.has(p.id));

  return (
    <div>
      <h1 className="mb-6 text-xl font-semibold">Öne Çıkan Ürünler</h1>
      <FeaturedProductManager
        featured={featured.map((f) => ({
          id: f.id,
          sortOrder: f.sortOrder,
          product: { id: f.product.id, name: f.product.name, basePrice: f.product.basePrice.toString() },
        }))}
        availableProducts={availableProducts.map((p) => ({ id: p.id, name: p.name }))}
      />
    </div>
  );
}
