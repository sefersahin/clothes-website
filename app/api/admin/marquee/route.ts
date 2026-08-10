import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { getMarqueeSetting } from "@/lib/marquee";

const patchSchema = z.object({
  text: z.string().min(1),
});

export async function GET() {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const setting = await getMarqueeSetting();
  return NextResponse.json(setting);
}

export async function PATCH(request: Request) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const existing = await getMarqueeSetting();
  const updated = await prisma.marqueeSetting.update({
    where: { id: existing.id },
    data: { text: parsed.data.text },
  });

  return NextResponse.json(updated);
}
