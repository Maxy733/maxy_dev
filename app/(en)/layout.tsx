import type { ReactNode } from 'react';
import { englishMetadata, SiteShell } from '../site-layout';

export const metadata = englishMetadata;

export default function EnglishLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body><SiteShell locale="en">{children}</SiteShell></body>
    </html>
  );
}
