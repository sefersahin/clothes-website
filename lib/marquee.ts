import { prisma } from "@/lib/db";

const DEFAULT_MARQUEE_TEXT =
  "Tüm siparişlerde hızlı kargo · Yeni sezon ürünleri stokta · Bizi Instagram'da takip edin @hilaybutikk";

export async function getMarqueeSetting() {
  const existing = await prisma.marqueeSetting.findFirst();
  if (existing) return existing;
  return prisma.marqueeSetting.create({ data: { text: DEFAULT_MARQUEE_TEXT } });
}
