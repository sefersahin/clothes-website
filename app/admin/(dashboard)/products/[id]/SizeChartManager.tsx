"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type SizeChartRow = {
  id: string;
  size: string;
  chest: string | null;
  waist: string | null;
  hip: string | null;
  length: string | null;
};

export default function SizeChartManager({
  productId,
  rows,
}: {
  productId: string;
  rows: SizeChartRow[];
}) {
  const router = useRouter();
  const [size, setSize] = useState("");
  const [chest, setChest] = useState("");
  const [waist, setWaist] = useState("");
  const [hip, setHip] = useState("");
  const [length, setLength] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [edits, setEdits] = useState<Record<string, Partial<Record<"chest" | "waist" | "hip" | "length", string>>>>({});
  const [busy, setBusy] = useState(false);

  async function addRow(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);

    const res = await fetch(`/api/admin/products/${productId}/size-chart-rows`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        size,
        chest: chest || undefined,
        waist: waist || undefined,
        hip: hip || undefined,
        length: length || undefined,
      }),
    });

    setBusy(false);
    if (!res.ok) {
      setError("Beden tablosu satırı eklenemedi.");
      return;
    }
    setSize("");
    setChest("");
    setWaist("");
    setHip("");
    setLength("");
    router.refresh();
  }

  async function saveRow(rowId: string) {
    const values = edits[rowId];
    if (!values) return;
    setBusy(true);
    await fetch(`/api/admin/size-chart-rows/${rowId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    setBusy(false);
    router.refresh();
  }

  async function deleteRow(rowId: string) {
    setBusy(true);
    await fetch(`/api/admin/size-chart-rows/${rowId}`, { method: "DELETE" });
    setBusy(false);
    router.refresh();
  }

  function fieldValue(row: SizeChartRow, field: "chest" | "waist" | "hip" | "length") {
    return edits[row.id]?.[field] ?? row[field] ?? "";
  }

  function updateField(rowId: string, field: "chest" | "waist" | "hip" | "length", value: string) {
    setEdits((prev) => ({ ...prev, [rowId]: { ...prev[rowId], [field]: value } }));
  }

  return (
    <div>
      <h2 className="mb-1 text-sm font-medium text-gray-500">Beden Tablosu</h2>
      <p className="mb-3 text-xs text-gray-400">
        Müşterilerin doğru bedeni seçmesine yardımcı olmak için ölçüleri (cm) girin. Ürün
        sayfasında bu tablo gösterilir.
      </p>

      <table className="mb-4 w-full text-left text-sm">
        <thead>
          <tr className="border-b border-gray-200 text-gray-500">
            <th className="py-2 pr-4">Beden</th>
            <th className="py-2 pr-4">Göğüs (cm)</th>
            <th className="py-2 pr-4">Bel (cm)</th>
            <th className="py-2 pr-4">Kalça (cm)</th>
            <th className="py-2 pr-4">Boy (cm)</th>
            <th className="py-2 pr-4" />
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className="border-b border-gray-100">
              <td className="py-2 pr-4">{row.size}</td>
              {(["chest", "waist", "hip", "length"] as const).map((field) => (
                <td key={field} className="py-2 pr-4">
                  <input
                    type="text"
                    value={fieldValue(row, field)}
                    onChange={(e) => updateField(row.id, field, e.target.value)}
                    className="w-20 rounded border border-gray-300 px-2 py-1"
                  />
                </td>
              ))}
              <td className="py-2 pr-4 space-x-3">
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => saveRow(row.id)}
                  className="text-gray-700 hover:underline disabled:opacity-50"
                >
                  Kaydet
                </button>
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => deleteRow(row.id)}
                  className="text-rose-600 hover:underline disabled:opacity-50"
                >
                  Sil
                </button>
              </td>
            </tr>
          ))}
          {rows.length === 0 && (
            <tr>
              <td colSpan={6} className="py-4 text-gray-500">
                Henüz beden tablosu satırı eklenmedi.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <form onSubmit={addRow} className="flex flex-wrap items-end gap-3">
        <div>
          <label className="mb-1 block text-sm text-gray-700">Beden</label>
          <input
            type="text"
            value={size}
            onChange={(e) => setSize(e.target.value)}
            required
            className="w-20 rounded border border-gray-300 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm text-gray-700">Göğüs (cm)</label>
          <input
            type="text"
            value={chest}
            onChange={(e) => setChest(e.target.value)}
            className="w-20 rounded border border-gray-300 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm text-gray-700">Bel (cm)</label>
          <input
            type="text"
            value={waist}
            onChange={(e) => setWaist(e.target.value)}
            className="w-20 rounded border border-gray-300 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm text-gray-700">Kalça (cm)</label>
          <input
            type="text"
            value={hip}
            onChange={(e) => setHip(e.target.value)}
            className="w-20 rounded border border-gray-300 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm text-gray-700">Boy (cm)</label>
          <input
            type="text"
            value={length}
            onChange={(e) => setLength(e.target.value)}
            className="w-20 rounded border border-gray-300 px-3 py-2 text-sm"
          />
        </div>
        <button
          type="submit"
          disabled={busy}
          className="rounded border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-50 disabled:opacity-50"
        >
          Ekle
        </button>
      </form>

      {error && <p className="mt-2 text-sm text-rose-600">{error}</p>}
    </div>
  );
}
