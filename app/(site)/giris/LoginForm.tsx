"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    setBusy(false);
    if (!res.ok) {
      const data = await res.json().catch(() => null);
      setError(data?.error ?? "Giriş yapılamadı.");
      return;
    }
    router.push("/");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-sm space-y-4">
      <div>
        <label className="mb-1 block text-sm text-stone-700">E-posta</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm text-stone-700">Şifre</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm"
        />
      </div>

      {error && <p className="text-sm text-rose-600">{error}</p>}

      <button
        type="submit"
        disabled={busy}
        className="w-full rounded-full bg-stone-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-stone-800 disabled:opacity-50"
      >
        {busy ? "Giriş yapılıyor…" : "Giriş Yap"}
      </button>

      <p className="text-center text-sm text-stone-500">
        Hesabınız yok mu?{" "}
        <Link href="/kayit" className="font-medium text-rose-600 hover:underline">
          Kayıt olun
        </Link>
      </p>
    </form>
  );
}
