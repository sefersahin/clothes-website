import Link from "next/link";

const navLinks = [
  { href: "/", label: "Anasayfa" },
  { href: "/hakkimizda", label: "Hakkımızda" },
  { href: "/sss", label: "SSS" },
  { href: "/iletisim", label: "İletişim" },
];

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-10 border-b border-stone-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <Link href="/" className="text-xl font-semibold tracking-tight text-stone-900">
          Hilay <span className="text-rose-600">Butik</span>
        </Link>
        <nav className="flex flex-wrap gap-6 text-sm font-medium text-stone-600">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="transition-colors hover:text-rose-600"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
