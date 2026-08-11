import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { generateUniqueSlug } from "@/lib/slugify";

const createSchema = z.object({
  color: z.string().min(1),
});

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const source = await prisma.product.findUnique({ where: { id } });
  if (!source) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const body = await request.json();
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { color } = parsed.data;
  const slug = await generateUniqueSlug(source.name, color);

  const newProduct = await prisma.$transaction(async (tx) => {
    let groupId = source.groupId;
    if (!groupId) {
      const group = await tx.productGroup.create({ data: {} });
      groupId = group.id;
      await tx.product.update({ where: { id: source.id }, data: { groupId } });
    }

    return tx.product.create({
      data: {
        name: source.name,
        description: source.description,
        basePrice: source.basePrice,
        categoryId: source.categoryId,
        groupId,
        color,
        slug,
      },
    });
  });

  return NextResponse.json(newProduct, { status: 201 });
}
