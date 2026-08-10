"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function StripeForm({ initialText }: { initialText: string }) {
  const router = useRouter();
  const [text, setText] = useState(initialText);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaved(false);
    setSaving(true);

    const res = await fetch("/api/admin/marquee", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });

    setSaving(false);
    if (!res.ok) {
      setError("Kaydedilemedi.");
      return;
    }
    setSaved(true);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-xl space-y-4">
      <div>
        <label className="mb-1 block text-sm text-gray-700">Şerit Metni</label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          required
          rows={3}
          className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
        />
      </div>

      {error && <p className="text-sm text-rose-600">{error}</p>}
      {saved && <p className="text-sm text-emerald-600">Kaydedildi.</p>}

      <button
        type="submit"
        disabled={saving}
        className="rounded bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50"
      >
        {saving ? "Kaydediliyor…" : "Kaydet"}
      </button>
    </form>
  );
}
