import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { generateUniqueSlug } from "@/lib/slugify";
import { shapeImage } from "@/lib/productImage";

const createSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  basePrice: z.number().positive(),
  categoryId: z.string().min(1).nullable().optional(),
  color: z.string().min(1).nullable().optional(),
});

export async function GET() {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const products = await prisma.product.findMany({
    include: {
      variants: true,
      images: { orderBy: { sortOrder: "asc" } },
      category: true,
    },
    orderBy: { createdAt: "desc" },
  });

  const shaped = products.map((product) => ({
    ...product,
    images: product.images.map(shapeImage),
  }));

  return NextResponse.json(shaped);
}

export async function POST(request: Request) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { name, description, basePrice, categoryId, color } = parsed.data;
  const slug = await generateUniqueSlug(name, color);

  const product = await prisma.product.create({
    data: { name, description, basePrice, slug, categoryId, color },
  });

  return NextResponse.json(product, { status: 201 });
}
