import { getMarqueeSetting } from "@/lib/marquee";
import StripeForm from "./StripeForm";

export default async function AdminStripePage() {
  const marquee = await getMarqueeSetting();

  return (
    <div>
      <h1 className="mb-6 text-xl font-semibold">Kayan Şerit</h1>
      <StripeForm initialText={marquee.text} />
    </div>
  );
}
