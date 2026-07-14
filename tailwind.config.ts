# MON CHIC PARIS · Release 3.1A + 3.1B

## Neu
- Smartphone-Kamera und Mehrfachauswahl für bis zu 9 Artikelfotos
- Drag & Drop am Desktop
- Bildverkleinerung vor dem Upload
- Vorschau, Reihenfolge und Löschen
- Supabase-Storage-Bucket `product-images`
- Fotos werden eindeutig mit dem gespeicherten Artikel verknüpft
- Upload-Fortschritt beim Speichern
- vollständige zusätzliche Artikel-DNA: Unterkategorie, Nebenfarbe, Originalgröße, Größensystem, DE-Größe, internationale Größe, Maße und Mängel

## Keine KI-Kosten
Fotoaufnahme, Upload, Artikel-DNA, Größenfelder und Speicherung laufen vollständig ohne OpenAI. Die bestehende KI-Route bleibt nur ein Platzhalter und wird nicht automatisch aufgerufen.

## Vor dem GitHub-Upload
1. In Supabase den SQL Editor öffnen.
2. `supabase/migration_3_1_photo_article_dna.sql` vollständig ausführen.
3. Danach das Projekt zu GitHub hochladen.
4. Vercel-Variablen prüfen: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
5. Auf dem iPhone `/products/new` öffnen und einen Testartikel mit Fotos als Entwurf speichern.

## KI-Kostenregel für spätere Releases 3.2/3.3
- nur nach bewusstem Klick
- Bildanalyse und Textgenerierung getrennt
- Ergebnisse speichern und wiederverwenden
- internes Kostenprotokoll
- externe OpenAI-Obergrenze 25 € pro Monat
