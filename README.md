# MON CHIC PARIS

## DESIGN STUDIO

**Fashion. Creativity. Innovation.**  
**Luxury Fashion meets Digital Innovation**


## Release 2.0.1 · Design System

Dieses Paket führt das neue Corporate Design ein:

- neues MON CHIC PARIS Logo
- Midnight Blue, Champagne Gold, Ivory und Dark Brown
- Cormorant Garamond für Überschriften, Inter für Oberfläche und Tabellen
- neue Hauptnavigation: Dashboard, Fashion, Design Studio, KI Studio, Business, Analytics, Einstellungen
- neues Dashboard mit vier Workspaces und Schnellaktionen
- responsive Darstellung für Browser und iPhone
- vorhandene Datenbank-, API- und Fachlogik bleibt erhalten

## Installation über GitHub

1. Vorher das vorhandene Repository als ZIP sichern.
2. Dateien dieses Pakets in das bestehende Repository hochladen und vorhandene Dateien ersetzen.
3. Commit-Nachricht: `Release 2.0.1 - Mon Chic Design System V2`
4. Vercel baut die App automatisch neu.
5. Dashboard, Artikel, Neuer Artikel, Etiketten und Buchhaltung testen.

## Environment Variables in Vercel

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Die Supabase URL muss in der Form `https://PROJECT.supabase.co` eingetragen sein – ohne `/rest/v1/`.

## Umfang dieses Releases

Dieses Release verändert das Erscheinungsbild und die Navigation. Datenbankänderungen wie das neue Feld `style_key` folgen in Release 2.1, damit jede Stufe separat getestet werden kann.
