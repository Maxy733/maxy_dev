import { typeTerminalText } from './terminal-text';

function typeCareerText(career: HTMLElement, signal: AbortSignal) {
  const lines = [
    { part: 'heading', interval: 75 },
    { part: 'summary', interval: 14 },
    { part: 'education-title', interval: 75 },
    { part: 'education-details', interval: 22, delay: 650 },
    { part: 'skills-title', interval: 75, delay: 1150 },
    { part: 'skills-details', interval: 12, delay: 1650 },
  ].map(({ part, interval, delay }) => ({
    line: career.querySelector<HTMLElement>(`[data-career-terminal="${part}"]`), interval, delay,
  }));
  return typeTerminalText(lines, signal);
}

export function playCareerTv({ prepare, arrive, finish, reverse = false }: {
  prepare: () => void;
  arrive: () => void;
  finish: () => void;
  reverse?: boolean;
}) {
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const scene = document.querySelector('.hero .arcade-scene');
  const career = document.getElementById('career');
  const header = document.querySelector('.site-header');
  if (motion.matches || !scene || !career || !header || typeof scene.animate !== 'function') return null;

  if (!reverse) {
    prepare();
    window.scrollTo({ top: 0, behavior: 'instant' });
  }
  const art = scene.getBoundingClientRect();
  const headerBottom = header.getBoundingClientRect().bottom;
  const width = document.documentElement.clientWidth;
  const height = window.innerHeight - headerBottom;
  const scale = art.width / 1280;
  if (scale <= 0 || height <= 0) return null;

  // The camera lands inside the slanted glass, using the original artwork's coordinates.
  const screenX = 970 * scale;
  const screenY = 157 * scale;
  const top = art.top + window.scrollY - headerBottom;
  const panX = width / 2 - art.left - screenX;
  const panY = height / 2 - top - screenY;
  const zoom = Math.max(width / (36 * scale), height / (48 * scale));
  const keyframes = Array.from({ length: 9 }, (_, index) => {
    const progress = index / 8;
    return { transform: `translate(${panX * progress}px, ${panY * progress}px) scale(${zoom ** progress})` };
  });

  const camera = document.createElement('div');
  camera.className = 'arcade-camera career-tv-camera';
  camera.setAttribute('aria-hidden', 'true');
  const picture = document.createElement('div');
  picture.className = 'career-tv-picture';
  const image = document.createElement('div');
  image.className = 'arcade-camera-image';
  Object.assign(image.style, {
    width: `${art.width}px`, height: `${art.height}px`, left: `${art.left}px`, top: `${top}px`,
    transformOrigin: `${screenX}px ${screenY}px`,
  });
  if (reverse) {
    picture.style.clipPath = 'inset(50%)';
    image.style.transform = keyframes[keyframes.length - 1].transform;
  }
  const line = document.createElement('div');
  line.className = 'career-tv-line';
  picture.append(image);
  camera.append(picture, line);

  const events = new AbortController();
  const animations: Animation[] = [];
  let stopped = false;
  let arrived = false;

  function releaseCamera() {
    camera.remove();
    for (const animation of animations) animation.cancel();
    delete document.documentElement.dataset.careerTvLocked;
  }

  function cleanup() {
    if (stopped) return;
    stopped = true;
    events.abort();
    if (career?.dataset.tvEntry === 'playing') career.dataset.tvEntry = 'settled';
    releaseCamera();
    finish();
  }

  function land() {
    if (arrived) return;
    arrived = true;
    arrive();
  }

  function skipMotion() {
    if (reverse) cleanup();
    land();
    cleanup();
  }

  function animate(element: HTMLElement, frames: Keyframe[], options: KeyframeAnimationOptions) {
    const animation = element.animate(frames, { fill: 'forwards', ...options });
    animations.push(animation);
    return animation.finished;
  }

  if (!reverse) delete career.dataset.tvEntry;
  document.documentElement.dataset.careerTvLocked = '';
  document.body.append(camera);
  window.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    event.preventDefault();
    skipMotion();
  }, { signal: events.signal });
  window.addEventListener('resize', () => { if (!arrived) skipMotion(); }, { signal: events.signal });
  motion.addEventListener('change', skipMotion, { signal: events.signal });

  const direction = reverse ? 'reverse' : 'normal';
  const zoomTiming: KeyframeAnimationOptions = { duration: 1230, easing: 'cubic-bezier(.36, 0, .24, 1)', direction };
  const powerTiming: KeyframeAnimationOptions = { duration: 580, easing: 'ease-in-out', direction };

  function animatePower() {
    return Promise.all([
      animate(picture, [
        { clipPath: 'inset(0)', filter: 'brightness(1)' },
        { clipPath: 'inset(49.7% 0)', filter: 'brightness(1.5)', offset: .47 },
        { clipPath: 'inset(50%)', filter: 'brightness(1.7)', offset: .72 },
        { clipPath: 'inset(50%)', filter: 'brightness(1.7)' },
      ], powerTiming),
      animate(line, [
        { opacity: 0, transform: 'scaleX(1)' },
        { opacity: 0, transform: 'scaleX(1)', offset: .34 },
        { opacity: .9, transform: 'scaleX(1)', offset: .47 },
        { opacity: 0, transform: 'scaleX(.01)', offset: .72 },
        { opacity: 0, transform: 'scaleX(.01)' },
      ], powerTiming),
    ]);
  }

  async function run(section: HTMLElement) {
    await Promise.all([
      animate(camera, [{ opacity: 0 }, { opacity: 1 }], { duration: 140, easing: 'ease-out' }),
      animate(image, keyframes, zoomTiming),
    ]);
    if (stopped) return;

    await animatePower();
    if (stopped) return;

    section.dataset.tvEntry = 'playing';
    const typing = typeCareerText(section, events.signal);
    land();
    await animate(camera, [{ opacity: 1 }, { opacity: 0 }], { duration: 250, easing: 'ease-out' });
    if (stopped) return;
    releaseCamera();
    await typing;
    cleanup();
  }

  async function runReverse() {
    await animate(camera, [{ opacity: 0 }, { opacity: 1 }], { duration: 250, easing: 'ease-in' });
    if (stopped) return;

    prepare();
    window.scrollTo({ top: 0, behavior: 'instant' });
    await animatePower();
    if (stopped) return;

    await animate(image, keyframes, zoomTiming);
    if (stopped) return;

    await animate(camera, [{ opacity: 1 }, { opacity: 0 }], { duration: 140, easing: 'ease-in' });
    if (!stopped) {
      cleanup();
      land();
    }
  }

  void (reverse ? runReverse() : run(career)).catch(() => {
    if (!stopped) skipMotion();
  });
  return cleanup;
}
