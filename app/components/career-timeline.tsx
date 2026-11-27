'use client';

import { useEffect, useRef, type CSSProperties } from 'react';
import { connectCareerKnight } from './career-knight';

const milestones = [
  {
    label: 'November 2023',
    dateTime: '2023-11',
    title: 'Began Studying Computer Science',
    detail: 'Assumption University',
    marker: 'flag',
  },
  {
    label: 'Senior Project 1',
    title: 'Libby Bot Library AI',
    detail: 'AI book recommendations',
    href: '/work/libby-bot?from=career',
    marker: 'crt',
  },
  {
    label: 'Senior Project 2',
    title: 'AU Document Wallet',
    detail: 'Digital credentials',
    href: '/work/au-document-wallet?from=career',
    marker: 'wallet',
  },
  {
    label: 'November 2026',
    dateTime: '2026-11',
    title: 'Earned a B.Sc. in Computer Science',
    detail: 'GPA 3.66',
    marker: 'destination',
  },
];

export function CareerTimeline() {
  const frame = useRef<HTMLDivElement>(null);
  const knight = useRef<HTMLSpanElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const traveler = useRef<ReturnType<typeof connectCareerKnight>>(null);

  useEffect(() => {
    if (!frame.current || !knight.current || !canvas.current) return;
    const walker = connectCareerKnight(frame.current, knight.current, canvas.current);
    traveler.current = walker;
    return () => {
      walker?.disconnect();
      traveler.current = null;
    };
  }, []);

  function visitStop(index: number) {
    traveler.current?.visit(index);
  }

  return (
    <div className="career-map-frame" ref={frame}>
      <ol className="career-map" role="list" aria-label="Career timeline">
        {milestones.map(({ label, dateTime, title, detail, href, marker }, index) => (
          <li className="career-stop" key={title} style={{ '--stop-order': index } as CSSProperties}
            onPointerEnter={() => visitStop(index)} onFocus={() => visitStop(index)}>
            <span className="career-marker" data-marker={marker} aria-hidden="true" />
            <div className="career-stop-copy">
              {dateTime ? <time dateTime={dateTime}>{label}</time> : <span>{label}</span>}
              <h3>{href ? <a className="text-link" href={href}>{title}</a> : title}</h3>
              <p>{detail}</p>
            </div>
          </li>
        ))}
      </ol>
      <span className="career-knight" ref={knight} aria-hidden="true">
        <canvas width={60} height={56} ref={canvas} />
      </span>
    </div>
  );
}
