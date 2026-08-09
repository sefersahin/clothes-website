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
    },
  });

  if (!product || product.status === "draft") notFound();

  const images = product.images.map(shapeImage);
  const isSoldOut = product.status === "archived";

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <div>
        <div className="mb-3 aspect-square overflow-hidden rounded bg-gray-100">
          {images[0] && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={images[0].url} alt={product.name} className="h-full w-full object-cover" />
          )}
        </div>
        {images.length > 1 && (
          <div className="grid grid-cols-4 gap-2">
            {images.slice(1).map((image) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={image.id}
                src={image.thumbnailUrl}
                alt=""
                className="aspect-square rounded object-cover"
              />
            ))}
          </div>
        )}
      </div>

      <div>
        <h1 className="mb-2 text-2xl font-semibold">{product.name}</h1>
        <div className="mb-4">
          <PriceDisplay
            basePrice={product.basePrice.toString()}
            salePrice={product.salePrice?.toString() ?? null}
          />
        </div>

        {isSoldOut && (
          <p className="mb-4 inline-block rounded bg-gray-100 px-3 py-1 text-sm font-medium text-gray-600">
            Stokta Yok
          </p>
        )}

        <p className="mb-6 whitespace-pre-line text-sm text-gray-700">{product.description}</p>

        {product.variants.length > 0 && (
          <div>
            <h2 className="mb-2 text-sm font-medium text-gray-500">Beden / Renk</h2>
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-gray-500">
                  <th className="py-2 pr-4">Beden</th>
                  <th className="py-2 pr-4">Renk</th>
                  <th className="py-2 pr-4">Durum</th>
                </tr>
              </thead>
              <tbody>
                {product.variants.map((variant) => (
                  <tr key={variant.id} className="border-b border-gray-100">
                    <td className="py-2 pr-4">{variant.size}</td>
                    <td className="py-2 pr-4">{variant.color}</td>
                    <td className="py-2 pr-4">
                      {variant.stockQuantity > 0 ? "Stokta" : "Stokta Yok"}
                    </td>
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
