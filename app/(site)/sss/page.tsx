import { faqs } from "@/lib/faq";

export default function FaqPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-8 text-3xl font-semibold tracking-tight text-stone-900">
        Sıkça Sorulan Sorular
      </h1>
      <div className="divide-y divide-stone-200">
        {faqs.map((faq) => (
          <div key={faq.question} className="py-5">
            <h2 className="mb-1 text-sm font-semibold text-stone-900">{faq.question}</h2>
            <p className="text-sm leading-relaxed text-stone-600">{faq.answer}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
