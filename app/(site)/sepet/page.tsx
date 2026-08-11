import { getCurrentCustomer } from "@/lib/customerAuth";
import CartPageClient from "./CartPageClient";

export default async function CartPage() {
  const customer = await getCurrentCustomer();

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <h1 className="mb-8 text-2xl font-semibold text-stone-900">Sepetim</h1>
      <CartPageClient
        customer={
          customer ? { name: customer.name, email: customer.email, phone: customer.phone } : null
        }
      />
    </div>
  );
}
