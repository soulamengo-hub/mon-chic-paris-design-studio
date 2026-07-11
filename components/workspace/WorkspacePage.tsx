import Link from 'next/link';
import { Nav } from '../Nav';

type Item = { title: string; text: string; href: string; icon: string };

export function WorkspacePage({
  kicker,
  title,
  intro,
  items,
}: {
  kicker: string;
  title: string;
  intro: string;
  items: Item[];
}) {
  return (
    <>
      <Nav />
      <main className="workspace-main">
        <section className="workspace-hero">
          <div className="kicker">{kicker}</div>
          <h1>{title}</h1>
          <p>{intro}</p>
        </section>
        <section className="module-grid">
          {items.map((item) => (
            <Link key={item.title} href={item.href} className="module-card">
              <span className="module-icon">{item.icon}</span>
              <h2>{item.title}</h2>
              <p>{item.text}</p>
              <strong>Öffnen →</strong>
            </Link>
          ))}
        </section>
      </main>
    </>
  );
}
