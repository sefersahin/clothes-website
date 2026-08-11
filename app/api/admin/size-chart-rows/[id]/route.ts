import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

const patchSchema = z.object({
  size: z.string().min(1).optional(),
  neck: z.string().min(1).nullable().optional(),
  chest: z.string().min(1).nullable().optional(),
  waist: z.string().min(1).nullable().optional(),
  hip: z.string().min(1).nullable().optional(),
  length: z.string().min(1).nullable().optional(),
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

  const existing = await prisma.sizeChartRow.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const row = await prisma.sizeChartRow.update({ where: { id }, data: parsed.data });
  return NextResponse.json(row);
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const existing = await prisma.sizeChartRow.findUnique({ where: { id } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await prisma.sizeChartRow.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
