import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { shapeImage } from "@/lib/productImage";
import { DEFAULT_SIZE_CHART_TYPE, SIZE_CHART_FIELDS } from "@/lib/sizeChart";
import PriceDisplay from "@/components/PriceDisplay";
import ProductGallery from "@/app/(site)/ProductGallery";
import AddToCartButton from "./AddToCartButton";

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
      category: true,
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
  const sizeChartFields = SIZE_CHART_FIELDS[product.category?.sizeChartType ?? DEFAULT_SIZE_CHART_TYPE];

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

        <AddToCartButton
          productId={product.id}
          slug={product.slug}
          name={product.name}
          color={product.color}
          image={images[0]?.thumbnailUrl ?? null}
          basePrice={Number(product.basePrice)}
          salePrice={product.salePrice ? Number(product.salePrice) : null}
          variants={product.variants.map((v) => ({
            id: v.id,
            size: v.size,
            stockQuantity: v.stockQuantity,
          }))}
          disabled={isSoldOut}
        />

        {product.sizeChartRows.length > 0 && (
          <div>
            <h2 className="mb-3 text-sm font-semibold text-stone-900">Beden Tablosu</h2>
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-stone-200 text-stone-500">
                  <th className="py-2 pr-4 font-medium">Beden</th>
                  {sizeChartFields.map((field) => (
                    <th key={field.key} className="py-2 pr-4 font-medium">
                      {field.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {product.sizeChartRows.map((row) => (
                  <tr key={row.id} className="border-b border-stone-100">
                    <td className="py-2 pr-4">{row.size}</td>
                    {sizeChartFields.map((field) => (
                      <td key={field.key} className="py-2 pr-4">
                        {row[field.key] ?? "—"}
                      </td>
                    ))}
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
