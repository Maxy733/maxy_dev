'use client';

import { useEffect, useState } from 'react';

export function ArticleBackToTop({ label }: { label: string }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const introduction = document.getElementById('introduction-title');
    if (!introduction) return;

    let readingTop = 0;
    const updateVisibility = () => setVisible(introduction.getBoundingClientRect().top <= readingTop + 1);
    const updateViewport = () => {
      readingTop = Number.parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
      updateVisibility();
    };

    updateViewport();
    window.addEventListener('scroll', updateVisibility, { passive: true });
    window.addEventListener('resize', updateViewport);
    return () => {
      window.removeEventListener('scroll', updateVisibility);
      window.removeEventListener('resize', updateViewport);
    };
  }, []);

  if (!visible) return null;

  return (
    <div className="article-back-top-float">
      <a className="primary-action article-back-top" href="#main" aria-label={label}>
        <span aria-hidden="true">↑</span>
        <span className="article-back-top-label">{label}</span>
      </a>
    </div>
  );
}
