'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import { TerminalText, typeTerminalText } from './terminal-text';

export function TerminalReveal({ id, heading, as: List, className, children }: {
  id: string;
  heading: string;
  as: 'dl' | 'ul';
  className: string;
  children: ReactNode;
}) {
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!panel.current || !('IntersectionObserver' in window)) return;
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (motion.matches) return;

    const rows = panel.current.querySelectorAll(':scope > h2, :scope > :is(dl, ul) > *');
    const lines = panel.current.querySelectorAll<HTMLElement>('.career-terminal-text');
    const typing = new AbortController();
    let visibleRows = 0;
    const observer = new IntersectionObserver((entries) => {
      let delay = 0;
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        observer.unobserve(entry.target);
        const rowLines = Array.from(entry.target.querySelectorAll<HTMLElement>('.career-terminal-text'));
        const firstLineInterval = entry.target.tagName === 'H2' ? 40 : 24;
        void typeTerminalText(rowLines.map((line, index) => ({
          line, interval: index === 0 ? firstLineInterval : 16, delay: delay + index * 100,
        })), typing.signal, 0);
        delay += 120;
        if (++visibleRows === rows.length) observer.disconnect();
      }
    }, { rootMargin: '0px 0px -20px' });

    for (const line of lines) line.dataset.typing = 'waiting';
    for (const row of rows) observer.observe(row);
    const stop = () => {
      observer.disconnect();
      typing.abort();
      for (const line of lines) delete line.dataset.typing;
    };
    motion.addEventListener('change', stop, { once: true });
    return () => {
      motion.removeEventListener('change', stop);
      stop();
    };
  }, []);

  return (
    <div id={id} ref={panel}>
      <h2><TerminalText text={heading} /></h2>
      <List className={className}>{children}</List>
    </div>
  );
}
