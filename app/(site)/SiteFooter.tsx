import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-stone-200 bg-stone-50">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-3">
        <div>
          <div className="mb-2 text-lg font-semibold text-stone-900">
            Hilay <span className="text-rose-600">Butik</span>
          </div>
          <p className="text-sm text-stone-500">
            Seçkin parçalar, uygun fiyatlar. İnstagram&apos;dan tanıdığınız mağazamız artık burada.
          </p>
        </div>

        <div>
          <div className="mb-2 text-sm font-semibold text-stone-900">Sayfalar</div>
          <ul className="space-y-1 text-sm text-stone-500">
            <li>
              <Link href="/hakkimizda" className="hover:text-rose-600">
                Hakkımızda
              </Link>
            </li>
            <li>
              <Link href="/sss" className="hover:text-rose-600">
                Sıkça Sorulan Sorular
              </Link>
            </li>
            <li>
              <Link href="/iletisim" className="hover:text-rose-600">
                İletişim
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <div className="mb-2 text-sm font-semibold text-stone-900">Ödeme &amp; Kargo</div>
          <p className="text-sm text-stone-500">
            Kredi kartı ve banka havalesi/EFT ile ödeme, Hızlı kargo.
          </p>
        </div>
      </div>

      <div className="border-t border-stone-200 px-4 py-4 text-center text-xs text-stone-400">
        © {new Date().getFullYear()} Hilay Butik. Tüm hakları saklıdır.
      </div>
    </footer>
  );
}
