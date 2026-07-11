import { WorkspacePage } from '../../components/workspace/WorkspacePage';
export default function BusinessPage() {
  return <WorkspacePage kicker="MON CHIC PARIS" title="Business" intro="Finanzen, Buchhaltung, Projekte und zukünftige Business Apps." items={[
    { icon:'€', title:'Buchhaltung', text:'Ausgaben, Belege und finanzielle Übersicht.', href:'/accounting' },
    { icon:'▦', title:'Business Intelligence', text:'Bestand, Umsatz und Performance auswerten.', href:'/business-intelligence' },
    { icon:'⌘', title:'Business Apps', text:'Zukünftige App-Lösungen für Kunden verwalten.', href:'/business' },
  ]}/>;
}
