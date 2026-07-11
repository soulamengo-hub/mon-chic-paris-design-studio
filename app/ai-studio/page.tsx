import { WorkspacePage } from '../../components/workspace/WorkspacePage';
export default function AIStudioPage() {
  return <WorkspacePage kicker="MON CHIC PARIS" title="KI Studio" intro="KI-gestützte Aufnahme, Bilderkennung, Produkttexte und Übersetzungen." items={[
    { icon:'⌁', title:'KI-Aufnahme', text:'Fotos aufnehmen und Produktdaten vorbereiten.', href:'/product-capture' },
    { icon:'✦', title:'Produktanalyse', text:'Kategorie, Farbe, Material und Stil vorschlagen.', href:'/product-capture' },
    { icon:'T', title:'Texte & SEO', text:'Titel, Beschreibung und Keywords erzeugen.', href:'/content-studio' },
  ]}/>;
}
