import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { shapeImage } from "@/lib/productImage";
import ProductDetailsForm from "./ProductDetailsForm";
import VariantManager from "./VariantManager";
import SizeChartManager from "./SizeChartManager";
import ColorVariantManager from "./ColorVariantManager";
import ImageManager from "./ImageManager";
import DeleteProductButton from "./DeleteProductButton";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [product, categories] = await Promise.all([
    prisma.product.findUnique({
      where: { id },
      include: {
        variants: true,
        images: { orderBy: { sortOrder: "asc" } },
        sizeChartRows: { orderBy: { sortOrder: "asc" } },
        group: { include: { products: true } },
      },
    }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);

  if (!product) notFound();

  const siblings = (product.group?.products ?? []).filter((p) => p.id !== product.id);

  return (
    <div className="max-w-3xl space-y-10">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">{product.name}</h1>
        <DeleteProductButton productId={product.id} />
      </div>

      <ProductDetailsForm
        product={{
          id: product.id,
          name: product.name,
          description: product.description,
          basePrice: product.basePrice.toString(),
          salePrice: product.salePrice ? product.salePrice.toString() : null,
          status: product.status,
          categoryId: product.categoryId,
          color: product.color,
        }}
        categories={categories}
      />

      <VariantManager productId={product.id} variants={product.variants} />

      <ColorVariantManager productId={product.id} siblings={siblings} />

      <SizeChartManager productId={product.id} rows={product.sizeChartRows} />

      <ImageManager productId={product.id} images={product.images.map(shapeImage)} />
    </div>
  );
}
