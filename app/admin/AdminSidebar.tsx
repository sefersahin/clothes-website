import Link from "next/link";
import LogoutButton from "./LogoutButton";

const links = [
  { href: "/admin", label: "Ana Sayfa" },
  { href: "/admin/products", label: "Ürünler" },
  { href: "/admin/categories", label: "Kategoriler" },
  { href: "/admin/homepage", label: "Vitrin" },
  { href: "/admin/orders", label: "Siparişler" },
];

export default function AdminSidebar() {
  return (
    <aside className="flex w-full shrink-0 flex-col gap-4 border-b border-gray-200 p-4 md:w-56 md:border-b-0 md:border-r md:p-6">
      <div className="text-lg font-semibold">Yönetim Paneli</div>
      <nav className="flex flex-row gap-2 md:flex-col">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="rounded px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            {link.label}
          </Link>
        ))}
      </nav>
      <div className="mt-auto">
        <LogoutButton />
      </div>
    </aside>
  );
}
