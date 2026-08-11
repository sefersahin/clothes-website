import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { shapeImage } from "@/lib/productImage";
import PriceDisplay from "@/components/PriceDisplay";
import ProductGallery from "@/app/(site)/ProductGallery";

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
      group: {
        include: {
          products: {
            where: { status: { not: "draft" } },
            include: { images: { orderBy: { sortOrder: "asc" }, take: 1 } },
          },
        },
      },
    },
  });

  if (!product || product.status === "draft") notFound();

  const images = product.images.map(shapeImage);
  const isSoldOut = product.status === "archived";
  const colorOptions = product.group?.products ?? [];

  return (
    <div className="mx-auto grid max-w-6xl gap-10 px-4 py-10 sm:px-6 md:grid-cols-2">
      <ProductGallery images={images} productName={product.name} />

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

        {colorOptions.length > 1 && (
          <div className="mb-8">
            <h2 className="mb-3 text-sm font-semibold text-stone-900">Renk</h2>
            <div className="flex flex-wrap gap-2">
              {colorOptions.map((option) => {
                const cover = option.images[0] ? shapeImage(option.images[0]) : null;
                const isCurrent = option.id === product.id;
                return (
                  <Link
                    key={option.id}
                    href={`/urun/${option.slug}`}
                    className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm transition ${
                      isCurrent
                        ? "border-stone-900 font-medium text-stone-900"
                        : "border-stone-200 text-stone-600 hover:border-stone-400"
                    }`}
                  >
                    {cover && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={cover.thumbnailUrl}
                        alt=""
                        className="h-5 w-5 rounded-full object-cover"
                      />
                    )}
                    {option.color ?? option.name}
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {product.variants.length > 0 && (
          <div className="mb-8">
            <h2 className="mb-3 text-sm font-semibold text-stone-900">Beden</h2>
            <div className="flex flex-wrap gap-2">
              {product.variants.map((variant) => {
                const inStock = variant.stockQuantity > 0;
                return (
                  <span
                    key={variant.id}
                    className={`rounded-lg border px-3 py-1.5 text-sm ${
                      inStock
                        ? "border-stone-900 font-semibold text-stone-900"
                        : "border-stone-200 text-stone-300 line-through"
                    }`}
                  >
                    {variant.size}
                  </span>
                );
              })}
            </div>
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
