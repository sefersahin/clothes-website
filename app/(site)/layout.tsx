import SiteHeader from "./SiteHeader";
import MarqueeBar from "./MarqueeBar";
import SiteFooter from "./SiteFooter";
import { getMarqueeSetting } from "@/lib/marquee";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const marquee = await getMarqueeSetting();

  return (
    <div className="flex min-h-screen flex-col bg-white text-stone-900">
      <SiteHeader />
      <MarqueeBar text={marquee.text} />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6">{children}</main>
      <SiteFooter />
    </div>
  );
}
