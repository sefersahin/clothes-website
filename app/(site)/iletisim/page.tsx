"use client";

import { useState } from "react";

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
      <div className="max-w-lg">
        <h1 className="mb-4 text-2xl font-semibold">İletişim</h1>
        <p className="text-sm text-gray-700">Mesajınız alındı, teşekkür ederiz.</p>
      </div>
    );
  }

  return (
    <div className="max-w-lg">
      <h1 className="mb-6 text-2xl font-semibold">İletişim</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm text-gray-700">Ad Soyad</label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm text-gray-700">Telefon</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm text-gray-700">E-posta</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm text-gray-700">Mesajınız</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            rows={5}
            className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
          />
        </div>

        {status === "error" && (
          <p className="text-sm text-rose-600">Bir sorun oluştu, lütfen tekrar deneyin.</p>
        )}

        <button
          type="submit"
          disabled={status === "sending"}
          className="rounded bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50"
        >
          {status === "sending" ? "Gönderiliyor…" : "Gönder"}
        </button>
      </form>
    </div>
  );
}
