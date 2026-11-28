import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { SiteShell } from '../site-layout';

export const metadata: Metadata = {
  title: { default: 'Kyaw Tay Za | วิทยาการข้อมูลและ AI ประยุกต์', template: '%s | Kyaw Tay Za' },
  description: 'พอร์ตโฟลิโอด้านวิทยาการข้อมูลและ AI ประยุกต์ของ Kyaw Tay Za (Maxy) ในกรุงเทพฯ',
};

export default function ThaiLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="th" data-scroll-behavior="smooth">
      <body><SiteShell locale="th">{children}</SiteShell></body>
    </html>
  );
}
