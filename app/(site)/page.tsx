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

  return (
    <div>
      <section className="mb-12 rounded-2xl bg-stone-50 px-6 py-14 text-center sm:py-20">
        <h1 className="text-3xl font-semibold tracking-tight text-stone-900 sm:text-4xl">
          Hilay <span className="text-rose-600">Butik</span>
        </h1>
        <p className="mx-auto mt-3 max-w-md text-sm text-stone-500 sm:text-base">
          Seçkin parçalar, uygun fiyatlar. Yeni sezon ürünlerimizi keşfedin.
        </p>
      </section>

      {products.length === 0 ? (
        <p className="text-center text-sm text-stone-500">Şu anda listelenen ürün yok.</p>
      ) : (
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 md:grid-cols-4">
          {products.map((product) => {
            const cover = product.images[0] ? shapeImage(product.images[0]) : null;
            return (
              <Link key={product.id} href={`/urun/${product.slug}`} className="group block">
                <div className="mb-3 aspect-[3/4] overflow-hidden rounded-xl bg-stone-100">
                  {cover ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={cover.thumbnailUrl}
                      alt={product.name}
                      className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-xs text-stone-400">
                      Görsel yok
                    </div>
                  )}
                </div>
                <div className="text-sm font-medium text-stone-900 group-hover:text-rose-600">
                  {product.name}
                </div>
                <PriceDisplay
                  basePrice={product.basePrice.toString()}
                  salePrice={product.salePrice?.toString() ?? null}
                />
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
