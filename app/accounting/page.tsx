'use client';

import { useEffect, useMemo, useState } from 'react';
import { Nav } from '../../components/Nav';
import type { Expense } from '../../lib/types';
import { downloadCsv, eur, num } from '../../lib/format';
import {
  expenseCategories,
  paymentMethods,
  recurringOptions,
  taxDeductibleOptions
} from '../../lib/constants';

const today = new Date().toISOString().slice(0, 10);

const emptyForm = {
  expense_date: today,
  category: 'Software / Tools',
  description: '',
  supplier: '',
  invoice_number: '',
  net_amount: '',
  vat_rate: '19',
  gross_amount: '',
  payment_method: 'Bank',
  receipt_available: false,
  tax_deductible: '100 %',
  recurring: 'einmalig',
  notes: ''
};

export default function AccountingPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  async function loadExpenses() {
    const response = await fetch('/api/expenses', { cache: 'no-store' });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Ausgaben konnten nicht geladen werden.');
    }

    setExpenses(data.expenses || []);
  }

  useEffect(() => {
    loadExpenses().catch((err) => setError(err.message));
  }, []);

  function updateField(key: string, value: any) {
    const next: any = { ...form, [key]: value };

    if (key === 'net_amount' || key === 'vat_rate') {
      const net = num(next.net_amount);
      const vat = num(next.vat_rate);

      if (net > 0) {
        next.gross_amount = String(Math.round(net * (1 + vat / 100) * 100) / 100);
      }
    }

    setForm(next);
  }

function startEdit(item: Expense) {
  if (!item.id) {
    setError('Diese Ausgabe hat keine ID und kann nicht bearbeitet werden.');
    return;
  }

  setEditingId(item.id);
console.log("EDIT ID:", item.id);
  
    setForm({
      expense_date: item.expense_date || today,
      category: item.category || 'Software / Tools',
      description: item.description || '',
      supplier: item.supplier || '',
      invoice_number: item.invoice_number || '',
      net_amount: item.net_amount == null ? '' : String(item.net_amount),
      vat_rate: item.vat_rate == null ? '19' : String(item.vat_rate),
      gross_amount: item.gross_amount == null ? '' : String(item.gross_amount),
      payment_method: item.payment_method || 'Bank',
      receipt_available: Boolean(item.receipt_available),
      tax_deductible: item.tax_deductible || '100 %',
      recurring: item.recurring || 'einmalig',
      notes: item.notes || ''
    });

    setMessage('Ausgabe wird bearbeitet.');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(emptyForm);
    setMessage('');
  }

  async function saveExpense() {
    setError('');
    setMessage('');

    try {
      const response = await fetch(
        editingId ? `/api/expenses?id=${editingId}` : '/api/expenses',
        {
          method: editingId ? 'PATCH' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form)
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Ausgabe konnte nicht gespeichert werden.');
      }

      setMessage(editingId ? 'Ausgabe aktualisiert.' : 'Ausgabe gespeichert.');
      setEditingId(null);
      setForm(emptyForm);
      await loadExpenses();
    } catch (err: any) {
      setError(err.message || 'Fehler beim Speichern.');
    }
  }

  async function deleteExpense(id?: string) {
    if (!id) return;
    if (!confirm('Diese Ausgabe wirklich löschen?')) return;

    await fetch(`/api/expenses?id=${id}`, { method: 'DELETE' });
    await loadExpenses();
  }

  const totalGross = useMemo(() => {
    return expenses.reduce((sum, item) => sum + num(item.gross_amount), 0);
  }, [expenses]);

  function exportExpenses() {
    const rows: unknown[][] = [
      [
        'Datum',
        'Kategorie',
        'Beschreibung',
        'Lieferant',
        'Rechnungsnummer',
        'Netto',
        'MwSt %',
        'Brutto',
        'Zahlungsart',
        'Beleg vorhanden',
        'Steuerlich absetzbar',
        'Wiederkehrend',
        'Notiz'
      ],
      ...expenses.map((item) => [
        item.expense_date,
        item.category,
        item.description,
        item.supplier,
        item.invoice_number,
        item.net_amount,
        item.vat_rate,
        item.gross_amount,
        item.payment_method,
        item.receipt_available ? 'Ja' : 'Nein',
        item.tax_deductible,
        item.recurring,
        item.notes
      ])
    ];

    downloadCsv('mon-chic-buchhaltung-export.csv', rows);
  }

  return (
    <>
      <Nav />

      <main className="mx-auto max-w-7xl p-6 space-y-5">
        <section className="card flex justify-between items-center gap-4 flex-wrap">
          <div>
            <h1 className="text-3xl font-black text-monchic-green">
              Buchhaltung / Ausgaben
            </h1>
            <p>Für Steuerberater, Finanzamt und interne Gewinnanalyse vorbereitet.</p>
          </div>

          <button className="btn-secondary" onClick={exportExpenses}>
            Excel/CSV Export
          </button>
        </section>

        {error && (
          <section className="card border-red-300 bg-red-50 text-red-800">
            Fehler: {error}
          </section>
        )}

        {message && (
          <section className="card border-green-300 bg-green-50 text-green-800">
            {message}
          </section>
        )}

        <section className="grid lg:grid-cols-2 gap-5">
          <div className="card space-y-3">
            <h2 className="text-xl font-bold">
              {editingId ? 'Ausgabe bearbeiten' : 'Neue Ausgabe'}
            </h2>

            <label className="label">Datum</label>
            <input
              className="input"
              type="date"
              value={form.expense_date}
              onChange={(e) => updateField('expense_date', e.target.value)}
            />

            <label className="label">Kategorie</label>
            <select
              className="input"
              value={form.category}
              onChange={(e) => updateField('category', e.target.value)}
            >
              {expenseCategories.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>

            <label className="label">Beschreibung</label>
            <input
              className="input"
              value={form.description}
              onChange={(e) => updateField('description', e.target.value)}
            />

            <label className="label">Lieferant</label>
            <input
              className="input"
              value={form.supplier}
              onChange={(e) => updateField('supplier', e.target.value)}
            />

            <label className="label">Rechnungsnummer / Belegnr.</label>
            <input
              className="input"
              value={form.invoice_number}
              onChange={(e) => updateField('invoice_number', e.target.value)}
            />

            <div className="grid grid-cols-3 gap-3">
              <input
                className="input"
                type="number"
                placeholder="Netto"
                value={form.net_amount}
                onChange={(e) => updateField('net_amount', e.target.value)}
              />

              <input
                className="input"
                type="number"
                placeholder="MwSt %"
                value={form.vat_rate}
                onChange={(e) => updateField('vat_rate', e.target.value)}
              />

              <input
                className="input"
                type="number"
                placeholder="Brutto"
                value={form.gross_amount}
                onChange={(e) => updateField('gross_amount', e.target.value)}
              />
            </div>

            <label className="label">Zahlungsart</label>
            <select
              className="input"
              value={form.payment_method}
              onChange={(e) => updateField('payment_method', e.target.value)}
            >
              {paymentMethods.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>

            <label className="label">Steuerlich absetzbar</label>
            <select
              className="input"
              value={form.tax_deductible}
              onChange={(e) => updateField('tax_deductible', e.target.value)}
            >
              {taxDeductibleOptions.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>

            <label className="label">Wiederkehrend</label>
            <select
              className="input"
              value={form.recurring}
              onChange={(e) => updateField('recurring', e.target.value)}
            >
              {recurringOptions.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>

            <label className="flex gap-2 items-center">
              <input
                type="checkbox"
                checked={form.receipt_available}
                onChange={(e) => updateField('receipt_available', e.target.checked)}
              />
              Beleg vorhanden
            </label>

            <label className="label">Notiz</label>
            <textarea
              className="input"
              value={form.notes}
              onChange={(e) => updateField('notes', e.target.value)}
            />

            <div className="flex gap-2">
              <button className="btn" onClick={saveExpense}>
                {editingId ? 'Änderung speichern' : 'Ausgabe speichern'}
              </button>

              {editingId && (
                <button className="btn-secondary" onClick={cancelEdit}>
                  Abbrechen
                </button>
              )}
            </div>
          </div>

          <div className="card">
            <h2 className="text-xl font-bold">Ausgabenliste</h2>
            <div className="metric">{eur(totalGross)}</div>

            <div className="mt-4 space-y-2">
              {expenses.length === 0 && (
                <p className="text-stone-600">Noch keine Ausgaben gespeichert.</p>
              )}

              {expenses.map((item) => (
                <div
                  key={item.id}
                  className="border-b py-2 flex justify-between gap-3"
                >
                  <div>
                    <b>{item.category}</b>

                    <div className="small-muted">
                      {item.expense_date} · {item.supplier || '-'} ·{' '}
                      {item.description || '-'}
                      <br />
                      Rechnungsnr.: {item.invoice_number || '-'}
                    </div>
                  </div>

                  <div className="text-right">
                    <b>{eur(item.gross_amount)}</b>
                    <br />

                    <button
                      className="text-blue-700 text-sm mr-3"
                      onClick={() => startEdit(item)}
                    >
                      bearbeiten
                    </button>

                    <button
                      className="text-red-700 text-sm"
                      onClick={() => deleteExpense(item.id)}
                    >
                      löschen
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

