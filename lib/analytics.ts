import type { Product, Expense } from "./types";
import { discountedPrice, num } from "./format";

export function getStats(products: Product[], expenses: Expense[] = []) {
  const sold = products.filter((p) => p.status === "Verkauft");
  const returns = products.filter((p) => p.status === "Retoure");
  const active = products.filter((p) =>
    ["Aktiv", "Entwurf", "Reserviert"].includes(p.status || "")
  );

  const revenue = sold.reduce(
    (sum, p) => sum + discountedPrice(p.sale_price, p.discount_percent),
    0
  );

  const purchase = sold.reduce((sum, p) => sum + num(p.purchase_price), 0);

  const stockValue = products
    .filter((p) => p.status !== "Verkauft" && p.status !== "Archiviert")
    .reduce(
      (sum, p) => sum + discountedPrice(p.sale_price, p.discount_percent),
      0
    );

  const expenseTotal = expenses.reduce(
    (sum, e) => sum + num(e.gross_amount),
    0
  );

  const returnRate =
    sold.length + returns.length
      ? (returns.length / (sold.length + returns.length)) * 100
      : 0;

  const margin = revenue - purchase;

  return {
    total: products.length,
    active: active.length,
    sold: sold.length,
    returns: returns.length,
    revenue,
    purchase,
    margin,
    expenseTotal,
    netProfit: margin - expenseTotal,
    stockValue,
    avg: products.length ? stockValue / products.length : 0,
    returnRate,
    trendProducts: products.filter((p) => num(p.trend_score) >= 70).length,
  };
}

export function countBy<T extends Record<string, any>>(
  items: T[],
  key: keyof T
): [string, number][] {
  const map: Record<string, number> = {};

  items.forEach((item) => {
    const value = String(item[key] || "Nicht gesetzt");
    map[value] = (map[value] || 0) + 1;
  });

  return Object.entries(map).sort((a, b) => b[1] - a[1]);
}
