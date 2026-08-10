import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

const createSchema = z.object({
  size: z.string().min(1),
  chest: z.string().min(1).optional(),
  waist: z.string().min(1).optional(),
  hip: z.string().min(1).optional(),
  length: z.string().min(1).optional(),
});

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const body = await request.json();
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const maxSortOrder = await prisma.sizeChartRow.aggregate({
    where: { productId: id },
    _max: { sortOrder: true },
  });
  const nextSortOrder = (maxSortOrder._max.sortOrder ?? -1) + 1;

  const row = await prisma.sizeChartRow.create({
    data: { productId: id, ...parsed.data, sortOrder: nextSortOrder },
  });

  return NextResponse.json(row, { status: 201 });
}
