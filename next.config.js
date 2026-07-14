# MON CHIC PARIS – Clean Start 2.1.2

Dieses Paket ist die bereinigte, getestete Projektbasis.

## Enthalten
- saubere Next.js-Struktur
- neues MON CHIC PARIS Branding
- Fashion, Design Studio, KI Studio, Business und Analytics
- Produktformular und Artikel-DNA-Migration
- Supabase REST-Anbindung
- keine losen `page (x).tsx`, `route (x).ts` oder doppelten Root-Dateien

## Empfohlene Installation
1. In GitHub ein neues privates Repository erstellen: `MonChic_PARIS_CLEAN_V2`.
2. Den Inhalt dieses Ordners hochladen, nicht den übergeordneten ZIP-Ordner.
3. In Vercel ein neues Projekt aus diesem Repository importieren.
4. In Vercel diese Environment Variables setzen:
   - `NEXT_PUBLIC_SUPABASE_URL` = vollständige Projekt-URL ohne `/rest/v1`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = Supabase anon/publishable key
5. Deploy starten.
6. Erst nach erfolgreichem Test das alte Vercel-Projekt stilllegen.

## Datenbank
Die bestehende Supabase-Datenbank bleibt unverändert. Es wird keine neue Datenbank benötigt.

## Build-Test
Getestet mit:
- `npm ci`
- `npm run build`

Der Production-Build war erfolgreich.
