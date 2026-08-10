import Image from "next/image";
import { prisma } from "@/lib/db";
import ProductGrid from "@/components/ProductGrid";
import HeroCarousel from "./HeroCarousel";
import FeaturedCarousel from "./FeaturedCarousel";
import mainPageLogo from "@/public/mainpagelogo.png";

export default async function HomePage() {
  const [products, heroSlides, featured] = await Promise.all([
    prisma.product.findMany({
      where: { status: "active" },
      include: { images: { orderBy: { sortOrder: "asc" }, take: 1 } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.heroSlide.findMany({
      include: { category: true },
      orderBy: { sortOrder: "asc" },
    }),
    prisma.featuredProduct.findMany({
      include: { product: { include: { images: { orderBy: { sortOrder: "asc" }, take: 1 } } } },
      orderBy: { sortOrder: "asc" },
    }),
  ]);

  const featuredProducts = featured.map((f) => ({
    ...f.product,
    basePrice: f.product.basePrice.toString(),
    salePrice: f.product.salePrice ? f.product.salePrice.toString() : null,
  }));

  return (
    <div>
      <section className="mb-12 flex flex-col items-center rounded-2xl bg-stone-50 px-6 py-12 text-center sm:py-16">
        <div className="mb-4 h-40 w-40 overflow-hidden rounded-full sm:h-48 sm:w-48">
          <Image
            src={mainPageLogo}
            alt="Hilay Butik"
            className="h-full w-full object-cover"
            priority
          />
        </div>
        <p className="mx-auto max-w-md text-sm text-stone-500 sm:text-base">
          Seçkin parçalar, uygun fiyatlar. Yeni sezon ürünlerimizi keşfedin.
        </p>
      </section>

      <HeroCarousel slides={heroSlides} />

      {featuredProducts.length > 0 && (
        <div className="mb-12">
          <h2 className="mb-4 text-lg font-semibold text-stone-900">Öne Çıkanlar</h2>
          <FeaturedCarousel products={featuredProducts} />
        </div>
      )}

      <ProductGrid products={products} />
    </div>
  );
}
