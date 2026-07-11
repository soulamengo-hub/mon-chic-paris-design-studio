import { WorkspacePage } from '../../components/workspace/WorkspacePage';
export default function DesignStudioPage() {
  return <WorkspacePage kicker="MON CHIC PARIS" title="Design Studio" intro="Content, Branding und Website-Kommunikation im einheitlichen Mon-Chic-Look." items={[
    { icon:'◉', title:'Content Studio', text:'Social-Media- und Verkaufstexte entwickeln.', href:'/content-studio' },
    { icon:'✎', title:'Branding', text:'Logo, Farben, Schriften und Corporate Design.', href:'/design-studio' },
    { icon:'⌂', title:'Website', text:'Landingpages, Texte, Bilder und SEO vorbereiten.', href:'/design-studio' },
  ]}/>;
}
