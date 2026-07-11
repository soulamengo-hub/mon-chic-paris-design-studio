'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { Nav } from '../../components/Nav';

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [sortBy, setSortBy] = useState('sku');

  async function loadProducts() {
    const response = await fetch('/api/products', {
      cache: 'no-store'
    });

    const data = await response.json();
    setProducts(data.products || []);
  }

  useEffect(() => {
    loadProducts();
  }, []);

  async function deleteProduct(id: string) {
    if (!confirm('Artikel löschen?')) return;

    await fetch(`/api/products?id=${id}`, {
      method: 'DELETE'
    });

    loadProducts();
  }

  function exportCsv() {
    const rows = [
      ['SKU', 'Marke', 'Kategorie', 'Status'],
      ...products.map((p) => [p.sku, p.brand, p.category, p.status])
    ];

    const csv = rows.map((r) => r.join(';')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');

    a.href = url;
    a.download = 'produkte.csv';
    a.click();

    URL.revokeObjectURL(url);
  }

  const sortedProducts = useMemo(() => {
    return [...products].sort((a, b) => {
      const av = a[sortBy] || '';
      const bv = b[sortBy] || '';
      return String(av).localeCompare(String(bv));
    });
  }, [products, sortBy]);

  return (
    <>
      <Nav />

      <main className="mx-auto max-w-7xl p-6 space-y-5">
        <section className="card">
          <Link href="/" className="btn-secondary">
            ← Zurück zum Dashboard
          </Link>

          <h1 className="text-3xl font-black text-monchic-green mt-4">
            Produkte
          </h1>

          <p>
            Anzahl Produkte: <b>{products.length}</b>
          </p>
        </section>

        <section className="card flex gap-3 flex-wrap items-center">
          <select
            className="input max-w-xs"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="sku">SKU</option>
            <option value="brand">Marke</option>
            <option value="category">Kategorie</option>
            <option value="status">Status</option>
          </select>

          <button className="btn-secondary" onClick={exportCsv}>
            CSV Export
          </button>
        </section>

        <section className="card overflow-x-auto">
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th>SKU</th>
                <th>Marke</th>
                <th>Kategorie</th>
                <th>Status</th>
                <th>Aktionen</th>
              </tr>
            </thead>

            <tbody>
              {sortedProducts.map((product) => (
                <tr key={product.id}>
                  <td>{product.sku}</td>
                  <td>{product.brand}</td>
                  <td>{product.category}</td>
                  <td>{product.status}</td>

                  <td>
                    <Link
                      href={`/products/${product.id}/edit`}
                      style={{ color: 'blue', marginRight: 10 }}
                    >
                      bearbeiten
                    </Link>

                    <button
                      onClick={() => deleteProduct(product.id)}
                      style={{ color: 'red' }}
                    >
                      löschen
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </main>
    </>
  );
}
