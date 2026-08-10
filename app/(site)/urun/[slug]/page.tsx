import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { shapeImage } from "@/lib/productImage";
import PriceDisplay from "@/components/PriceDisplay";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      variants: true,
      images: { orderBy: { sortOrder: "asc" } },
      sizeChartRows: { orderBy: { sortOrder: "asc" } },
    },
  });

  if (!product || product.status === "draft") notFound();

  const images = product.images.map(shapeImage);
  const isSoldOut = product.status === "archived";

  return (
    <div className="grid gap-10 md:grid-cols-2">
      <div>
        <div className="mb-3 aspect-[3/4] overflow-hidden rounded-xl bg-stone-100">
          {images[0] ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={images[0].url} alt={product.name} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-sm text-stone-400">
              Görsel yok
            </div>
          )}
        </div>
        {images.length > 1 && (
          <div className="grid grid-cols-4 gap-3">
            {images.slice(1).map((image) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={image.id}
                src={image.thumbnailUrl}
                alt=""
                className="aspect-square rounded-lg object-cover ring-1 ring-stone-200"
              />
            ))}
          </div>
        )}
      </div>

      <div>
        <h1 className="mb-2 text-2xl font-semibold text-stone-900 sm:text-3xl">{product.name}</h1>
        <div className="mb-4">
          <PriceDisplay
            basePrice={product.basePrice.toString()}
            salePrice={product.salePrice?.toString() ?? null}
          />
        </div>

        {isSoldOut && (
          <p className="mb-4 inline-block rounded-full bg-stone-100 px-3 py-1 text-sm font-medium text-stone-600">
            Stokta Yok
          </p>
        )}

        <p className="mb-8 whitespace-pre-line text-sm leading-relaxed text-stone-600">
          {product.description}
        </p>

        {product.variants.length > 0 && (
          <div className="mb-8">
            <h2 className="mb-3 text-sm font-semibold text-stone-900">Beden / Renk</h2>
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-stone-200 text-stone-500">
                  <th className="py-2 pr-4 font-medium">Beden</th>
                  <th className="py-2 pr-4 font-medium">Renk</th>
                  <th className="py-2 pr-4 font-medium">Durum</th>
                </tr>
              </thead>
              <tbody>
                {product.variants.map((variant) => (
                  <tr key={variant.id} className="border-b border-stone-100">
                    <td className="py-2 pr-4">{variant.size}</td>
                    <td className="py-2 pr-4">{variant.color}</td>
                    <td className="py-2 pr-4">
                      {variant.stockQuantity > 0 ? (
                        <span className="text-emerald-600">Stokta</span>
                      ) : (
                        <span className="text-stone-400">Stokta Yok</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {product.sizeChartRows.length > 0 && (
          <div>
            <h2 className="mb-3 text-sm font-semibold text-stone-900">Beden Tablosu</h2>
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-stone-200 text-stone-500">
                  <th className="py-2 pr-4 font-medium">Beden</th>
                  <th className="py-2 pr-4 font-medium">Göğüs (cm)</th>
                  <th className="py-2 pr-4 font-medium">Bel (cm)</th>
                  <th className="py-2 pr-4 font-medium">Kalça (cm)</th>
                  <th className="py-2 pr-4 font-medium">Boy (cm)</th>
                </tr>
              </thead>
              <tbody>
                {product.sizeChartRows.map((row) => (
                  <tr key={row.id} className="border-b border-stone-100">
                    <td className="py-2 pr-4">{row.size}</td>
                    <td className="py-2 pr-4">{row.chest ?? "—"}</td>
                    <td className="py-2 pr-4">{row.waist ?? "—"}</td>
                    <td className="py-2 pr-4">{row.hip ?? "—"}</td>
                    <td className="py-2 pr-4">{row.length ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
