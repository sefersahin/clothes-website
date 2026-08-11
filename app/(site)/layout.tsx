import SiteHeader from "./SiteHeader";
import MarqueeBar from "./MarqueeBar";
import SiteFooter from "./SiteFooter";
import PageTransitionOverlay from "./PageTransitionOverlay";
import { CartProvider } from "./CartContext";
import CartPanel from "./CartPanel";
import { getMarqueeSetting } from "@/lib/marquee";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const marquee = await getMarqueeSetting();

  return (
    <CartProvider>
      <div className="flex min-h-screen flex-col bg-white text-stone-900">
        <PageTransitionOverlay />
        <SiteHeader />
        <MarqueeBar text={marquee.text} />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </div>
      <CartPanel />
    </CartProvider>
  );
}
