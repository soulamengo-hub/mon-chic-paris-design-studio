'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  countries,
  salesChannels,
  designerLevels,
  authenticityStatuses,
  productStatuses,
  conditions,
  categories,
  seasons,
  styleOptions,
  patterns,
  occasions,
  eras,
  rarityOptions,
} from '../lib/constants';
import { createSku } from '../lib/sku';
import { discountedPrice, eur } from '../lib/format';
import type { Product } from '../lib/types';

export function ProductForm({
  initial,
  mode,
}: {
  initial?: Product | null;
  mode: 'create' | 'edit';
}) {
  const router = useRouter();

  const [brand, setBrand] = useState(initial?.brand || '');
  const [category, setCategory] = useState(initial?.category || 'Rock');
  const [season, setSeason] = useState(initial?.season || 'Ganzjährig');
  const [sku, setSku] = useState(initial?.sku || 'MCP-RO-00000');
  const [size, setSize] = useState(initial?.size || '');
  const [color, setColor] = useState(initial?.color || '');
  const [material, setMaterial] = useState(initial?.material || '');
  const [condition, setCondition] = useState(initial?.condition || 'Sehr gut');
  const [designerLevel, setDesignerLevel] = useState(
    initial?.designer_level || 'Contemporary'
  );
  const [styleKey, setStyleKey] = useState(initial?.style_key || '');
  const [pattern, setPattern] = useState(initial?.pattern || '');
  const [occasion, setOccasion] = useState(initial?.occasion || '');
  const [era, setEra] = useState(initial?.era || 'Zeitlos');
  const [rarity, setRarity] = useState(initial?.rarity || 'Unbekannt');
  const [authenticity, setAuthenticity] = useState(
    initial?.authenticity_status || 'Nicht geprüft'
  );
  const [purchasePrice, setPurchasePrice] = useState(
    initial?.purchase_price?.toString() || ''
  );
  const [salePrice, setSalePrice] = useState(
    initial?.sale_price?.toString() || ''
  );
  const [discountPercent, setDiscountPercent] = useState(
    initial?.discount_percent?.toString() || '0'
  );
  const [status, setStatus] = useState(initial?.status || 'Entwurf');
  const [country, setCountry] = useState(initial?.target_country || 'Deutschland');
  const [channel, setChannel] = useState(initial?.sales_channel || 'Instagram');
  const [trendScore, setTrendScore] = useState(
    initial?.trend_score?.toString() || '50'
  );
  const [storageLocation, setStorageLocation] = useState(
    initial?.storage_location || ''
  );
  const [purchaseSource, setPurchaseSource] = useState(
    initial?.purchase_source || ''
  );
  const [soldAt, setSoldAt] = useState(initial?.sold_at || '');
  const [notes, setNotes] = useState(initial?.notes || '');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (mode === 'create') {
      setSku(createSku(category));
    }
  }, [category, mode]);

  const finalPrice = discountedPrice(salePrice, discountPercent);

  async function handleSave() {
    setSaving(true);
    setMessage('');
    setErrorMessage('');

    const payload = {
      sku,
      brand,
      category,
      season,
      size,
      color,
      material,
      condition,
      status,
      purchase_price: purchasePrice,
      sale_price: salePrice,
      discount_percent: discountPercent,
      target_country: country,
      sales_channel: channel,
      designer_level: designerLevel,
      style_key: styleKey || null,
      pattern: pattern || null,
      occasion: occasion || null,
      era: era || null,
      rarity: rarity || null,
      authenticity_status: authenticity,
      trend_score: trendScore,
      storage_location: storageLocation,
      purchase_source: purchaseSource,
      sold_at: soldAt || null,
      notes,
    };

    try {
      const url =
        mode === 'edit' && initial?.id
          ? `/api/products?id=${initial.id}`
          : '/api/products';

      const response = await fetch(url, {
        method: mode === 'edit' ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Speichern fehlgeschlagen.');
      }

      setMessage(
        mode === 'edit' ? 'Artikel aktualisiert.' : `Artikel gespeichert: ${sku}`
      );

      if (mode === 'create') {
        setBrand('');
        setSize('');
        setColor('');
        setMaterial('');
        setPurchasePrice('');
        setSalePrice('');
        setDiscountPercent('0');
        setNotes('');
        setTrendScore('50');
        setStorageLocation('');
        setPurchaseSource('');
        setSoldAt('');
        setSku(createSku(category));
      }
    } catch (error: any) {
      setErrorMessage(error.message || 'Speichern fehlgeschlagen.');
    }

    setSaving(false);
  }

  return (
    <>
      <section className="hero-card">
        <div>
          <div className="kicker">
            {mode === 'edit' ? 'Artikelverwaltung' : 'Mon Chic Aufnahme'}
          </div>

          <h1>{mode === 'edit' ? 'Artikel bearbeiten' : 'Neuer Artikel'}</h1>

          <p>
            Erfasse Produktdaten, Preis, Lagerort und Business-Informationen
            klar und elegant.
          </p>
        </div>

        <div className="price-preview">
          <span>Aktionspreis</span>
          <strong>{eur(finalPrice)}</strong>
        </div>
      </section>

      {message && <section className="card success-card">{message}</section>}

      {errorMessage && (
        <section className="card error-card">Fehler: {errorMessage}</section>
      )}

      <form
        className="product-form-grid"
        onSubmit={(e) => {
          e.preventDefault();
          handleSave();
        }}
      >
        <section className="card form-card">
          <div className="form-section-title">Produktdaten</div>

          <label className="label">SKU</label>
          <input className="input" value={sku} readOnly />

          <label className="label">Marke</label>
          <input
            className="input"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            placeholder="z. B. Chanel, YSL, René Lezard"
          />

          <label className="label">Kategorie / Artikel</label>
          <select
            className="input"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {categories.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>

          <label className="label">Saison</label>
          <select
            className="input"
            value={season}
            onChange={(e) => setSeason(e.target.value)}
          >
            {seasons.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>

          <label className="label">Größe</label>
          <input
            className="input"
            value={size}
            onChange={(e) => setSize(e.target.value)}
            placeholder="z. B. 38, M, One Size"
          />

          <label className="label">Farbe</label>
          <input
            className="input"
            value={color}
            onChange={(e) => setColor(e.target.value)}
          />

          <label className="label">Material</label>
          <input
            className="input"
            value={material}
            onChange={(e) => setMaterial(e.target.value)}
          />

          <label className="label">Zustand</label>
          <select
            className="input"
            value={condition}
            onChange={(e) => setCondition(e.target.value)}
          >
            {conditions.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </section>

        <section className="card form-card">
          <div className="form-section-title">Preis & Verkauf</div>

          <label className="label">Einkaufspreis</label>
          <input
            className="input"
            type="number"
            value={purchasePrice}
            onChange={(e) => setPurchasePrice(e.target.value)}
          />

          <label className="label">Verkaufspreis normal</label>
          <input
            className="input"
            type="number"
            value={salePrice}
            onChange={(e) => setSalePrice(e.target.value)}
          />

          <label className="label">Rabatt %</label>
          <input
            className="input"
            type="number"
            min="0"
            max="100"
            value={discountPercent}
            onChange={(e) => setDiscountPercent(e.target.value)}
          />

          <div className="price-box">
            <span>Preis nach Rabatt</span>
            <strong>{eur(finalPrice)}</strong>
          </div>

          <label className="label">Status</label>
          <select
            className="input"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            {productStatuses.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>

          <label className="label">Verkaufsdatum</label>
          <input
            className="input"
            type="date"
            value={soldAt || ''}
            onChange={(e) => setSoldAt(e.target.value)}
          />
        </section>

        <section className="card form-card">
          <div className="form-section-title">Business & Lager</div>

          <label className="label">Designer-Level</label>
          <select
            className="input"
            value={designerLevel}
            onChange={(e) => setDesignerLevel(e.target.value)}
          >
            {designerLevels.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>

          <label className="label">Stil</label>
          <select
            className="input"
            value={styleKey}
            onChange={(e) => setStyleKey(e.target.value)}
          >
            <option value="">Bitte auswählen</option>
            {styleOptions.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>

          <label className="label">Muster</label>
          <select
            className="input"
            value={pattern}
            onChange={(e) => setPattern(e.target.value)}
          >
            <option value="">Bitte auswählen</option>
            {patterns.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>

          <label className="label">Anlass</label>
          <select
            className="input"
            value={occasion}
            onChange={(e) => setOccasion(e.target.value)}
          >
            <option value="">Bitte auswählen</option>
            {occasions.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>

          <label className="label">Epoche</label>
          <select
            className="input"
            value={era}
            onChange={(e) => setEra(e.target.value)}
          >
            {eras.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>

          <label className="label">Seltenheit</label>
          <select
            className="input"
            value={rarity}
            onChange={(e) => setRarity(e.target.value)}
          >
            {rarityOptions.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>

          <label className="label">Echtheitsstatus</label>
          <select
            className="input"
            value={authenticity}
            onChange={(e) => setAuthenticity(e.target.value)}
          >
            {authenticityStatuses.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>

          <label className="label">Zielland</label>
          <select
            className="input"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
          >
            {countries.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>

          <label className="label">Hauptkanal</label>
          <select
            className="input"
            value={channel}
            onChange={(e) => setChannel(e.target.value)}
          >
            {salesChannels.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>

          <label className="label">Lagerort</label>
          <input
            className="input"
            value={storageLocation}
            onChange={(e) => setStorageLocation(e.target.value)}
            placeholder="z. B. Regal A3"
          />

          <label className="label">Einkaufskanal</label>
          <input
            className="input"
            value={purchaseSource}
            onChange={(e) => setPurchaseSource(e.target.value)}
            placeholder="z. B. Flohmarkt, Vinted, Auktion"
          />

          <label className="label">Trend Score 0–100</label>
          <input
            className="input"
            type="number"
            min="0"
            max="100"
            value={trendScore}
            onChange={(e) => setTrendScore(e.target.value)}
          />
        </section>

        <section className="card form-card">
          <div className="form-section-title">Notizen</div>

          <textarea
            className="input notes-area"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Besonderheiten, Zustand, Einkauf, Styling-Hinweise..."
          />

          <div className="form-actions">
            <button type="submit" disabled={saving} className="btn">
              {saving
                ? 'Speichere...'
                : mode === 'edit'
                  ? 'Änderungen speichern'
                  : 'Artikel speichern'}
            </button>

            <button
              type="button"
              className="btn-secondary"
              onClick={() => router.push('/products')}
            >
              Abbrechen
            </button>
          </div>
        </section>
      </form>
    </>
  );
}
