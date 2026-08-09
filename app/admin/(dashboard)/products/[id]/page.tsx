import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { shapeImage } from "@/lib/productImage";
import ProductDetailsForm from "./ProductDetailsForm";
import VariantManager from "./VariantManager";
import ImageManager from "./ImageManager";
import DeleteProductButton from "./DeleteProductButton";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      variants: true,
      images: { orderBy: { sortOrder: "asc" } },
    },
  });

  if (!product) notFound();

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
        }}
      />

      <VariantManager productId={product.id} variants={product.variants} />

      <ImageManager productId={product.id} images={product.images.map(shapeImage)} />
    </div>
  );
}
