import { prisma } from "@/lib/db";
import NewProductForm from "./NewProductForm";

export default async function NewProductPage() {
  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });

  return (
    <div className="max-w-lg">
      <h1 className="mb-6 text-xl font-semibold">Yeni Ürün</h1>
      <NewProductForm categories={categories} />
    </div>
  );
}
