export default function AboutPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-4 text-3xl font-semibold tracking-tight text-stone-900">Hakkımızda</h1>
      <p className="text-sm leading-relaxed text-stone-600">
        Hilay Butik, İnstagram üzerinden başlayan yolculuğunu artık bu web sitesi üzerinden
        sürdürüyor. Kaliteli ürünleri uygun fiyatlarla sunmaya devam ediyoruz. Sorularınız için
        iletişim sayfamızdan bize ulaşabilirsiniz.
      </p>
      <a
        href="https://instagram.com/hilaybutikk"
        target="_blank"
        rel="noopener noreferrer"
        className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-rose-600 hover:text-rose-700"
      >
        @hilaybutikk üzerinden Instagram&apos;da takip edin →
      </a>
    </div>
  );
}
