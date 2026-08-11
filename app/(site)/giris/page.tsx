import { redirect } from "next/navigation";
import { getCurrentCustomer } from "@/lib/customerAuth";
import LoginForm from "./LoginForm";

export default async function LoginPage() {
  const customer = await getCurrentCustomer();
  if (customer) redirect("/hesabim");

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <h1 className="mb-8 text-center text-2xl font-semibold text-stone-900">Giriş Yap</h1>
      <LoginForm />
    </div>
  );
}
