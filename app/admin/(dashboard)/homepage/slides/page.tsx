import { prisma } from "@/lib/db";
import HeroSlideManager from "./HeroSlideManager";

export default async function AdminHeroSlidesPage() {
  const [slides, categories] = await Promise.all([
    prisma.heroSlide.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <div>
      <h1 className="mb-6 text-xl font-semibold">Görseller</h1>
      <HeroSlideManager slides={slides} categories={categories} />
    </div>
  );
}
