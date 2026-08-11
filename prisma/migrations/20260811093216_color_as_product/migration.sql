-- CreateTable
CREATE TABLE "product_groups" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "product_groups_pkey" PRIMARY KEY ("id")
);

-- AlterTable: add the new product-level color/group columns first
ALTER TABLE "products" ADD COLUMN     "color" TEXT,
ADD COLUMN     "groupId" TEXT;

-- Data migration: move each product's color up from its (previously
-- per-variant) color before the column is dropped, so existing data
-- (e.g. "Kırmızı Elbise") isn't silently lost.
UPDATE "products" p
SET "color" = sub.color
FROM (
  SELECT DISTINCT ON ("productId") "productId", color
  FROM "product_variants"
  ORDER BY "productId", color
) sub
WHERE p.id = sub."productId";

-- DropIndex
DROP INDEX "product_variants_productId_size_color_key";

-- AlterTable
ALTER TABLE "product_variants" DROP COLUMN "color";

-- CreateIndex
CREATE UNIQUE INDEX "product_variants_productId_size_key" ON "product_variants"("productId", "size");

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "product_groups"("id") ON DELETE SET NULL ON UPDATE CASCADE;
