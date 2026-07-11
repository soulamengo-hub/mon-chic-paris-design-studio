'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Nav } from '../components/Nav';
import type { Product, Expense } from '../lib/types';
import { eur, pct } from '../lib/format';
import { countBy, getStats } from '../lib/analytics';

const workspaces = [
  {
    icon: '♛',
    title: 'Fashion',
    text: 'Vintage Luxury, Artikel, Lager, Etiketten und Verkäufe.',
    href: '/fashion',
    accent: 'blue',
  },
  {
    icon: '◉',
    title: 'Design Studio',
    text: 'Content, Branding, Website und Social Media.',
    href: '/design-studio',
    accent: 'gold',
  },
  {
    icon: '✦',
    title: 'KI Studio',
    text: 'Bilderkennung, Produkttexte, SEO und Übersetzungen.',
    href: '/ai-studio',
    accent: 'violet',
  },
  {
    icon: '▦',
    title: 'Business',
    text: 'Finanzen, CRM, Projekte und Business Apps.',
    href: '/business',
    accent: 'green',
  },
] as const;

export default function Dashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [error, setError] = useState('');

  async function load() {
    setError('');
    try {
      const [productsResponse, expensesResponse] = await Promise.all([
        fetch('/api/products', { cache: 'no-store' }),
        fetch('/api/expenses', { cache: 'no-store' }),
      ]);
      const productsData = await productsResponse.json();
      const expensesData = await expensesResponse.json();
      if (!productsResponse.ok) throw new Error(productsData.error || 'Artikel konnten nicht geladen werden.');
      if (!expensesResponse.ok) throw new Error(expensesData.error || 'Ausgaben konnten nicht geladen werden.');
      setProducts(productsData.products || []);
      setExpenses(expensesData.expenses || []);
    } catch (error: any) {
      setError(error.message || 'Daten konnten nicht geladen werden.');
    }
  }

  useEffect(() => { load(); }, []);

  const stats = getStats(products, expenses);
  const topBrands = countBy(products, 'brand').slice(0, 5);

  return (
    <>
      <Nav />
      <main className="dashboard-main">
        <section className="hero-card hero-v2">
          <div className="hero-copy">
            <div className="kicker">MON CHIC PARIS · DESIGN STUDIO</div>
            <h1>Fashion. Creativity. Innovation.</h1>
            <p>Luxury Fashion meets Digital Innovation</p>
          </div>
          <button className="btn" onClick={load}>Daten aktualisieren</button>
        </section>

        <section className="quick-actions" aria-label="Schnellaktionen">
          <Link href="/products/new" className="quick-action"><span>＋</span>Neuen Artikel erfassen</Link>
          <Link href="/product-capture" className="quick-action"><span>⌁</span>KI-Aufnahme starten</Link>
          <Link href="/content-studio" className="quick-action"><span>◉</span>Content erstellen</Link>
          <Link href="/business" className="quick-action"><span>▦</span>Business öffnen</Link>
        </section>

        {error && <section className="card error-card">Fehler: {error}</section>}

        <section className="workspace-grid">
          {workspaces.map((workspace) => (
            <Link key={workspace.href} href={workspace.href} className={`workspace-card ${workspace.accent}`}>
              <div className="workspace-icon">{workspace.icon}</div>
              <div>
                <h2>{workspace.title}</h2>
                <p>{workspace.text}</p>
              </div>
              <span className="workspace-arrow">›</span>
            </Link>
          ))}
        </section>

        <section className="section-heading">
          <div>
            <div className="kicker">Überblick</div>
            <h2>Heute im Studio</h2>
          </div>
          <Link href="/analytics" className="text-link">Alle Analysen ansehen →</Link>
        </section>

        <section className="stats-grid">
          <div className="stat-card"><span>Artikel aktiv</span><strong>{stats.active}</strong><small>Fashion</small></div>
          <div className="stat-card"><span>Umsatz verkauft</span><strong>{eur(stats.revenue)}</strong><small>Business</small></div>
          <div className="stat-card"><span>Retourenquote</span><strong>{pct(stats.returnRate)}</strong><small>Qualität</small></div>
          <div className="stat-card"><span>Lagerwert</span><strong>{eur(stats.stockValue)}</strong><small>Inventar</small></div>
          <div className="stat-card"><span>Ausgaben gesamt</span><strong>{eur(stats.expenseTotal)}</strong><small>Buchhaltung</small></div>
          <div className="stat-card"><span>Gewinn nach Ausgaben</span><strong>{eur(stats.netProfit)}</strong><small>Ergebnis</small></div>
        </section>

        <section className="dashboard-grid">
          <div className="card">
            <div className="card-heading"><h2>Letzte Artikel</h2><Link href="/products" className="text-link">Artikel öffnen</Link></div>
            {products.length === 0 && <p>Noch keine Artikel vorhanden.</p>}
            {products.slice(0, 8).map((product) => (
              <div key={product.id || product.sku} className="list-row">
                <span>{product.brand || 'Vintage'} – {product.category || 'Artikel'} · {product.season || 'Ganzjährig'} · {product.sku}</span>
                <b>{product.sale_price ? eur(product.sale_price) : '-'}</b>
              </div>
            ))}
          </div>

          <div className="card">
            <div className="card-heading"><h2>Top Marken</h2><Link href="/business-intelligence" className="text-link">BI öffnen</Link></div>
            {topBrands.length === 0 && <p>Noch keine Marken vorhanden.</p>}
            {topBrands.map(([name, count]) => (
              <div key={name} className="list-row"><span>{name}</span><b>{count}</b></div>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
