import Link from 'next/link';
import { resumePath } from '../projects';

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="shell header-inner">
        <Link className="brand" href="/" aria-label="Max Tay Za, home">
          <span className="brand-mark" aria-hidden="true">M</span>
          <span>Max Tay Za</span>
        </Link>
        <nav className="site-nav" aria-label="Main navigation">
          <Link href="/#work">Work</Link>
          <Link href="/#about">About</Link>
          <Link href="/#contact">Contact</Link>
          <Link className="nav-resume" href={resumePath}>Résumé</Link>
        </nav>
      </div>
    </header>
  );
}
