import { faqs } from "@/lib/faq";

export default function FaqPage() {
  return (
    <div className="max-w-2xl">
      <h1 className="mb-6 text-2xl font-semibold">Sıkça Sorulan Sorular</h1>
      <div className="space-y-6">
        {faqs.map((faq) => (
          <div key={faq.question}>
            <h2 className="mb-1 text-sm font-semibold">{faq.question}</h2>
            <p className="text-sm text-gray-700">{faq.answer}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
