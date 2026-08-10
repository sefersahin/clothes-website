import { prisma } from "@/lib/db";
import CategoryManager from "./CategoryManager";

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });

  return (
    <div>
      <h1 className="mb-6 text-xl font-semibold">Kategoriler</h1>
      <CategoryManager categories={categories} />
    </div>
  );
}
