import Link from 'next/link';
import { resumePath } from '../projects';
import { SiteBrand } from './site-brand';

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="shell header-inner">
        <SiteBrand />
        <nav className="site-nav" aria-label="Main navigation">
          <Link href="/#projects" data-arcade-zoom>Work</Link>
          <Link href="/#career" data-career-tv>Career</Link>
          <Link href="/#articles">Articles</Link>
          <Link href="/#about">About</Link>
          <Link className="nav-resume" href={resumePath}>Résumé</Link>
        </nav>
      </div>
    </header>
  );
}
