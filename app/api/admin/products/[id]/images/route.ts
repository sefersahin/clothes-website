import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { shapeImage } from "@/lib/productImage";
import { MAX_IMAGE_BYTES, isAllowedImage, uploadImageToCloudinary } from "@/lib/imageUpload";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 });

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "Invalid multipart form data" }, { status: 400 });
  }
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Missing file" }, { status: 400 });
  }
  if (file.size > MAX_IMAGE_BYTES) {
    return NextResponse.json({ error: "File too large (max 15MB)" }, { status: 400 });
  }
  if (!isAllowedImage(file)) {
    return NextResponse.json({ error: "Unsupported file type" }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const uploadResult = await uploadImageToCloudinary(buffer, "products");

  const maxSortOrder = await prisma.productImage.aggregate({
    where: { productId: id },
    _max: { sortOrder: true },
  });
  const nextSortOrder = (maxSortOrder._max.sortOrder ?? -1) + 1;

  const image = await prisma.productImage.create({
    data: {
      productId: id,
      imageUrl: uploadResult.secure_url,
      publicId: uploadResult.public_id,
      sortOrder: nextSortOrder,
    },
  });

  return NextResponse.json(shapeImage(image), { status: 201 });
}
