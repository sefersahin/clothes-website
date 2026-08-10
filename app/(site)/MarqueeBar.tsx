export default function MarqueeBar({ text }: { text: string }) {
  return (
    <div className="overflow-hidden border-b border-stone-200 bg-stone-900 py-2">
      <div className="flex w-max animate-marquee whitespace-nowrap">
        {[0, 1].map((i) => (
          <span key={i} className="flex shrink-0 items-center px-4 text-sm font-medium text-white">
            {text}
            <span className="mx-6 text-stone-500">•</span>
            {text}
            <span className="mx-6 text-stone-500">•</span>
            {text}
            <span className="mx-6 text-stone-500">•</span>
          </span>
        ))}
      </div>
    </div>
  );
}
