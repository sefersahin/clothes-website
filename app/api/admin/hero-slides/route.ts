import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { MAX_IMAGE_BYTES, isAllowedImage, uploadImageToCloudinary } from "@/lib/imageUpload";

export async function GET() {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const slides = await prisma.heroSlide.findMany({
    include: { category: true },
    orderBy: { sortOrder: "asc" },
  });
  return NextResponse.json(slides);
}

export async function POST(request: Request) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "Invalid multipart form data" }, { status: 400 });
  }

  const file = formData.get("file");
  const categoryId = formData.get("categoryId");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Missing file" }, { status: 400 });
  }
  if (file.size > MAX_IMAGE_BYTES) {
    return NextResponse.json({ error: "File too large (max 15MB)" }, { status: 400 });
  }
  if (!isAllowedImage(file)) {
    return NextResponse.json({ error: "Unsupported file type" }, { status: 400 });
  }

  let resolvedCategoryId: string | null = null;
  if (typeof categoryId === "string" && categoryId.length > 0) {
    const category = await prisma.category.findUnique({ where: { id: categoryId } });
    if (!category) return NextResponse.json({ error: "Category not found" }, { status: 400 });
    resolvedCategoryId = category.id;
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const uploadResult = await uploadImageToCloudinary(buffer, "hero-slides");

  const maxSortOrder = await prisma.heroSlide.aggregate({ _max: { sortOrder: true } });
  const nextSortOrder = (maxSortOrder._max.sortOrder ?? -1) + 1;

  const slide = await prisma.heroSlide.create({
    data: {
      imageUrl: uploadResult.secure_url,
      publicId: uploadResult.public_id,
      categoryId: resolvedCategoryId,
      sortOrder: nextSortOrder,
    },
    include: { category: true },
  });

  return NextResponse.json(slide, { status: 201 });
}
