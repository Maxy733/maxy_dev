'use client';

import Link from 'next/link';
import { useCallback, useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore, type CSSProperties } from 'react';
import { localizedPath, ui, type Locale } from '../locale';
import type { Project, ProjectImage } from '../projects';
import { skipsArcadeZoom, subscribeToArcadeMotion } from './arcade-motion-preference';
import { CaseStudyCardMatch, caseStudyTransitionType } from './case-study-match';
import { useCaseStudyReturn } from './case-study-return';
import { ProjectPlaceholder } from './project-placeholder';
import { ProjectPreviewWindow } from './project-preview-window';
import { ProjectScreenshot } from './project-screenshot';

type CarouselProject = Pick<Project, 'slug' | 'title' | 'description' | 'visual' | 'preview'> & { screenshot?: ProjectImage };
type Direction = -1 | 1;
type TileMotion = { tileIndex: number; travel?: { x: number; y: number } };
type Rotation = TileMotion & { phase: 'leaving' | 'arriving'; direction: Direction; announce: boolean };
const rotationInterval = 8000;
const gestureThreshold = 36;
const scrollGutter = 44;

function isProjectArea(target: EventTarget | null) {
  return target instanceof Element && !!target.closest('.arcade-feature, .arcade-project-grid');
}

export function ArcadeProjects({ projects, locale }: { projects: readonly CarouselProject[]; locale: Locale }) {
  const text = ui[locale];
  const screen = useRef<HTMLElement>(null);
  const content = useRef<HTMLDivElement>(null);
  const feature = useRef<HTMLDivElement>(null);
  const wheelGesture = useRef({ lastEvent: -Infinity, distance: 0, rotated: false });
  const touchStart = useRef<{ id: number; x: number; y: number } | null>(null);
  const lastSwipe = useRef(-Infinity);
  const pendingSelection = useRef<{ projectIndex: number; button: HTMLButtonElement } | null>(null);
  const [projectOrder, setProjectOrder] = useState(() => projects.map((_, index) => index));
  const [rotation, setRotation] = useState<Rotation | null>(null);
  const [announcement, setAnnouncement] = useState('');
  const [inView, setInView] = useState(false);
  const [revealing, setRevealing] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [paused, setPaused] = useState(false);
  const [gestureScrolling, setGestureScrolling] = useState(false);
  const motionProof = useSyncExternalStore(subscribeToArcadeMotion, skipsArcadeZoom, () => false);
  const returningProject = useCaseStudyReturn();
  const [handledReturn, setHandledReturn] = useState<typeof returningProject>(null);

  // Render the returning project before the destination is captured for the match.
  if (returningProject && returningProject !== handledReturn) {
    setHandledReturn(returningProject);
    const index = projects.findIndex(({ slug }) => slug === returningProject.slug);
    if (index >= 0 && projectOrder[0] !== index) {
      setProjectOrder([index, ...projectOrder.filter((item) => item !== index)]);
      setRotation(null);
    }
  }

  const [featuredIndex, ...upcoming] = projectOrder;
  const featured = projects[featuredIndex];
  const canRotate = projectOrder.length > 1;
  const showPlayback = canRotate && (!reducedMotion || motionProof);
  const playbackLabel = motionProof ? text.rotationDisabled
    : paused ? text.play : text.pause;
  const tileTravel = rotation?.phase === 'leaving' ? rotation.travel : undefined;

  const rotate = useCallback((direction: Direction, announce: boolean, selection?: TileMotion) => {
    if (!canRotate || revealing) return;
    const tileIndex = selection?.tileIndex ?? (direction === 1 ? 0 : projectOrder.length - 2);
    setRotation((current) => current ?? { phase: 'leaving', direction, announce, tileIndex, travel: selection?.travel });
  }, [canRotate, projectOrder.length, revealing]);

  const selectProject = useCallback((projectIndex: number, button: HTMLButtonElement) => {
    if (rotation || revealing) {
      pendingSelection.current = { projectIndex, button };
      return;
    }

    const tileIndex = projectOrder.indexOf(projectIndex) - 1;
    if (tileIndex < 0) return;
    const card = feature.current?.firstElementChild?.getBoundingClientRect();
    const tile = button.getBoundingClientRect();
    const travel = card && {
      x: card.left + card.width / 2 - (tile.left + tile.width / 2),
      y: card.top + card.height / 2 - (tile.top + tile.height / 2),
    };
    rotate(1, true, { tileIndex, travel });
  }, [projectOrder, revealing, rotate, rotation]);

  useEffect(() => {
    if (rotation || revealing || !pendingSelection.current) return;
    const { projectIndex, button } = pendingSelection.current;
    pendingSelection.current = null;
    selectProject(projectIndex, button);
  }, [revealing, rotation, selectProject]);

  useEffect(() => {
    const section = screen.current;
    const panel = feature.current;
    if (!section || !panel) return;

    const visibility = new IntersectionObserver(([entry]) => setInView(entry.intersectionRatio >= .5), { threshold: .5 });
    visibility.observe(panel);

    const syncReveal = () => setRevealing(section.hasAttribute('data-arcade-entry'));
    const entrance = new MutationObserver(syncReveal);
    entrance.observe(section, { attributeFilter: ['data-arcade-entry'] });
    syncReveal();

    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const syncMotion = () => setReducedMotion(motion.matches);
    motion.addEventListener('change', syncMotion);
    syncMotion();

    return () => {
      visibility.disconnect();
      entrance.disconnect();
      motion.removeEventListener('change', syncMotion);
    };
  }, []);

  useEffect(() => {
    const section = screen.current;
    const carousel = content.current;
    const header = document.querySelector<HTMLElement>('.site-header');
    if (!section || !carousel || !header || !canRotate) return;

    const mobile = window.matchMedia('(max-width: 760px), (pointer: coarse)');
    const syncGestures = () => {
      const availableHeight = window.innerHeight - header.offsetHeight;
      const hasSideGutters = section.clientWidth - carousel.clientWidth >= scrollGutter * 2;
      setGestureScrolling(!mobile.matches && hasSideGutters && section.offsetHeight <= availableHeight + 2);
    };
    const resize = new ResizeObserver(syncGestures);
    resize.observe(section);
    resize.observe(carousel);
    resize.observe(header);
    window.addEventListener('resize', syncGestures);
    mobile.addEventListener('change', syncGestures);
    syncGestures();

    return () => {
      resize.disconnect();
      window.removeEventListener('resize', syncGestures);
      mobile.removeEventListener('change', syncGestures);
    };
  }, [canRotate]);

  useEffect(() => {
    const section = screen.current;
    if (!section || !gestureScrolling) return;

    function onWheel(event: WheelEvent) {
      if (event.ctrlKey || !isProjectArea(event.target)) return;
      const delta = Math.abs(event.deltaY) >= Math.abs(event.deltaX) ? event.deltaY : event.deltaX;
      if (!delta) return;
      event.preventDefault();

      const gesture = wheelGesture.current;
      const now = performance.now();
      if (now - gesture.lastEvent > 180) {
        gesture.distance = 0;
        gesture.rotated = false;
      }
      gesture.lastEvent = now;
      if (gesture.rotated) return;

      const units = event.deltaMode === WheelEvent.DOM_DELTA_LINE ? 16 : 1;
      gesture.distance += event.deltaMode === WheelEvent.DOM_DELTA_PAGE ? Math.sign(delta) * gestureThreshold : delta * units;
      if (Math.abs(gesture.distance) < gestureThreshold) return;
      gesture.rotated = true;
      rotate(gesture.distance > 0 ? 1 : -1, true);
    }

    section.addEventListener('wheel', onWheel, { passive: false });
    return () => section.removeEventListener('wheel', onWheel);
  }, [gestureScrolling, rotate]);

  useEffect(() => {
    if (!canRotate || !inView || revealing || reducedMotion || motionProof || paused || rotation) return;

    const timer = window.setInterval(() => {
      if (document.hidden || touchStart.current || screen.current?.querySelector('.arcade-project-content :is(a, .arcade-project-grid button, .preview-controls button):is(:hover, :focus), .arcade-feature:focus')) return;
      rotate(1, false);
    }, rotationInterval);

    return () => window.clearInterval(timer);
  }, [canRotate, inView, revealing, reducedMotion, motionProof, paused, rotate, rotation]);

  useLayoutEffect(() => {
    if (!rotation) return;
    let active = true;
    const animations = feature.current?.getAnimations?.() ?? [];

    void Promise.allSettled(animations.map((animation) => animation.finished)).then(() => {
      if (!active) return;
      if (rotation.phase === 'arriving') {
        setRotation(null);
        return;
      }

      const [previousIndex, ...queue] = projectOrder;
      const [nextIndex] = queue.splice(rotation.tileIndex, 1);
      const returnIndex = rotation.direction === 1 ? queue.length : 0;
      queue.splice(returnIndex, 0, previousIndex);
      if (document.activeElement?.closest('.arcade-project-grid [data-moving-tile]')) {
        screen.current?.querySelector<HTMLElement>('#work')?.focus({ preventScroll: true });
      }
      setProjectOrder([nextIndex, ...queue]);
      if (rotation.announce) setAnnouncement(`${text.featured}: ${projects[nextIndex].title}`);
      setRotation({ ...rotation, phase: 'arriving', tileIndex: returnIndex });
    });

    return () => { active = false; };
  }, [projectOrder, projects, rotation, text.featured]);

  if (!featured) return null;
  const readMoreLabel = text.readMore;
  const caseStudyLink = {
    href: localizedPath('/work/' + featured.slug, locale),
    transitionTypes: [caseStudyTransitionType],
    onNavigate: () => {
      pendingSelection.current = null;
      setRotation(null);
    },
  };
  const projectImage = featured.preview ?? featured.screenshot;
  const projectVisual = (
    <CaseStudyCardMatch key={featured.slug} slug={featured.slug}>
      {projectImage ? (
        <ProjectScreenshot screenshot={projectImage} />
      ) : (
        <ProjectPlaceholder visual={featured.visual ?? 'screenshot'} title={featured.title} locale={locale} />
      )}
    </CaseStudyCardMatch>
  );

  return (
    <section id="projects" className="arcade-projects" aria-label={text.projects} ref={screen}>
      <div className="arcade-project-screen">
        <div
          className="arcade-project-menu"
          data-rotation={rotation?.phase}
          data-backward={rotation?.direction === -1 || undefined}
          data-tile-selection={tileTravel ? '' : undefined}
          style={tileTravel ? { '--tile-travel-x': `${tileTravel.x}px`, '--tile-travel-y': `${tileTravel.y}px` } as CSSProperties : undefined}
          onKeyDown={(event) => {
            if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey || !canRotate) return;
            if (event.key === 'ArrowRight' || (gestureScrolling && event.key === 'ArrowDown')) {
              event.preventDefault();
              rotate(1, true);
            } else if (event.key === 'ArrowLeft' || (gestureScrolling && event.key === 'ArrowUp')) {
              event.preventDefault();
              rotate(-1, true);
            }
          }}
        >
          <div
            className="arcade-project-content"
            ref={content}
            data-carousel-scroll={gestureScrolling || undefined}
            onPointerDown={(event) => {
              if (!gestureScrolling || event.pointerType !== 'touch' || !isProjectArea(event.target)) return;
              touchStart.current = event.isPrimary ? { id: event.pointerId, x: event.clientX, y: event.clientY } : null;
            }}
            onPointerUp={(event) => {
              const start = touchStart.current;
              touchStart.current = null;
              if (!gestureScrolling || !start || start.id !== event.pointerId) return;
              const x = start.x - event.clientX;
              const y = start.y - event.clientY;
              const distance = Math.abs(x) > Math.abs(y) ? x : y;
              if (Math.abs(distance) < gestureThreshold) return;
              lastSwipe.current = performance.now();
              rotate(distance > 0 ? 1 : -1, true);
            }}
            onPointerCancel={() => { touchStart.current = null; }}
            onClickCapture={(event) => {
              if (event.detail && performance.now() - lastSwipe.current < 250) {
                event.preventDefault();
                event.stopPropagation();
              }
            }}
          >
            <article id="work" className="arcade-feature" aria-labelledby="featured-title" aria-keyshortcuts={canRotate ? (gestureScrolling ? 'ArrowLeft ArrowRight ArrowUp ArrowDown' : 'ArrowLeft ArrowRight') : undefined} tabIndex={canRotate ? 0 : undefined}>
              <div className="arcade-feature-heading">
                <p className="eyebrow">{text.featured}</p>
                <div className="arcade-feature-title" data-playback={showPlayback || undefined}>
                  <h2 id="featured-title">{featured.title}</h2>
                  {showPlayback && (
                    <button
                      className="arcade-playback-toggle"
                      type="button"
                      disabled={motionProof}
                      onClick={() => setPaused(!paused)}
                      aria-label={playbackLabel}
                    >
                      <span data-play={motionProof || paused || undefined} aria-hidden="true" />
                    </button>
                  )}
                  <div className="arcade-title-sizing" aria-hidden="true">
                    {projects.map(({ slug, title }) => <span key={slug}>{title}</span>)}
                  </div>
                </div>
              </div>
              <div className="arcade-feature-content" ref={feature}>
                {projectImage ? (
                  <ProjectPreviewWindow title={featured.title} controls={canRotate && (
                    <>
                      <button type="button" aria-label={text.previousProject} data-previous onClick={() => rotate(-1, true)} />
                      <button type="button" aria-label={text.nextProject} onClick={() => rotate(1, true)} />
                    </>
                  )}>
                    <Link {...caseStudyLink} className="arcade-preview-link" aria-label={text.readAbout + ' ' + featured.title}>
                      {projectVisual}
                    </Link>
                  </ProjectPreviewWindow>
                ) : projectVisual}
                <div className="arcade-feature-copy">
                  <div className="arcade-feature-description">
                    <p>{featured.description}</p>
                    <Link {...caseStudyLink} className="text-link">{readMoreLabel}</Link>
                  </div>
                  <div className="arcade-description-sizing" aria-hidden="true">
                    {projects.map(({ slug, description }) => <p key={slug}>{description}</p>)}
                    <span className="text-link">{readMoreLabel}</span>
                  </div>
                </div>
              </div>
            </article>
            <ul className="arcade-project-grid" aria-label={text.projectList}>
              {upcoming.map((projectIndex, index) => {
                const { slug, title } = projects[projectIndex];
                return (
                  <li key={slug} data-project-slug={slug} data-moving-tile={index === rotation?.tileIndex ? '' : undefined} style={{ '--project-order': index } as CSSProperties}>
                    <button type="button" onClick={(event) => selectProject(projectIndex, event.currentTarget)}>{title}</button>
                  </li>
                );
              })}
            </ul>
          </div>
          <p role="status" className="sr-only">{announcement}</p>
        </div>
      </div>
    </section>
  );
}
