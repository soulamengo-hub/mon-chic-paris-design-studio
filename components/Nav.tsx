'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  ['⌂', 'Dashboard', '/'],
  ['♛', 'Fashion', '/fashion'],
  ['◉', 'Design Studio', '/design-studio'],
  ['✦', 'KI Studio', '/ai-studio'],
  ['▦', 'Business', '/business'],
  ['↗', 'Analytics', '/analytics'],
  ['⚙', 'Einstellungen', '/settings'],
] as const;

export function Nav() {
  const pathname = usePathname();

  return (
    <header className="top-nav no-print">
      <div className="nav-shell">
        <Link href="/" className="brand" aria-label="MON CHIC PARIS – Design Studio">
          <Image
            src="/mon-chic-paris-logo-v2.png"
            alt="MON CHIC PARIS – Design Studio"
            width={118}
            height={118}
            priority
            className="brand-logo"
          />

          <div className="brand-text">
            <div className="brand-title">MON CHIC PARIS</div>
            <div className="brand-studio">DESIGN STUDIO</div>
            <div className="brand-tagline">Fashion. Creativity. Innovation.</div>
            <div className="brand-subtitle">Luxury Fashion meets Digital Innovation</div>
          </div>
        </Link>

        <div className="header-tools" aria-label="Kopfbereich">
          <span className="header-tool">DE</span>
          <span className="header-tool" title="Benachrichtigungen">●</span>
          <span className="profile-chip" title="Profil">V</span>
        </div>
      </div>

      <nav className="nav-links" aria-label="Hauptnavigation">
        {links.map(([icon, label, href]) => {
          const active = href === '/' ? pathname === '/' : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`nav-link${active ? ' is-active' : ''}`}
            >
              <span className="nav-icon" aria-hidden="true">{icon}</span>
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
