"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useLayoutEffect, useState } from "react";
import mainPageLogo from "@/public/mainpagelogo.png";

const DURATION_MS = 1500;

export default function PageTransitionOverlay() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [instant, setInstant] = useState(true);

  // Snap the door shut (no transition) the instant the route changes. Must run
  // synchronously before paint, so this can't be a lazy state initializer.
  useLayoutEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setInstant(true);
    setOpen(false);
  }, [pathname]);

  // Then, once that's painted, slide it open smoothly.
  useEffect(() => {
    const id = setTimeout(() => {
      setInstant(false);
      setOpen(true);
    }, 20);
    return () => clearTimeout(id);
  }, [pathname]);

  return (
    <div
      aria-hidden
      className="fixed inset-0 z-[999] flex items-center justify-center bg-stone-200/90"
      style={{
        transform: open ? "translateY(-100%)" : "translateY(0)",
        transitionProperty: "transform",
        transitionDuration: instant ? "0ms" : `${DURATION_MS}ms`,
        transitionTimingFunction: "cubic-bezier(0.65, 0, 0.35, 1)",
      }}
    >
      <Image
        src={mainPageLogo}
        alt=""
        priority
        className="h-40 w-40 object-contain drop-shadow-lg sm:h-48 sm:w-48 md:h-56 md:w-56"
      />
    </div>
  );
}
