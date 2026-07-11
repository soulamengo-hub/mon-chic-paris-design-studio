import { WorkspacePage } from '../../components/workspace/WorkspacePage';
export default function FashionPage() {
  return <WorkspacePage kicker="MON CHIC PARIS" title="Fashion" intro="Vintage Luxury, Artikel, Lager, Etiketten und Verkäufe in einem Workspace." items={[
    { icon:'♛', title:'Artikel', text:'Bestand durchsuchen, bearbeiten und verwalten.', href:'/products' },
    { icon:'＋', title:'Neuer Artikel', text:'Einen neuen Vintage-Artikel erfassen.', href:'/products/new' },
    { icon:'⌑', title:'Etiketten', text:'Etiketten und spätere QR-Codes drucken.', href:'/labels' },
    { icon:'↗', title:'Trend Hunter', text:'Saison- und Trendanalyse für das Sortiment.', href:'/trend-hunter' },
  ]}/>;
}
