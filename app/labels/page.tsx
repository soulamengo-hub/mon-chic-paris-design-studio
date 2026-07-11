'use client';

import { useEffect, useMemo, useState } from 'react';
import { Nav } from '../../components/Nav';
import type { Product } from '../../lib/types';
import { eur } from '../../lib/format';

export default function LabelsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState('');

  async function loadProducts() {
    setError('');
    try {
      const response = await fetch('/api/products', { cache: 'no-store' });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Artikel konnten nicht geladen werden.');
      setProducts(data.products || []);
    } catch (err: any) {
      setError(err.message || 'Fehler beim Laden.');
    }
  }

  useEffect(() => { loadProducts(); }, []);

  const activeProducts = useMemo(
    () => products.filter((item) => item.status !== 'Verkauft'),
    [products]
  );

  return (
    <>
      <Nav />
      <main className="wrap">
        <section className="card labels-toolbar no-print">
          <div>
            <div className="kicker">Fashion Workspace</div>
            <h1>Etiketten</h1>
            <p>Druckansicht für Artikel-Etiketten. QR-/Scan-Code folgt in einem späteren Release.</p>
          </div>
          <button className="btn" onClick={() => window.print()}>Etiketten drucken</button>
        </section>

        {error && <section className="card error-card no-print">Fehler: {error}</section>}

        <section className="print-sheet">
          <div className="labels-grid">
            {activeProducts.map((item) => (
              <article key={item.id || item.sku} className="label-cell">
                <div>
                  <div className="label-brand-name">{item.brand || 'MON CHIC'}</div>
                  <div className="label-item-type">{item.category || 'Vintage'}</div>
                  <div className="label-size">Größe {item.size || '-'}</div>
                </div>
                <div>
                  <div className="label-price">{item.sale_price ? eur(item.sale_price) : '-'}</div>
                  <div className="label-divider" />
                  <div className="label-sku">{item.sku}</div>
                  <div className="label-signature">MON CHIC PARIS · DESIGN STUDIO</div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
