'use client';

import { type ReactNode, useEffect, useRef } from 'react';

export function Reveal({
  children,
  className = '',
  kind = 'section',
}: {
  children: ReactNode;
  className?: string;
  kind?: 'section' | 'image';
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    if (!element || reducedMotion.matches || !('IntersectionObserver' in window)) return;

    const bounds = element.getBoundingClientRect();
    if (bounds.top < window.innerHeight && bounds.bottom > 0) {
      if (kind === 'image') element.dataset.state = 'visible';
      return;
    }
    if (bounds.bottom <= 0) return;

    element.dataset.state = 'waiting';
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry?.isIntersecting) return;
      element.dataset.state = 'visible';
      observer.disconnect();
    }, { rootMargin: '0px 0px -32px' });

    observer.observe(element);
    return () => {
      observer.disconnect();
      delete element.dataset.state;
    };
  }, [kind]);

  return (
    <div className={`reveal ${className}`} data-reveal={kind} ref={ref}>
      {children}
    </div>
  );
}
