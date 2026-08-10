import Link from "next/link";
import { shapeImage } from "@/lib/productImage";
import PriceDisplay from "@/components/PriceDisplay";

export type ProductCardData = {
  id: string;
  slug: string;
  name: string;
  basePrice: unknown;
  salePrice: unknown;
  images: { id: string; imageUrl: string; sortOrder: number }[];
};

export default function ProductCard({ product }: { product: ProductCardData }) {
  const cover = product.images[0] ? shapeImage(product.images[0]) : null;

  return (
    <Link href={`/urun/${product.slug}`} className="group block">
      <div className="mb-3 aspect-[3/4] overflow-hidden rounded-xl bg-stone-100">
        {cover ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={cover.thumbnailUrl}
            alt={product.name}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xs text-stone-400">
            Görsel yok
          </div>
        )}
      </div>
      <div className="text-sm font-medium text-stone-900 group-hover:text-rose-600">
        {product.name}
      </div>
      <PriceDisplay
        basePrice={String(product.basePrice)}
        salePrice={product.salePrice === null ? null : String(product.salePrice)}
      />
    </Link>
  );
}
