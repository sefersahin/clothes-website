import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import ProductGrid from "@/components/ProductGrid";

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const category = await prisma.category.findUnique({ where: { slug } });
  if (!category) notFound();

  const products = await prisma.product.findMany({
    where: { status: "active", categoryId: category.id },
    include: { images: { orderBy: { sortOrder: "asc" }, take: 1 } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="mb-8 text-2xl font-semibold tracking-tight text-stone-900">
        {category.name}
      </h1>
      <ProductGrid products={products} />
    </div>
  );
}
