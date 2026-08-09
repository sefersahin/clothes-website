"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DeleteProductButton({ productId }: { productId: string }) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);

  async function handleDelete() {
    setBusy(true);
    await fetch(`/api/admin/products/${productId}`, { method: "DELETE" });
    router.push("/admin/products");
    router.refresh();
  }

  if (!confirming) {
    return (
      <button
        type="button"
        onClick={() => setConfirming(true)}
        className="text-sm text-rose-600 hover:underline"
      >
        Ürünü Sil
      </button>
    );
  }

  return (
    <span className="text-sm">
      Emin misiniz?{" "}
      <button
        type="button"
        disabled={busy}
        onClick={handleDelete}
        className="font-medium text-rose-600 hover:underline disabled:opacity-50"
      >
        Evet, sil
      </button>{" "}
      <button type="button" onClick={() => setConfirming(false)} className="hover:underline">
        Vazgeç
      </button>
    </span>
  );
}
