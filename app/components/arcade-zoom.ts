import { skipsArcadeZoom, subscribeToArcadeMotion } from './arcade-motion-preference';

const clamp = (value: number) => Math.min(1, Math.max(0, value));
const ease = (value: number) => value * value * (3 - 2 * value);
const signalDuration = 220;

export function connectArcadeScroll(leaveWork: () => boolean) {
  const hero = document.querySelector<HTMLElement>('.hero');
  const scene = hero?.querySelector('.arcade-scene');
  const projects = document.getElementById('projects');
  const menu = projects?.querySelector('.arcade-project-menu');
  const header = document.querySelector('.site-header');
  if (!hero || !scene || !projects || !menu || !header) return null;

  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const camera = document.createElement('div');
  const image = document.createElement('div');
  camera.className = 'arcade-camera';
  camera.setAttribute('aria-hidden', 'true');
  camera.style.setProperty('--arcade-signal-duration', `${signalDuration}ms`);
  image.className = 'arcade-camera-image';
  const projectLoop = scene.querySelector('[data-project-loop]');
  if (projectLoop) image.append(projectLoop.cloneNode(true));
  camera.append(image);

  const initialOffset = projects.getBoundingClientRect().top - header.getBoundingClientRect().bottom;
  let workDocked = Math.abs(initialOffset) <= 1;
  let canLeaveWork = workDocked;
  let lastScrollY = window.scrollY;
  let bypass = false;
  let lockedAt: number | null = null;
  let revealTimer = 0;
  let revealRun = 0;
  let scrollFrame = 0;
  let pendingWorkArrival: (() => void) | null = null;
  let zoomingToWork = false;
  let homeReturn: { cancel: () => void; finish: () => void } | null = null;
  let swipe: { x: number; y: number; handled: boolean } | null = null;

  function cancelScroll() {
    if (!scrollFrame) return;
    window.cancelAnimationFrame(scrollFrame);
    scrollFrame = 0;
    reset();
  }

  function unlockScroll() {
    lockedAt = null;
    delete document.documentElement.dataset.arcadeScrollLocked;
  }

  const reset = () => {
    window.clearTimeout(revealTimer);
    revealRun += 1;
    unlockScroll();
    camera.remove();
    delete projects.dataset.arcadeEntry;
    zoomingToWork = false;
    pendingWorkArrival = null;
    bypass = false;
    workDocked = false;
    canLeaveWork = false;
  };

  const paintCamera = (progress: number, opacity: number, headerBottom: number) => {
    const art = scene.getBoundingClientRect();
    const scale = art.width / 1280;
    if (!scale) return;

    const viewportWidth = document.documentElement.clientWidth;
    const viewportHeight = window.innerHeight - headerBottom;
    // Frame the area inside the lower CRT's slanted glass in the original artwork.
    const centerX = 148 * scale;
    const centerY = 366 * scale;
    const panX = viewportWidth / 2 - art.left - centerX;
    const top = art.top - headerBottom;
    const panY = viewportHeight / 2 - top - centerY;
    const zoom = Math.max(viewportWidth / (50 * scale), viewportHeight / (48 * scale)) * 1.12;
    const eased = ease(clamp(progress / .9));

    camera.style.opacity = String(opacity);
    Object.assign(image.style, {
      width: `${art.width}px`,
      height: `${art.height}px`,
      left: `${art.left}px`,
      top: `${top}px`,
      transformOrigin: `${centerX}px ${centerY}px`,
      transform: `translate(${panX * eased}px, ${panY * eased}px) scale(${zoom ** eased})`,
      filter: `brightness(${1 - .64 * eased ** 3})`,
    });
  };

  const update = () => {
    if (homeReturn) return;
    if (lockedAt !== null) {
      if (Math.abs(window.scrollY - lockedAt) > 1) window.scrollTo({ top: lockedAt, behavior: 'instant' });
      return;
    }
    if (!zoomingToWork) return;
    const headerBottom = header.getBoundingClientRect().bottom;
    const viewportHeight = window.innerHeight - headerBottom;
    const distance = projects.getBoundingClientRect().top - headerBottom;
    const travel = Math.min(hero.offsetHeight, viewportHeight);
    if (motion.matches || travel <= 0) return;

    const settleMargin = Math.min(28, travel * .08);
    const progress = clamp((travel - distance) / (travel - settleMargin));
    if (bypass) return;
    if (progress === 0) return;

    if (progress === 1) {
      camera.remove();
      if (scrollFrame) return;
      zoomingToWork = false;
      window.scrollTo({ top: window.scrollY + distance, behavior: 'instant' });
      lockedAt = window.scrollY;
      workDocked = true;
      projects.dataset.arcadeEntry = 'blank';
      const run = ++revealRun;
      revealTimer = window.setTimeout(() => {
        projects.dataset.arcadeEntry = 'reveal';
        const animations = menu.getAnimations?.({ subtree: true }) ?? [];
        void Promise.allSettled(animations.map((animation) => animation.finished)).then(() => {
          if (run !== revealRun) return;
          delete projects.dataset.arcadeEntry;
          unlockScroll();
          canLeaveWork = true;
        });
      }, 160);
      return;
    }
    if (!camera.isConnected) {
      projects.dataset.arcadeEntry = 'blank';
      camera.setAttribute('data-signal-cut', '');
      document.body.append(camera);
    }

    paintCamera(progress, clamp((1 - progress) / .14), headerBottom);
  };

  const returnHome = (complete: () => void, fromWork = false) => {
    if (homeReturn || motion.matches || skipsArcadeZoom()) return null;
    const bounds = projects.getBoundingClientRect();
    const headerBottom = header.getBoundingClientRect().bottom;
    const distance = bounds.top - headerBottom;
    if (fromWork && (distance > 28 || bounds.bottom <= headerBottom)) return null;
    const startY = window.scrollY + (fromWork ? distance : 0);
    if (startY <= 0) return null;

    cancelScroll();
    reset();
    let frame = 0;
    const exit = {
      cancel() {
        if (homeReturn !== exit) return;
        window.cancelAnimationFrame(frame);
        homeReturn = null;
        reset();
      },
      finish() {
        if (homeReturn !== exit) return;
        exit.cancel();
        complete();
      },
    };
    homeReturn = exit;
    document.documentElement.dataset.arcadeScrollLocked = '';
    if (fromWork) {
      camera.setAttribute('data-signal-cut', '');
      document.body.append(camera);
      paintCamera(1, 1, headerBottom);
    }
    const started = performance.now();
    const hold = fromWork ? signalDuration : 0;
    const duration = fromWork ? 1000 : 850;

    const scrollHome = (now: number) => {
      const elapsed = now - started - hold;
      if (elapsed >= 0) {
        const progress = 1 - ease(clamp(elapsed / duration));
        window.scrollTo({ top: startY * progress, behavior: 'instant' });
        if (progress === 0) {
          exit.finish();
          return;
        }
        if (fromWork) {
          camera.removeAttribute('data-signal-cut');
          paintCamera(progress, clamp(progress / .15), header.getBoundingClientRect().bottom);
        }
      }
      frame = window.requestAnimationFrame(scrollHome);
    };

    frame = window.requestAnimationFrame(scrollHome);
    return exit.cancel;
  };

  const start = (enterProjects: () => void, fromTop = false) => {
    if (motion.matches || skipsArcadeZoom()) return false;
    homeReturn?.cancel();
    cancelScroll();

    const offset = projects.getBoundingClientRect().top - header.getBoundingClientRect().bottom;
    if (!fromTop && Math.abs(offset) <= 1) return false;
    reset();
    if (fromTop || offset < 0) window.scrollTo({ top: 0, behavior: 'instant' });

    const startY = window.scrollY;
    const distance = projects.getBoundingClientRect().top - header.getBoundingClientRect().bottom;
    if (distance <= 1) return false;
    zoomingToWork = true;
    pendingWorkArrival = enterProjects;
    document.documentElement.dataset.arcadeScrollLocked = '';
    const startAt = performance.now();

    function scroll(now: number) {
      const progress = clamp((now - startAt) / 1250);
      const eased = ease(progress);
      window.scrollTo({ top: startY + distance * eased, behavior: 'instant' });

      if (progress < 1) {
        scrollFrame = window.requestAnimationFrame(scroll);
      } else {
        scrollFrame = 0;
        pendingWorkArrival = null;
        enterProjects();
        update();
      }
    }

    scrollFrame = window.requestAnimationFrame(scroll);
    return true;
  };

  function onMotionChange() {
    if (homeReturn) {
      homeReturn.finish();
      return;
    }
    cancelScroll();
    reset();
    update();
  }

  const unsubscribeArcadeMotion = subscribeToArcadeMotion(() => {
    if (!skipsArcadeZoom()) return;
    const arrive = pendingWorkArrival;
    onMotionChange();
    arrive?.();
  });

  const autoScroll = (direction: number) => {
    if (zoomingToWork || homeReturn || lockedAt !== null || document.documentElement.hasAttribute('data-career-tv-locked')) return true;

    const bounds = projects.getBoundingClientRect();
    const distance = bounds.top - header.getBoundingClientRect().bottom;
    const exitDistance = Math.max(distance, bounds.bottom - window.innerHeight);
    if (direction > 0 && Math.abs(exitDistance) <= 2 && !bypass && !motion.matches && leaveWork()) return true;

    if (direction > 0 && distance > 1) {
      const enterWork = () => {
        projects.tabIndex = -1;
        projects.focus({ preventScroll: true });
        projects.scrollIntoView({ behavior: 'instant', block: 'start' });
      };
      if (!start(enterWork)) enterWork();
      return true;
    }
    if (direction < 0 && Math.abs(distance) <= 2) {
      const enterHome = () => {
        hero.tabIndex = -1;
        hero.focus({ preventScroll: true });
        window.scrollTo({ top: 0, behavior: 'instant' });
      };
      if (!returnHome(enterHome, true)) enterHome();
      return true;
    }
    return false;
  };

  function onWheel(event: WheelEvent) {
    if (event.defaultPrevented || event.ctrlKey || !event.deltaY || Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;
    if (autoScroll(event.deltaY)) event.preventDefault();
  }

  function onTouchStart(event: TouchEvent) {
    const carousel = event.target instanceof Element
      && event.target.closest('[data-carousel-scroll] :is(.arcade-feature, .arcade-project-grid)');
    const touch = event.touches.length === 1 ? event.touches[0] : null;
    swipe = touch && !carousel ? { x: touch.clientX, y: touch.clientY, handled: false } : null;
  }

  function onTouchMove(event: TouchEvent) {
    if (!swipe || event.touches.length !== 1 || !event.cancelable) return;
    const touch = event.touches[0];
    const delta = swipe.y - touch.clientY;
    if (swipe.handled || (Math.abs(delta) > Math.abs(swipe.x - touch.clientX) && autoScroll(delta))) {
      swipe.handled = true;
      event.preventDefault();
    }
  }

  function onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Escape' && homeReturn) {
      event.preventDefault();
      homeReturn.finish();
      return;
    }
    if (event.defaultPrevented || event.ctrlKey || event.metaKey || event.altKey) return;
    const target = event.target;
    if (target instanceof Element && target.closest('input, textarea, select, [contenteditable]')) return;

    const direction = event.key === 'ArrowDown' || event.key === 'PageDown' ? 1
      : event.key === 'ArrowUp' || event.key === 'PageUp' ? -1 : 0;
    if (direction && autoScroll(direction)) event.preventDefault();
  }

  const onScroll = () => {
    const previousY = lastScrollY;
    const scrollY = window.scrollY;
    lastScrollY = scrollY;
    if (homeReturn) return;

    const bounds = projects.getBoundingClientRect();
    const distance = bounds.top - header.getBoundingClientRect().bottom;
    workDocked = Math.abs(distance) <= 1;
    if (!motion.matches && lockedAt === null && !zoomingToWork) {
      // Let short viewports scroll through the entire CRT before switching to Career.
      const exitY = scrollY + Math.max(distance, bounds.bottom - window.innerHeight);
      if (distance > 1) {
        canLeaveWork = false;
        if (scrollY <= 1) bypass = false;
      } else if (scrollY <= exitY + 2) {
        if (scrollY < previousY) bypass = false;
        canLeaveWork = !bypass;
      }
      if (!bypass && canLeaveWork && previousY <= exitY + 2 && scrollY > exitY + 2) {
        canLeaveWork = false;
        window.scrollTo({ top: exitY, behavior: 'instant' });
        if (leaveWork()) return;
        window.scrollTo({ top: scrollY, behavior: 'instant' });
      }
    }
    update();
  };

  const onResize = () => {
    if (workDocked && !homeReturn && !scrollFrame) {
      const distance = projects.getBoundingClientRect().top - header.getBoundingClientRect().bottom;
      const top = window.scrollY + distance;
      lastScrollY = top;
      if (lockedAt !== null) lockedAt = top;
      window.scrollTo({ top, behavior: 'instant' });
    }
    update();
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onResize);
  window.addEventListener('wheel', onWheel, { passive: false });
  window.addEventListener('touchstart', onTouchStart, { passive: true });
  window.addEventListener('touchmove', onTouchMove, { passive: false });
  window.addEventListener('keydown', onKeyDown);
  motion.addEventListener('change', onMotionChange);

  return {
    start,
    returnHome,
    skip() {
      homeReturn?.cancel();
      cancelScroll();
      reset();
      bypass = true;
    },
    disconnect() {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('keydown', onKeyDown);
      motion.removeEventListener('change', onMotionChange);
      unsubscribeArcadeMotion();
      homeReturn?.cancel();
      cancelScroll();
      reset();
    },
  };
}
