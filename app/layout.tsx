import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import '@fontsource-variable/inter';
import { SiteHeader } from './components/site-header';
import './globals.css';

export const metadata: Metadata = {
  title: { default: 'Max Tay Za | Data Science & Applied AI', template: '%s | Max Tay Za' },
  description: 'The data science and applied AI portfolio of Kyaw “Max” Tay Za in Bangkok.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <a className="skip-link" href="#main">Skip to content</a>
        <SiteHeader />
        {children}
      </body>
    </html>
  );
}
