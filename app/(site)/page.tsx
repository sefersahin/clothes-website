import Link from "next/link";
import { prisma } from "@/lib/db";
import { shapeImage } from "@/lib/productImage";
import PriceDisplay from "@/components/PriceDisplay";

export default async function HomePage() {
  const products = await prisma.product.findMany({
    where: { status: "active" },
    include: { images: { orderBy: { sortOrder: "asc" }, take: 1 } },
    orderBy: { createdAt: "desc" },
  });

  if (products.length === 0) {
    return <p className="text-sm text-gray-500">Şu anda listelenen ürün yok.</p>;
  }

  return (
    <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4">
      {products.map((product) => {
        const cover = product.images[0] ? shapeImage(product.images[0]) : null;
        return (
          <Link key={product.id} href={`/urun/${product.slug}`} className="group">
            <div className="mb-2 aspect-square overflow-hidden rounded bg-gray-100">
              {cover && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={cover.thumbnailUrl}
                  alt={product.name}
                  className="h-full w-full object-cover transition group-hover:scale-105"
                />
              )}
            </div>
            <div className="text-sm font-medium">{product.name}</div>
            <PriceDisplay basePrice={product.basePrice.toString()} salePrice={product.salePrice?.toString() ?? null} />
          </Link>
        );
      })}
    </div>
  );
}
