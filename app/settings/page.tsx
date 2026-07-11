import { WorkspacePage } from '../../components/workspace/WorkspacePage';
export default function SettingsPage() {
  return <WorkspacePage kicker="MON CHIC PARIS" title="Einstellungen" intro="Benutzer, Sprachen, KI, Supabase, OpenAI, Etiketten, QR-Code und Backup." items={[
    { icon:'⚙', title:'Systemstatus', text:'Vercel, Supabase und spätere KI-Verbindungen prüfen.', href:'/settings' },
    { icon:'⌑', title:'Etiketten & QR-Code', text:'Druckformat und Scan-Funktionen vorbereiten.', href:'/labels' },
    { icon:'DE', title:'Sprachen', text:'Deutsch, Englisch und Französisch verwalten.', href:'/settings' },
  ]}/>;
}
