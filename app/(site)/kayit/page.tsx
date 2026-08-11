import { redirect } from "next/navigation";
import { getCurrentCustomer } from "@/lib/customerAuth";
import SignupForm from "./SignupForm";

export default async function SignupPage() {
  const customer = await getCurrentCustomer();
  if (customer) redirect("/hesabim");

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <h1 className="mb-2 text-center text-2xl font-semibold text-stone-900">Kayıt Ol</h1>
      <p className="mb-8 text-center text-sm text-stone-500">
        Üye olmadan da alışveriş yapabilirsiniz — sepetten &quot;Sepete Git&quot; ile devam edin.
      </p>
      <SignupForm />
    </div>
  );
}
