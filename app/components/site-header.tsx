import Link from 'next/link';
import { localizedPath, ui, type Locale } from '../locale';
import { resumePath } from '../projects';
import { ArcadeMotionToggle } from './arcade-motion-toggle';
import { SettingsLanguage } from './settings-language';
import { SiteBrand } from './site-brand';

export function SiteHeader({ locale }: { locale: Locale }) {
  const text = ui[locale];
  const home = localizedPath('/', locale);
  return (
    <header className="site-header">
      <div className="shell header-inner">
        <SiteBrand locale={locale} />
        <nav className="site-nav" aria-label={text.navigation}>
          <Link href={home + '#projects'} data-arcade-zoom>{text.work}</Link>
          <Link href={home + '#career'} data-career-tv>{text.career}</Link>
          <Link className="nav-articles" href={home + '#articles'}>{text.articles}</Link>
          <Link href={home + '#about'}>{text.about}</Link>
          <Link className="nav-resume" href={localizedPath(resumePath, locale)}>{text.résumé}</Link>
          <button
            className="nav-settings"
            type="button"
            aria-label={text.settings}
            title={text.settings}
            popoverTarget="site-settings"
          >
            <span className="nav-settings-gear" aria-hidden="true" />
          </button>
          <div className="nav-settings-popup" id="site-settings" popover="auto">
            <h2>{text.settings}</h2>
            <ArcadeMotionToggle label={text.motion} />
            <SettingsLanguage locale={locale} />
          </div>
        </nav>
      </div>
    </header>
  );
}
