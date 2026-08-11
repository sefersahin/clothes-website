"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { SIZE_CHART_FIELDS, type SizeChartFieldKey, type SizeChartType } from "@/lib/sizeChart";

type SizeChartRow = {
  id: string;
  size: string;
  neck: string | null;
  chest: string | null;
  waist: string | null;
  hip: string | null;
  length: string | null;
};

export default function SizeChartManager({
  productId,
  rows,
  sizeChartType,
}: {
  productId: string;
  rows: SizeChartRow[];
  sizeChartType: SizeChartType;
}) {
  const router = useRouter();
  const fields = SIZE_CHART_FIELDS[sizeChartType];

  const [size, setSize] = useState("");
  const [values, setValues] = useState<Partial<Record<SizeChartFieldKey, string>>>({});
  const [error, setError] = useState<string | null>(null);
  const [edits, setEdits] = useState<Record<string, Partial<Record<SizeChartFieldKey, string>>>>({});
  const [busy, setBusy] = useState(false);

  async function addRow(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);

    const body: Record<string, string> = { size };
    for (const field of fields) {
      const value = values[field.key];
      if (value) body[field.key] = value;
    }

    const res = await fetch(`/api/admin/products/${productId}/size-chart-rows`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    setBusy(false);
    if (!res.ok) {
      setError("Beden tablosu satırı eklenemedi.");
      return;
    }
    setSize("");
    setValues({});
    router.refresh();
  }

  async function saveRow(rowId: string) {
    const rowValues = edits[rowId];
    if (!rowValues) return;
    setBusy(true);
    await fetch(`/api/admin/size-chart-rows/${rowId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(rowValues),
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

  function fieldValue(row: SizeChartRow, field: SizeChartFieldKey) {
    return edits[row.id]?.[field] ?? row[field] ?? "";
  }

  function updateField(rowId: string, field: SizeChartFieldKey, value: string) {
    setEdits((prev) => ({ ...prev, [rowId]: { ...prev[rowId], [field]: value } }));
  }

  return (
    <div>
      <h2 className="mb-1 text-sm font-medium text-gray-500">Beden Tablosu</h2>
      <p className="mb-3 text-xs text-gray-400">
        Müşterilerin doğru bedeni seçmesine yardımcı olmak için ölçüleri (cm) girin. Ürün
        sayfasında bu tablo gösterilir. Gösterilen ölçüler, ürünün kategorisine göre belirlenir.
      </p>

      <table className="mb-4 w-full text-left text-sm">
        <thead>
          <tr className="border-b border-gray-200 text-gray-500">
            <th className="py-2 pr-4">Beden</th>
            {fields.map((field) => (
              <th key={field.key} className="py-2 pr-4">
                {field.label}
              </th>
            ))}
            <th className="py-2 pr-4" />
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className="border-b border-gray-100">
              <td className="py-2 pr-4">{row.size}</td>
              {fields.map((field) => (
                <td key={field.key} className="py-2 pr-4">
                  <input
                    type="text"
                    value={fieldValue(row, field.key)}
                    onChange={(e) => updateField(row.id, field.key, e.target.value)}
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
              <td colSpan={fields.length + 2} className="py-4 text-gray-500">
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
        {fields.map((field) => (
          <div key={field.key}>
            <label className="mb-1 block text-sm text-gray-700">{field.label}</label>
            <input
              type="text"
              value={values[field.key] ?? ""}
              onChange={(e) => setValues((prev) => ({ ...prev, [field.key]: e.target.value }))}
              className="w-20 rounded border border-gray-300 px-3 py-2 text-sm"
            />
          </div>
        ))}
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
