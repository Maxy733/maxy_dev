'use client';

import { localizedPath, type Locale } from '../locale';
import { usePathname, useRouter } from 'next/navigation';
import { useCallback, useEffect, useLayoutEffect, useRef } from 'react';
import { connectArcadeScroll } from './arcade-zoom';
import { skipsArcadeZoom } from './arcade-motion-preference';
import { playCareerTv } from './career-tv';
import { caseStudyTransitionType } from './case-study-match';
import { getCaseStudyReturn, setCaseStudyReturn } from './case-study-return';

const homeSections = new Set(['projects', 'work', 'career', 'articles', 'about', 'contact']);
type SectionTransition = 'projects' | 'career' | null;
type SectionAnimation = { destination: NonNullable<SectionTransition> | 'home'; cancel: () => void };

function isWorkActive() {
  const work = document.getElementById('projects')?.getBoundingClientRect();
  const headerBottom = document.querySelector('.site-header')?.getBoundingClientRect().bottom ?? 0;
  return !!work && work.top <= headerBottom + 28 && work.bottom > (headerBottom + window.innerHeight) / 2;
}

function isCareerVisible() {
  const career = document.getElementById('career')?.getBoundingClientRect();
  const title = document.getElementById('career-title')?.getBoundingClientRect();
  if (!career || !title) return false;
  const headerBottom = document.querySelector('.site-header')?.getBoundingClientRect().bottom ?? 0;
  return title.top < window.innerHeight && career.bottom > headerBottom;
}

function isLowerHomeSectionActive() {
  const headerBottom = document.querySelector('.site-header')?.getBoundingClientRect().bottom ?? 0;
  const viewportMiddle = (headerBottom + window.innerHeight) / 2;
  return ['articles', 'about'].some((id) => {
    const bounds = document.getElementById(id)?.closest('section')?.getBoundingClientRect();
    return !!bounds && bounds.top <= viewportMiddle && bounds.bottom > headerBottom;
  });
}

function scrollToSection(id: string, behavior: ScrollBehavior = 'auto', preserveHash = false) {
  const section = document.getElementById(id);
  if (!section) return false;

  if (!section.hasAttribute('tabindex')) section.tabIndex = -1;
  section.focus({ preventScroll: true });
  section.scrollIntoView({ behavior, block: 'start' });

  const { pathname, search, hash } = window.location;
  if (hash && !preserveHash) window.history.replaceState(window.history.state, '', pathname + search);

  return true;
}

export function SectionNavigation({ locale }: { locale: Locale }) {
  const home = localizedPath('/', locale);
  const pathname = usePathname();
  const router = useRouter();
  const pendingSection = useRef<{ id: string; transition: SectionTransition } | null>(null);
  const arcadeScroll = useRef<ReturnType<typeof connectArcadeScroll>>(null);
  const sectionAnimation = useRef<SectionAnimation | null>(null);

  const startHome = useCallback(() => {
    if (sectionAnimation.current?.destination === 'home') return;
    sectionAnimation.current?.cancel();

    const enterHome = () => { scrollToSection('main', 'instant'); };
    const finish = () => { sectionAnimation.current = null; };
    const fromLowerSection = isLowerHomeSectionActive();
    const fromWork = !fromLowerSection && isWorkActive();
    if (!fromLowerSection && !fromWork && isCareerVisible()) {
      const cancel = playCareerTv({
        reverse: true,
        prepare: () => arcadeScroll.current?.skip(),
        arrive: enterHome,
        finish,
      });
      if (cancel) {
        sectionAnimation.current = { destination: 'home', cancel };
        return;
      }
    }

    const cancel = arcadeScroll.current?.returnHome(() => {
      finish();
      enterHome();
    }, fromWork);
    if (cancel) {
      sectionAnimation.current = { destination: 'home', cancel: () => { cancel(); finish(); } };
    } else {
      enterHome();
    }
  }, []);

  const startWork = useCallback(() => {
    const enterWork = () => scrollToSection('projects', 'instant');
    if (!arcadeScroll.current?.start(enterWork, true)) enterWork();
  }, []);

  const startCareer = useCallback(() => {
    if (sectionAnimation.current) return true;
    const cancel = playCareerTv({
      prepare: () => arcadeScroll.current?.skip(),
      arrive: () => {
        arcadeScroll.current?.skip();
        scrollToSection('career', 'instant');
      },
      finish: () => { sectionAnimation.current = null; },
    });
    if (!cancel) return false;
    sectionAnimation.current = { destination: 'career', cancel };
    return true;
  }, []);

  const startAfterHome = useCallback((destination: NonNullable<SectionTransition>, fromWork = false) => {
    const cancel = arcadeScroll.current?.returnHome(() => {
      sectionAnimation.current = null;
      if (destination === 'projects') {
        startWork();
      } else if (!startCareer()) {
        arcadeScroll.current?.skip();
        scrollToSection('career', 'instant');
      }
    }, fromWork);
    if (!cancel) return false;
    sectionAnimation.current = {
      destination,
      cancel: () => {
        cancel();
        sectionAnimation.current = null;
      },
    };
    return true;
  }, [startCareer, startWork]);

  useLayoutEffect(() => {
    if (pathname === home && getCaseStudyReturn()) scrollToSection('projects', 'instant');
  }, [home, pathname]);

  useEffect(() => {
    function scrollToFragment() {
      const id = window.location.hash.slice(1);
      if (id) scrollToSection(id, 'instant', true);
    }

    const pending = pendingSection.current;
    if (pathname === home && getCaseStudyReturn()) {
      setCaseStudyReturn(null);
    } else if (pathname === home && pending) {
      if (pending.id === 'career' && !pending.transition) {
        const career = document.getElementById('career');
        if (career) career.dataset.tvEntry = 'settled';
      }
      if (!pending.transition && scrollToSection(pending.id, 'instant')) pendingSection.current = null;
    } else {
      scrollToFragment();
    }

    window.addEventListener('hashchange', scrollToFragment);
    return () => window.removeEventListener('hashchange', scrollToFragment);
  }, [home, pathname]);

  useEffect(() => {
    if (pathname !== home) return;
    const controller = connectArcadeScroll(() => {
      if (sectionAnimation.current) return false;
      return skipsArcadeZoom() ? startCareer() : startAfterHome('career', true);
    });
    arcadeScroll.current = controller;
    const pending = pendingSection.current;
    if (pending?.transition) {
      pendingSection.current = null;
      const enterSection = () => scrollToSection(pending.id, 'instant');
      if (pending.transition === 'projects') {
        if (!controller?.start(enterSection, true)) enterSection();
      } else if (!startCareer()) {
        controller?.skip();
        enterSection();
      }
    }
    return () => {
      sectionAnimation.current?.cancel();
      controller?.disconnect();
      arcadeScroll.current = null;
    };
  }, [home, pathname, startAfterHome, startCareer]);

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      if (!(event.target instanceof Element)) return;

      const link = event.target.closest<HTMLAnchorElement>('a[href]');
      if (!link || link.hasAttribute('download') || (link.target && link.target !== '_self')) return;

      const url = new URL(link.href);
      const section = url.hash.slice(1);
      const transition: SectionTransition = section === 'projects' && link.hasAttribute('data-arcade-zoom') ? 'projects'
        : section === 'career' && link.hasAttribute('data-career-tv') ? 'career' : null;
      const samePage = url.origin === window.location.origin && url.pathname === window.location.pathname;
      if (samePage && url.pathname === home && link.hasAttribute('data-arcade-home')) {
        event.preventDefault();
        startHome();
        return;
      }
      if (samePage && transition && sectionAnimation.current?.destination === transition) {
        event.preventDefault();
        return;
      }
      const fromLowerSection = samePage && transition !== null && isLowerHomeSectionActive();
      if (samePage && transition === 'career' && !fromLowerSection && isCareerVisible()) {
        event.preventDefault();
        return;
      }
      sectionAnimation.current?.cancel();
      if (!section || url.origin !== window.location.origin) return;

      if (samePage) {
        if (transition && fromLowerSection && startAfterHome(transition)) {
          event.preventDefault();
          return;
        }
        if (transition === 'career' && (startAfterHome('career', true) || startCareer())) {
          event.preventDefault();
          return;
        }
        if (transition === 'projects' && !fromLowerSection && isCareerVisible()) {
          const cancel = playCareerTv({
            reverse: true,
            prepare: () => arcadeScroll.current?.skip(),
            arrive: startWork,
            finish: () => { sectionAnimation.current = null; },
          });
          if (cancel) {
            sectionAnimation.current = { destination: 'projects', cancel };
            event.preventDefault();
            return;
          }
        }
        if (section !== 'projects' && (section !== 'main' || window.scrollY > 0)) arcadeScroll.current?.skip();
        const zoomed = transition === 'projects' && arcadeScroll.current?.start(() => scrollToSection(section, 'instant'));
        if (zoomed || scrollToSection(section, transition && skipsArcadeZoom() ? 'instant' : 'auto')) event.preventDefault();
      } else if (url.pathname === home && homeSections.has(section)) {
        event.preventDefault();
        const project = link.dataset.caseStudyProject;
        const fromCareer = !!project && new URLSearchParams(window.location.search).get('from') === 'career';
        const returningProject = fromCareer ? null : project ?? null;
        setCaseStudyReturn(returningProject);
        pendingSection.current = returningProject ? null : { id: fromCareer ? 'career' : section, transition };
        router.push(url.pathname + url.search, {
          scroll: false,
          transitionTypes: returningProject ? [caseStudyTransitionType] : undefined,
        });
      }
    }

    // Handle section links before Next.js writes a fragment to the address bar.
    document.addEventListener('click', handleClick, true);
    return () => document.removeEventListener('click', handleClick, true);
  }, [home, router, startAfterHome, startCareer, startHome, startWork]);

  return null;
}
