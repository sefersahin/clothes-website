import { NextResponse } from "next/server";
import { z } from "zod";
import { Prisma } from "@/app/generated/prisma/client";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

const patchSchema = z.object({
  size: z.string().min(1).optional(),
  stockQuantity: z.number().int().min(0).optional(),
  sku: z.string().min(1).nullable().optional(),
});

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await request.json();
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const existing = await prisma.productVariant.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  try {
    const variant = await prisma.$transaction(async (tx) => {
      const updated = await tx.productVariant.update({ where: { id }, data: parsed.data });

      const siblings = await tx.productVariant.findMany({
        where: { productId: existing.productId },
      });
      const allSoldOut = siblings.every((v) => v.stockQuantity === 0);

      if (allSoldOut) {
        await tx.product.updateMany({
          where: { id: existing.productId, status: "active" },
          data: { status: "archived" },
        });
      }

      return updated;
    });

    return NextResponse.json(variant);
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
      return NextResponse.json(
        { error: "A variant with this size already exists for this product" },
        { status: 409 },
      );
    }
    throw err;
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const existing = await prisma.productVariant.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await prisma.productVariant.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
