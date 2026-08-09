import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { shapeImage } from "@/lib/productImage";

export async function GET() {
  const products = await prisma.product.findMany({
    where: { status: "active" },
    include: { variants: true, images: { orderBy: { sortOrder: "asc" } } },
    orderBy: { createdAt: "desc" },
  });

  const shaped = products.map((product) => ({
    ...product,
    images: product.images.map(shapeImage),
  }));

  return NextResponse.json(shaped);
}
