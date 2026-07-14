import { WorkspacePage } from '../../components/workspace/WorkspacePage';
export default function AnalyticsPage() {
  return <WorkspacePage kicker="MON CHIC PARIS" title="Analytics" intro="Umsatz, Gewinn, Lager, Trends, Designer-Level, Stil und Saison analysieren." items={[
    { icon:'↗', title:'Business Intelligence', text:'Kennzahlen und Bestandsauswertung öffnen.', href:'/business-intelligence' },
    { icon:'⌁', title:'Trend Hunter', text:'Trends und saisonale Chancen analysieren.', href:'/trend-hunter' },
    { icon:'€', title:'Finanzen', text:'Ausgaben und Gewinnentwicklung prüfen.', href:'/accounting' },
  ]}/>;
}
