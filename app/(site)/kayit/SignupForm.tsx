"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignupForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Şifreler eşleşmiyor.");
      return;
    }
    if (password.length < 8) {
      setError("Şifre en az 8 karakter olmalıdır.");
      return;
    }

    setBusy(true);
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, phone: phone || undefined }),
    });

    setBusy(false);
    if (!res.ok) {
      const data = await res.json().catch(() => null);
      setError(typeof data?.error === "string" ? data.error : "Kayıt oluşturulamadı.");
      return;
    }
    router.push("/");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-sm space-y-4">
      <div>
        <label className="mb-1 block text-sm text-stone-700">Ad Soyad</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm"
        />
      </div>
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
        <label className="mb-1 block text-sm text-stone-700">Telefon (opsiyonel)</label>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
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
          minLength={8}
          className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm text-stone-700">Şifre (Tekrar)</label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
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
        {busy ? "Kayıt oluşturuluyor…" : "Kayıt Ol"}
      </button>

      <p className="text-center text-sm text-stone-500">
        Zaten hesabınız var mı?{" "}
        <Link href="/giris" className="font-medium text-rose-600 hover:underline">
          Giriş yapın
        </Link>
      </p>
    </form>
  );
}
