'use client';

import { usePathname } from 'next/navigation';
import type { MouseEvent } from 'react';
import { localizedPath, ui, type Locale } from '../locale';

const languageKey = 'maxy-language';
const languages = [
  { code: 'en', label: 'ENG', name: 'English' },
  { code: 'th', label: 'ไทย', name: 'ภาษาไทย' },
] as const;

export function SettingsLanguage({ locale }: { locale: Locale }) {
  const pathname = usePathname();

  function selectLanguage(event: MouseEvent<HTMLAnchorElement>, code: Locale) {
    if (code === locale) {
      event.preventDefault();
      return;
    }
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    try {
      window.localStorage.setItem(languageKey, code);
    } catch {
      // The selected URL still determines the language.
    }
    const { search, hash } = window.location;
    if (search || hash) {
      event.preventDefault();
      window.location.assign(event.currentTarget.href + search + hash);
    }
  }

  return (
    <div className="nav-settings-language">
      <span id="settings-language-label">{ui[locale].language}</span>
      <div className="language-cartridge" role="group" aria-labelledby="settings-language-label">
        {languages.map(({ code, label, name }) => (
          <a key={code} href={localizedPath(pathname, code)} lang={code} hrefLang={code}
            aria-label={name} aria-current={locale === code ? 'page' : undefined}
            onClick={(event) => selectLanguage(event, code)}>
            {label}
          </a>
        ))}
      </div>
    </div>
  );
}
