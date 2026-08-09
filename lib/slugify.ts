import { randomBytes } from "crypto";
import { prisma } from "@/lib/db";

const TURKISH_MAP: Record<string, string> = {
  ç: "c", Ç: "c",
  ğ: "g", Ğ: "g",
  ı: "i", I: "i", İ: "i",
  ö: "o", Ö: "o",
  ş: "s", Ş: "s",
  ü: "u", Ü: "u",
};

function baseSlug(name: string): string {
  const transliterated = name
    .split("")
    .map((ch) => TURKISH_MAP[ch] ?? ch)
    .join("");

  return transliterated
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function generateUniqueSlug(name: string): Promise<string> {
  const slug = baseSlug(name) || "urun";
  const existing = await prisma.product.findUnique({ where: { slug } });
  if (!existing) return slug;

  const suffix = randomBytes(3).toString("hex");
  return `${slug}-${suffix}`;
}
