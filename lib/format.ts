export function num(value: unknown): number {
  const n = Number(value ?? 0);
  return Number.isFinite(n) ? n : 0;
}

export function eur(value?: number | string | null): string {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
  }).format(num(value));
}

export function formatCurrency(value?: number | string | null): string {
  return eur(value);
}

export function discountedPrice(
  salePrice?: number | string | null,
  discountPercent?: number | string | null
): number {
  const price = num(salePrice);
  const discount = Math.max(0, Math.min(100, num(discountPercent)));
  return Number((price * (1 - discount / 100)).toFixed(2));
}

export function discountPrice(
  salePrice?: number | string | null,
  discountPercent?: number | string | null
): number {
  return discountedPrice(salePrice, discountPercent);
}

export function pct(value?: number | string | null): string {
  return `${Math.round(num(value) * 10) / 10} %`;
}

export function csvEscape(value: unknown): string {
  if (value === null || value === undefined) return "";
  return `"${String(value).replace(/"/g, '""')}"`;
}

export function downloadCsv(filename: string, rows: unknown[][]): void {
  const csv = rows
    .map((row) => row.map((cell) => csvEscape(cell)).join(";"))
    .join("\n");

  const blob = new Blob(["\ufeff" + csv], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = filename;

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}

export function csvDownloadFile(filename: string, rows: unknown[][]): void {
  downloadCsv(filename, rows);
}

export function downloadCsvFile(filename: string, rows: unknown[][]): void {
  downloadCsv(filename, rows);
}
