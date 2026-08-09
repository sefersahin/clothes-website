export default function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-gray-200 py-6">
      <div className="mx-auto max-w-5xl px-4 text-sm text-gray-500">
        © {new Date().getFullYear()} Mağaza. Tüm hakları saklıdır.
      </div>
    </footer>
  );
}
