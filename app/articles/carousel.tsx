'use client';

import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';

export function ArticleCarousel({ children }: { children: ReactNode }) {
  const track = useRef<HTMLUListElement>(null);
  const [canGoBack, setCanGoBack] = useState(false);
  const [canGoForward, setCanGoForward] = useState(false);

  const updateControls = useCallback(() => {
    const list = track.current;
    if (!list) return;
    setCanGoBack(list.scrollLeft > 1);
    setCanGoForward(list.scrollLeft + list.clientWidth < list.scrollWidth - 1);
  }, []);

  useEffect(() => {
    const list = track.current;
    if (!list) return;
    const observer = new ResizeObserver(updateControls);
    observer.observe(list);
    updateControls();
    return () => observer.disconnect();
  }, [updateControls]);

  function scrollOneCard(direction: -1 | 1) {
    const list = track.current;
    const first = list?.children[0];
    const second = list?.children[1];
    if (!list || !first || !second) return;

    const step = second.getBoundingClientRect().left - first.getBoundingClientRect().left;
    list.scrollBy({ left: direction * step });
  }

  return (
    <>
      <div className="article-carousel-heading">
        <h2 id="selected-title">Articles</h2>
        <div className="article-carousel-controls">
          <button type="button" aria-label="Previous articles" aria-controls="article-carousel-track" disabled={!canGoBack} onClick={() => scrollOneCard(-1)}>
            <span aria-hidden="true">←</span>
          </button>
          <button type="button" aria-label="Next articles" aria-controls="article-carousel-track" disabled={!canGoForward} onClick={() => scrollOneCard(1)}>
            <span aria-hidden="true">→</span>
          </button>
        </div>
      </div>
      <ul id="article-carousel-track" className="article-carousel-track" role="list" ref={track} onScroll={updateControls}>
        {children}
      </ul>
    </>
  );
}
