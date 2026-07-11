'use client';

import { ChangeEvent, useMemo, useState } from 'react';
import Link from 'next/link';
import { Nav } from '../../components/Nav';

export default function ProductCapturePage() {
  const [note, setNote] = useState('');
  const [result, setResult] = useState('');
  const [files, setFiles] = useState<File[]>([]);

  const previews = useMemo(
    () => files.map((file) => ({ file, url: URL.createObjectURL(file) })),
    [files]
  );

  function handleFiles(event: ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(event.target.files || []).slice(0, 9);
    setFiles(selected);
    setResult('');
  }

  function removeFile(index: number) {
    setFiles((current) => current.filter((_, itemIndex) => itemIndex !== index));
  }

  function analyze() {
    if (!files.length) {
      setResult('Bitte zuerst mindestens ein Foto hochladen.');
      return;
    }

    setResult(
      `${files.length} Foto(s) vorbereitet. Als nächster Schritt analysiert die KI Kategorie, Farbe, Muster, Material und Stil. Designer-Level und Echtheit bleiben immer zur manuellen Bestätigung.`
    );
  }

  return (
    <>
      <Nav />
      <main className="mx-auto max-w-7xl p-6 space-y-5">
        <section className="hero-card">
          <div>
            <div className="kicker">Mon Chic KI Studio</div>
            <h1>KI-Produktaufnahme</h1>
            <p>Fotos hochladen, Vorschläge prüfen und Produktdaten vorbereiten.</p>
          </div>
        </section>

        <section className="grid md:grid-cols-2 gap-4">
          <div className="card space-y-4">
            <div className="form-section-title">1. Fotos hochladen</div>

            <label className="upload-zone">
              <span className="upload-icon">＋</span>
              <strong>Fotos auswählen</strong>
              <span>Bis zu 9 Bilder: Vorderseite, Rückseite, Etikett und Details</span>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleFiles}
                className="sr-only"
              />
            </label>

            {previews.length > 0 && (
              <div className="upload-preview-grid">
                {previews.map((preview, index) => (
                  <div className="upload-preview" key={`${preview.file.name}-${index}`}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={preview.url} alt={`Vorschau ${index + 1}`} />
                    <button type="button" onClick={() => removeFile(index)}>
                      Entfernen
                    </button>
                  </div>
                ))}
              </div>
            )}

            <label className="label">Zusätzliche Notizen</label>
            <textarea
              className="input min-h-40"
              value={note}
              onChange={(event) => setNote(event.target.value)}
              placeholder="Beispiel: Originalgröße 12 UK, kleine Gebrauchsspur am Saum ..."
            />

            <button className="btn" type="button" onClick={analyze}>
              KI-Vorprüfung starten
            </button>
          </div>

          <div className="card space-y-4">
            <div className="form-section-title">2. Vorgesehene KI-Vorschläge</div>
            <ul className="capture-checklist">
              <li>Kategorie</li>
              <li>Farbe und Muster</li>
              <li>Material</li>
              <li>Saison</li>
              <li>Stilrichtung</li>
              <li>Produkttitel und Beschreibung</li>
              <li>SEO und Übersetzungen</li>
            </ul>

            <div className="capture-note">
              Designer-Level, Echtheit und endgültiger Zustand werden nicht automatisch festgelegt. Diese Angaben bestätigst du selbst.
            </div>

            <div className="result-box">
              {result || 'Noch keine Vorprüfung gestartet.'}
            </div>

            <Link className="btn" href="/products/new">
              Zum Artikel-Formular
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
