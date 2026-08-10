"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { desktopUrl, mobileUrl } from "@/lib/heroImage";

type Slide = {
  id: string;
  imageUrl: string;
  category: { slug: string } | null;
};

const DRAG_CLICK_THRESHOLD = 8;

export default function HeroCarousel({ slides }: { slides: Slide[] }) {
  const router = useRouter();
  const trackRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [dragging, setDragging] = useState(false);
  const startX = useRef(0);
  const dragDistance = useRef(0);

  const count = slides.length;

  function goTo(next: number) {
    setIndex(((next % count) + count) % count);
  }

  function handlePointerDown(e: React.PointerEvent) {
    setDragging(true);
    startX.current = e.clientX;
    dragDistance.current = 0;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  }

  function handlePointerMove(e: React.PointerEvent) {
    if (!dragging) return;
    const delta = e.clientX - startX.current;
    dragDistance.current = Math.abs(delta);
    setDragOffset(delta);
  }

  function endDrag() {
    if (!dragging) return;
    setDragging(false);
    const width = trackRef.current?.clientWidth || 1;
    const threshold = width * 0.2;
    if (dragOffset < -threshold) goTo(index + 1);
    else if (dragOffset > threshold) goTo(index - 1);
    setDragOffset(0);
  }

  function handleSlideClick(slide: Slide) {
    if (dragDistance.current > DRAG_CLICK_THRESHOLD) return;
    if (slide.category) router.push(`/kategori/${slide.category.slug}`);
  }

  if (count === 0) return null;

  return (
    <div className="relative mb-12 overflow-hidden rounded-2xl">
      <div
        ref={trackRef}
        className="flex touch-pan-y"
        style={{
          transform: dragging
            ? `translateX(calc(-${index * 100}% + ${dragOffset}px))`
            : `translateX(-${index * 100}%)`,
          transition: dragging ? "none" : "transform 500ms ease",
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={endDrag}
        onPointerLeave={endDrag}
      >
        {slides.map((slide) => (
          <div
            key={slide.id}
            onClick={() => handleSlideClick(slide)}
            className={`aspect-[4/5] w-full shrink-0 select-none md:aspect-[16/9] ${
              slide.category ? "cursor-pointer" : ""
            }`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={desktopUrl(slide.imageUrl)}
              alt=""
              draggable={false}
              className="hidden h-full w-full object-cover md:block"
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={mobileUrl(slide.imageUrl)}
              alt=""
              draggable={false}
              className="block h-full w-full object-cover md:hidden"
            />
          </div>
        ))}
      </div>

      {count > 1 && (
        <>
          <button
            type="button"
            onClick={() => goTo(index - 1)}
            aria-label="Önceki"
            className="absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-stone-900 shadow hover:bg-white"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={() => goTo(index + 1)}
            aria-label="Sonraki"
            className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-stone-900 shadow hover:bg-white"
          >
            ›
          </button>
          <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
            {slides.map((slide, i) => (
              <button
                key={slide.id}
                type="button"
                aria-label={`${i + 1}. görsele git`}
                onClick={() => goTo(i)}
                className={`h-1.5 w-1.5 rounded-full transition-colors ${
                  i === index ? "bg-white" : "bg-white/50"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
