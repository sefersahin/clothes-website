import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { generateUniqueCategorySlug } from "@/lib/slugify";
import { DEFAULT_SIZE_CHART_TYPE, SIZE_CHART_TYPES, type SizeChartType } from "@/lib/sizeChart";

const sizeChartTypeValues = SIZE_CHART_TYPES.map((t) => t.value) as [SizeChartType, ...SizeChartType[]];

const createSchema = z.object({
  name: z.string().min(1),
  sizeChartType: z.enum(sizeChartTypeValues).optional(),
  isAllProducts: z.boolean().optional(),
});

export async function GET() {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });
  return NextResponse.json(categories);
}

export async function POST(request: Request) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { name, sizeChartType, isAllProducts } = parsed.data;
  const slug = await generateUniqueCategorySlug(name);

  const category = await prisma.category.create({
    data: {
      name,
      slug,
      sizeChartType: sizeChartType ?? DEFAULT_SIZE_CHART_TYPE,
      isAllProducts: isAllProducts ?? false,
    },
  });
  return NextResponse.json(category, { status: 201 });
}
