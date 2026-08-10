import { NextResponse } from "next/server";
import { z } from "zod";
import { Prisma } from "@/app/generated/prisma/client";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

const createSchema = z.object({
  productId: z.string().min(1),
});

export async function GET() {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const featured = await prisma.featuredProduct.findMany({
    include: { product: { include: { images: { orderBy: { sortOrder: "asc" }, take: 1 } } } },
    orderBy: { sortOrder: "asc" },
  });
  return NextResponse.json(featured);
}

export async function POST(request: Request) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const product = await prisma.product.findUnique({ where: { id: parsed.data.productId } });
  if (!product) return NextResponse.json({ error: "Product not found" }, { status: 404 });

  const maxSortOrder = await prisma.featuredProduct.aggregate({ _max: { sortOrder: true } });
  const nextSortOrder = (maxSortOrder._max.sortOrder ?? -1) + 1;

  try {
    const featured = await prisma.featuredProduct.create({
      data: { productId: parsed.data.productId, sortOrder: nextSortOrder },
      include: { product: true },
    });
    return NextResponse.json(featured, { status: 201 });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
      return NextResponse.json({ error: "Product is already featured" }, { status: 409 });
    }
    throw err;
  }
}
