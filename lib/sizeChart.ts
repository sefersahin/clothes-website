export const SIZE_CHART_TYPES = [
  { value: "dress", label: "Elbise (Göğüs, Bel, Kalça, Boy)" },
  { value: "shirt", label: "Gömlek (Boyun, Göğüs, Bel)" },
  { value: "skirt", label: "Etek (Bel, Boy)" },
  { value: "suit", label: "Takım (Göğüs, Bel, Kalça, Boy)" },
  { value: "pants", label: "Pantolon (Bel, Kalça, Boy)" },
] as const;

export type SizeChartType = (typeof SIZE_CHART_TYPES)[number]["value"];

export type SizeChartFieldKey = "neck" | "chest" | "waist" | "hip" | "length";

export const SIZE_CHART_FIELDS: Record<
  SizeChartType,
  { key: SizeChartFieldKey; label: string }[]
> = {
  dress: [
    { key: "chest", label: "Göğüs (cm)" },
    { key: "waist", label: "Bel (cm)" },
    { key: "hip", label: "Kalça (cm)" },
    { key: "length", label: "Boy (cm)" },
  ],
  shirt: [
    { key: "neck", label: "Boyun (cm)" },
    { key: "chest", label: "Göğüs (cm)" },
    { key: "waist", label: "Bel (cm)" },
  ],
  skirt: [
    { key: "waist", label: "Bel (cm)" },
    { key: "length", label: "Boy (cm)" },
  ],
  suit: [
    { key: "chest", label: "Göğüs (cm)" },
    { key: "waist", label: "Bel (cm)" },
    { key: "hip", label: "Kalça (cm)" },
    { key: "length", label: "Boy (cm)" },
  ],
  pants: [
    { key: "waist", label: "Bel (cm)" },
    { key: "hip", label: "Kalça (cm)" },
    { key: "length", label: "Boy (cm)" },
  ],
};

export const DEFAULT_SIZE_CHART_TYPE: SizeChartType = "dress";
