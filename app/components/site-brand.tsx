'use client';

import { localizedPath, ui, type Locale } from '../locale';
import Link from 'next/link';
import type { PointerEvent } from 'react';

function positionHint(event: PointerEvent<HTMLAnchorElement>) {
  if (event.pointerType === 'touch') return;

  const link = event.currentTarget;
  const bounds = link.getBoundingClientRect();
  link.style.setProperty('--hint-pointer-x', `${event.clientX - bounds.left + 14}px`);
  link.style.setProperty('--hint-pointer-y', `${event.clientY - bounds.top + 14}px`);
  link.dataset.pointerHint = '';
}

export function SiteBrand({ locale }: { locale: Locale }) {
  return (
    <Link className="brand" href={localizedPath('/', locale)} data-arcade-home aria-label={ui[locale].brandHome} aria-describedby="site-brand-role"
      onPointerEnter={positionHint} onPointerMove={positionHint}
      onPointerLeave={(event) => { delete event.currentTarget.dataset.pointerHint; }}>
      <span className="brand-mark" aria-hidden="true">@</span>
      <span className="brand-name">Kyaw Tay Za</span>
      <span className="arcade-hotspot-hint brand-hint" id="site-brand-role" role="tooltip">{ui[locale].brandRole}</span>
    </Link>
  );
}
