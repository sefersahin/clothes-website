import { NextResponse } from "next/server";
import { z } from "zod";
import { Prisma } from "@/app/generated/prisma/client";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

const patchSchema = z
  .object({
    name: z.string().min(1).optional(),
    description: z.string().min(1).optional(),
    basePrice: z.number().positive().optional(),
    status: z.enum(["draft", "active", "archived"]).optional(),
    salePercent: z.number().min(0).max(100).optional(),
    salePrice: z.number().positive().nullable().optional(),
  })
  .refine((data) => !(data.salePercent !== undefined && data.salePrice !== undefined), {
    message: "Provide either salePercent or salePrice, not both",
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

  const existing = await prisma.product.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const { name, description, basePrice, status, salePercent, salePrice } = parsed.data;

  const data: Prisma.ProductUpdateInput = { name, description, basePrice, status };

  const effectiveBasePrice = basePrice ?? Number(existing.basePrice);

  if (salePercent !== undefined) {
    data.salePrice = Math.round(effectiveBasePrice * (1 - salePercent / 100) * 100) / 100;
  } else if (salePrice !== undefined) {
    if (salePrice !== null && salePrice >= effectiveBasePrice) {
      return NextResponse.json(
        { error: "salePrice must be less than basePrice" },
        { status: 400 },
      );
    }
    data.salePrice = salePrice;
  }

  const product = await prisma.product.update({ where: { id }, data });
  return NextResponse.json(product);
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const existing = await prisma.product.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await prisma.product.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
