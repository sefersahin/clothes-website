import { redirect } from "next/navigation";
import { getCurrentCustomer } from "@/lib/customerAuth";

export default async function AccountPage() {
  const customer = await getCurrentCustomer();
  if (!customer) redirect("/giris");

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
      <h1 className="mb-8 text-2xl font-semibold text-stone-900">Hesabım</h1>
      <dl className="space-y-4 rounded-2xl border border-stone-200 p-6">
        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-stone-400">Ad Soyad</dt>
          <dd className="text-sm text-stone-900">{customer.name}</dd>
        </div>
        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-stone-400">E-posta</dt>
          <dd className="text-sm text-stone-900">{customer.email}</dd>
        </div>
        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-stone-400">Telefon</dt>
          <dd className="text-sm text-stone-900">{customer.phone ?? "—"}</dd>
        </div>
      </dl>
    </div>
  );
}
