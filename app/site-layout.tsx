import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import '@fontsource-variable/space-grotesk';
import { SectionNavigation } from './components/section-navigation';
import { SiteHeader } from './components/site-header';
import { ui, type Locale } from './locale';
import './globals.css';

export const englishMetadata: Metadata = {
  title: { default: 'Kyaw Tay Za | Data Science & Applied AI', template: '%s | Kyaw Tay Za' },
  description: 'The data science and applied AI portfolio of Kyaw Tay Za (Maxy), based in Bangkok.',
};

export function SiteShell({ children, locale }: { children: ReactNode; locale: Locale }) {
  return (
    <>
      <SectionNavigation locale={locale} />
      <a className="skip-link" href="#main">{ui[locale].skip}</a>
      <SiteHeader locale={locale} />
      {children}
    </>
  );
}
