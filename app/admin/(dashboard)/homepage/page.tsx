import Link from "next/link";

const sections = [
  {
    href: "/admin/homepage/stripe",
    title: "Kayan Şerit",
    description: "Navbar altındaki kayan yazıyı düzenle.",
  },
  {
    href: "/admin/homepage/slides",
    title: "Görseller",
    description: "Anasayfadaki büyük kayan görselleri ekle, sil, düzenle.",
  },
  {
    href: "/admin/homepage/featured-products",
    title: "Öne Çıkan Ürünler",
    description: "Anasayfada öne çıkarılacak örnek ürünleri seç.",
  },
];

export default function AdminHomepagePage() {
  return (
    <div>
      <h1 className="mb-6 text-xl font-semibold">Vitrin</h1>
      <div className="grid gap-4 sm:grid-cols-3">
        {sections.map((section) => (
          <Link
            key={section.href}
            href={section.href}
            className="rounded border border-gray-200 p-4 hover:border-gray-400 hover:bg-gray-50"
          >
            <div className="mb-1 font-medium">{section.title}</div>
            <div className="text-sm text-gray-500">{section.description}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
