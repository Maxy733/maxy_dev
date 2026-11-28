'use client';

import { ui, type Locale } from '../locale';
import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';

export function ArticleCarousel({ children, locale }: { children: ReactNode; locale: Locale }) {
  const track = useRef<HTMLUListElement>(null);
  const [canGoBack, setCanGoBack] = useState(false);
  const [canGoForward, setCanGoForward] = useState(false);

  const updateControls = useCallback(() => {
    const list = track.current;
    if (!list) return;
    setCanGoBack(list.scrollLeft > 1);
    setCanGoForward(list.scrollLeft + list.clientWidth < list.scrollWidth - 1);
  }, []);

  const scrollOneCard = useCallback((direction: -1 | 1) => {
    const list = track.current;
    const first = list?.children[0];
    const second = list?.children[1];
    if (!list || !first || !second) return;

    const step = second.getBoundingClientRect().left - first.getBoundingClientRect().left;
    list.scrollBy({ left: direction * step });
  }, []);

  useEffect(() => {
    const list = track.current;
    if (!list) return;
    const observer = new ResizeObserver(updateControls);
    observer.observe(list);
    updateControls();

    let nextWheelStep = 0;
    function onWheel(event: WheelEvent) {
      if (!list || !event.cancelable || event.defaultPrevented || event.ctrlKey || event.shiftKey
        || !event.deltaY || Math.abs(event.deltaX) >= Math.abs(event.deltaY)) return;

      const direction = event.deltaY > 0 ? 1 : -1;
      const atEnd = list.scrollLeft + list.clientWidth >= list.scrollWidth - 1;
      if (direction === 1 ? atEnd : list.scrollLeft <= 1) return;

      event.preventDefault();
      if (event.timeStamp < nextWheelStep) return;
      nextWheelStep = event.timeStamp + 300;
      scrollOneCard(direction);
    }

    list.addEventListener('wheel', onWheel, { passive: false });
    return () => {
      observer.disconnect();
      list.removeEventListener('wheel', onWheel);
    };
  }, [scrollOneCard, updateControls]);

  return (
    <>
      <div className="article-carousel-heading">
        <h2 id="selected-title">{ui[locale].articles}</h2>
        <div className="article-carousel-controls">
          <button type="button" aria-label={ui[locale].previousArticle} aria-controls="article-carousel-track" disabled={!canGoBack} onClick={() => scrollOneCard(-1)}>
            <span aria-hidden="true">←</span>
          </button>
          <button type="button" aria-label={ui[locale].nextArticle} aria-controls="article-carousel-track" disabled={!canGoForward} onClick={() => scrollOneCard(1)}>
            <span aria-hidden="true">→</span>
          </button>
        </div>
      </div>
      <ul
        id="article-carousel-track"
        className="article-carousel-track"
        role="list"
        aria-labelledby="selected-title"
        tabIndex={0}
        ref={track}
        onScroll={updateControls}
      >
        {children}
      </ul>
    </>
  );
}
