"use client";

import { useState } from "react";

// Edit this text to change the message shown under the "İletişim" heading.
const CONTACT_INTRO_MESSAGE =
  "Sorularınız, siparişleriniz veya işbirlikleri için bize aşağıdaki formdan ulaşabilirsiniz.";

export default function ContactPage() {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");

    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fullName, phone, email, message }),
    });

    if (!res.ok) {
      setStatus("error");
      return;
    }

    setStatus("sent");
    setFullName("");
    setPhone("");
    setEmail("");
    setMessage("");
  }

  if (status === "sent") {
    return (
      <div className="mx-auto max-w-lg px-4 py-10 text-center sm:px-6">
        <h1 className="mb-4 text-3xl font-semibold tracking-tight text-stone-900">İletişim</h1>
        <p className="text-sm text-stone-600">Mesajınız alındı, teşekkür ederiz.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-10 sm:px-6">
      <h1 className="mb-3 text-3xl font-semibold tracking-tight text-stone-900">İletişim</h1>
      <p className="mb-8 text-sm leading-relaxed text-stone-600">{CONTACT_INTRO_MESSAGE}</p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm text-stone-700">Ad Soyad</label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm text-stone-700">Telefon</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm text-stone-700">E-posta</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm text-stone-700">Mesajınız</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            rows={5}
            className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm focus:border-rose-500 focus:outline-none focus:ring-1 focus:ring-rose-500"
          />
        </div>

        {status === "error" && (
          <p className="text-sm text-rose-600">Bir sorun oluştu, lütfen tekrar deneyin.</p>
        )}

        <button
          type="submit"
          disabled={status === "sending"}
          className="rounded-lg bg-stone-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-rose-600 disabled:opacity-50"
        >
          {status === "sending" ? "Gönderiliyor…" : "Gönder"}
        </button>
      </form>
    </div>
  );
}
