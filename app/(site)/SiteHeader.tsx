import Image from "next/image";
import Link from "next/link";
import logo from "@/public/logo.png";
import { prisma } from "@/lib/db";

const rightNavLinks = [
  { href: "/hakkimizda", label: "Hakkımızda" },
  { href: "/sss", label: "SSS" },
  { href: "/iletisim", label: "İletişim" },
];

export default async function SiteHeader() {
  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });

  return (
    <header className="sticky top-0 z-10 border-b border-stone-200 bg-white/90 backdrop-blur">
      <div className="mx-auto grid max-w-6xl grid-cols-[auto_1fr_auto] items-center gap-4 px-4 py-3 sm:px-6">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center">
            <Image src={logo} alt="Hilay Butik" width={48} height={48} className="rounded-full" priority />
          </Link>
          <Link href="/" className="text-sm font-medium text-stone-600 transition-colors hover:text-rose-600">
            Anasayfa
          </Link>
        </div>

        <nav className="flex flex-wrap items-center justify-center gap-6 text-sm font-medium text-stone-600">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/kategori/${category.slug}`}
              className="transition-colors hover:text-rose-600"
            >
              {category.name}
            </Link>
          ))}
        </nav>

        <nav className="flex flex-wrap items-center justify-end gap-6 text-sm font-medium text-stone-600">
          {rightNavLinks.map((link) => (
            <Link key={link.href} href={link.href} className="transition-colors hover:text-rose-600">
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
