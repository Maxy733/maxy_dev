import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import '@fontsource-variable/space-grotesk';
import { SectionNavigation } from './components/section-navigation';
import { SiteHeader } from './components/site-header';
import './globals.css';

export const metadata: Metadata = {
  title: { default: 'Kyaw Tay Za | Data Science & Applied AI', template: '%s | Kyaw Tay Za' },
  description: 'The data science and applied AI portfolio of Kyaw Tay Za (Maxy), based in Bangkok.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>
        <SectionNavigation />
        <a className="skip-link" href="#main">Skip to content</a>
        <SiteHeader />
        {children}
      </body>
    </html>
  );
}
