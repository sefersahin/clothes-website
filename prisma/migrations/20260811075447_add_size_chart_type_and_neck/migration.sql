-- CreateEnum
CREATE TYPE "SizeChartType" AS ENUM ('dress', 'shirt', 'skirt', 'suit', 'pants');

-- AlterTable
ALTER TABLE "categories" ADD COLUMN     "sizeChartType" "SizeChartType" NOT NULL DEFAULT 'dress';

-- AlterTable
ALTER TABLE "size_chart_rows" ADD COLUMN     "neck" TEXT;
