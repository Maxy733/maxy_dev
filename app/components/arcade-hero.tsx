'use client';

import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type PointerEvent, type ReactNode } from 'react';
import { ui, type Locale } from '../locale';
import '@fontsource/silkscreen/latin-700.css';

type ArtworkBounds = readonly [x: number, y: number, width: number, height: number];

type ScreenLoop = {
  src: string;
  bounds: ArtworkBounds;
  glass?: string;
  tilt?: number;
  mode?: 'projects' | 'flicker';
  power?: { x: number; y: number; label: string };
};

const screenLoops: ScreenLoop[] = [
  { src: '/pixel-hero-platformer.gif', bounds: [84, 121, 108, 165], mode: 'projects' },
  {
    src: '/arcade-meter.gif', bounds: [810, 498, 22, 35], glass: 'polygon(5% 0, 96% 20%, 96% 100%, 0 77%)', tilt: 17,
  },
  {
    src: '/arcade-comet.gif', bounds: [862, 522, 35, 67], glass: 'polygon(2% 0, 97% 22%, 100% 100%, 7% 75%)', tilt: 24,
    power: { x: 898, y: 514, label: 'Comet screen power' },
  },
  {
    src: '/arcade-crt-flicker.gif', bounds: [1171, 470, 133, 67], glass: 'polygon(16% 0, 100% 11%, 69% 99%, 0 67%)',
    tilt: 8, mode: 'flicker',
  },
];

const soundWords = [
  'BZZZRT!', 'KSSSH!', 'BLIP!', 'FZZZT!', 'K-CHK!', 'BEEP!',
  'ZZAP!', 'BRRRT!', 'KRAK!', 'CHIRP!', 'BLOOP!', 'TIK!',
  'PIP!', 'PING!', 'PSSHT!', 'WHIRR!', 'FWOOP!', 'K-TIK!',
  'DZZZT!', 'POW!', 'TA-DA!', 'DING!', 'KRRSH!', 'POP!',
];
const projectSoundWord = 'KA-CHING!';
const noiseWindow = 6;
const soundScreens = [
  { x: 140, y: 126, projects: true },
  { x: 571, y: 197, pink: true },
  { x: 652, y: 252, narrowFallback: true },
  { x: 637, y: 588 }, // Below the yellow handheld, clear of the hero button.
  { x: 817, y: 495 },
  { x: 975, y: 119, pink: true },
  { x: 1214, y: 464, pink: true },
];

type SoundBurst = { id: number; word: string; left: number; top: number; delay: number; pink?: boolean };

function ArcadeSoundEffects() {
  const layer = useRef<HTMLDivElement>(null);
  const [bursts, setBursts] = useState<SoundBurst[]>([]);

  useEffect(() => {
    const effects = layer.current;
    const crop = effects?.closest('.arcade-layer');
    const hero = crop?.closest('.hero');
    if (!effects || !crop || !hero) return;

    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const visibleThreshold = .2;
    let timer = 0;
    let nextBurstAt = 0;
    let remainingDelay = 250 + Math.random() * 350;
    let heroInView = false;
    let playing = false;
    let nextBurstId = 0;
    let previousWords: string[] = [];
    type Machine = (typeof soundScreens)[number];
    const recentMachines: Machine[] = [];
    let rotation: Machine[] = [];
    let rotationNoises = 0;

    const playBurst = () => {
      if (!playing) return;
      let nextBurstDelay = 1080 + Math.random() * 520;
      const art = effects.getBoundingClientRect();
      const visible = crop.getBoundingClientRect();
      if (visible.bottom > 0 && visible.top < window.innerHeight
        && getComputedStyle(effects).visibility === 'visible') {
        const minSoundY = Math.max(visible.top, 0) + 36;
        const visibleScreens = soundScreens.map((machine) => ({
          machine,
          x: art.left + machine.x / 1280 * art.width,
          y: art.top + machine.y / 768 * art.height,
        })).filter(({ x, y }) => x >= visible.left && x <= visible.right
          && y >= minSoundY && y < Math.min(visible.bottom, window.innerHeight));
        const regularScreens = visibleScreens.filter(({ machine }) => !machine.narrowFallback);
        const screens = regularScreens.length >= 3 ? regularScreens : visibleScreens;
        if (screens.length !== rotation.length || screens.some(({ machine }, index) => machine !== rotation[index])) {
          rotation = screens.map(({ machine }) => machine);
          rotationNoises = 0;
        }
        const count = screens.length >= 3 ? 1 + Math.floor(Math.random() * 3) : 0;
        const words = soundWords.filter((word) => !previousWords.includes(word));
        const stagger = 40 + Math.random() * 70;
        const nextBursts: SoundBurst[] = [];
        for (let index = 0; index < count; index++) {
          const recentInRotation = recentMachines.slice(recentMachines.length - rotationNoises);
          const missing = rotation.filter((machine) => !recentInRotation.includes(machine));
          // Reserve the remaining slots when every one is needed for a machine still waiting.
          const mustTakeTurn = missing.length >= noiseWindow - recentInRotation.length;
          const eligible = screens.filter(({ machine }) => (!mustTakeTurn || missing.includes(machine))
            && recentMachines.filter((item) => item === machine).length < 2);
          if (!eligible.length) break;

          const screen = eligible[Math.floor(Math.random() * eligible.length)];
          screens.splice(screens.indexOf(screen), 1);
          recentMachines.push(screen.machine);
          if (recentMachines.length === noiseWindow) recentMachines.shift();
          rotationNoises = Math.min(rotationNoises + 1, noiseWindow - 1);

          const word = screen.machine.projects && Math.random() < .5
            ? projectSoundWord : words.splice(Math.floor(Math.random() * words.length), 1)[0];
          const x = Math.min(visible.right - 54, Math.max(visible.left + 54, screen.x));
          const y = word === projectSoundWord ? Math.max(minSoundY, screen.y - 18 / 768 * art.height) : screen.y;
          nextBursts.push({
            id: nextBurstId++,
            word,
            left: (x - art.left) / art.width * 100,
            top: (y - art.top) / art.height * 100,
            delay: index * stagger,
            pink: screen.machine.pink,
          });
        }
        if (nextBursts.length) {
          previousWords = nextBursts.map(({ word }) => word);
          setBursts(nextBursts);
          nextBurstDelay += (nextBursts.length - 1) * stagger;
        }
      }
      scheduleBurst(nextBurstDelay);
    };

    function scheduleBurst(delay: number) {
      nextBurstAt = performance.now() + delay;
      timer = window.setTimeout(playBurst, delay);
    }

    const syncPlayback = () => {
      hero.toggleAttribute('data-arcade-inactive', !heroInView);

      const playSounds = heroInView && !motion.matches;
      if (playing !== playSounds) {
        playing = playSounds;
        if (playing) {
          scheduleBurst(remainingDelay);
        } else {
          remainingDelay = Math.max(0, nextBurstAt - performance.now());
          window.clearTimeout(timer);
        }
      }
      if (motion.matches) setBursts([]);
    };

    const syncViewport = () => {
      const { top, bottom, height } = hero.getBoundingClientRect();
      const visibleHeight = Math.min(bottom, window.innerHeight) - Math.max(top, 0);
      heroInView = height > 0 && visibleHeight >= height * visibleThreshold;
      syncPlayback();
    };

    function pauseOnPageHide() {
      heroInView = false;
      syncPlayback();
    }

    const observer = new IntersectionObserver(syncViewport, { threshold: visibleThreshold });
    observer.observe(hero);
    window.addEventListener('pageshow', syncViewport);
    window.addEventListener('pagehide', pauseOnPageHide);
    motion.addEventListener('change', syncPlayback);
    syncViewport();
    return () => {
      window.clearTimeout(timer);
      observer.disconnect();
      window.removeEventListener('pageshow', syncViewport);
      window.removeEventListener('pagehide', pauseOnPageHide);
      motion.removeEventListener('change', syncPlayback);
    };
  }, []);

  return (
    <div className="arcade-sound-effects" ref={layer} aria-hidden="true">
      {bursts.map(({ id, word, left, top, delay, pink }) => (
        <span className="arcade-sound-burst" data-pink={pink} key={id}
          style={{ left: `${left}%`, top: `${top}%`, '--sound-delay': `${delay}ms` } as CSSProperties}>
          {word}
          {word === projectSoundWord && <i className="arcade-sound-coin" />}
        </span>
      ))}
    </div>
  );
}

function artworkPoint(x: number, y: number) {
  return { left: `${x / 1280 * 100}%`, top: `${y / 768 * 100}%` };
}

function artworkPlacement([x, y, width, height]: ArtworkBounds) {
  return {
    ...artworkPoint(x, y),
    width: `${width / 1280 * 100}%`, height: `${height / 768 * 100}%`,
  };
}

function artworkCrop([x, y, width, height]: ArtworkBounds) {
  const position = `${x / (1280 - width) * 100}% ${y / (768 - height) * 100}%`;
  const size = `${1280 / width * 100}% ${768 / height * 100}%`;
  return `${position} / ${size}`;
}

function ArcadeScreenLoop({ src, bounds, glass, tilt, mode, power }: ScreenLoop) {
  const button = useRef<HTMLButtonElement>(null);
  const [powerPhase, setPowerPhase] = useState<'on' | 'starting' | 'stopping' | 'off'>('on');
  const [inCrop, setInCrop] = useState(false);
  const powered = powerPhase === 'on' || powerPhase === 'starting';

  useEffect(() => {
    const control = button.current;
    const crop = control?.closest('.arcade-layer');
    if (!control || !crop) return;

    const observer = new IntersectionObserver(([entry]) => {
      setInCrop(entry.intersectionRatio >= .95);
    }, { root: crop, threshold: .95 });
    observer.observe(control);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <div className="arcade-loop-screen" data-project-loop={mode === 'projects' || undefined}
        data-crt-flicker={mode === 'flicker' || undefined} data-screen-off={!powered || undefined}
        data-power-phase={power ? powerPhase : undefined} aria-hidden="true" style={{
        ...artworkPlacement(bounds), clipPath: glass,
        '--screen-gif': `url('${src}')`, '--screen-tilt': tilt && `${tilt}deg`,
        '--screen-artwork-crop': mode === 'projects' ? artworkCrop(bounds) : undefined,
      } as CSSProperties}>
        {powerPhase !== 'off' && (
          <span onAnimationEnd={power && ((event) => {
            if (event.target !== event.currentTarget) return;
            if (powerPhase === 'starting' && event.animationName === 'arcade-screen-power-on') setPowerPhase('on');
            if (powerPhase === 'stopping' && event.animationName === 'arcade-screen-power-off') setPowerPhase('off');
          })}>{mode === 'projects' && <i />}</span>
        )}
      </div>
      {power && (
        <button
          ref={button}
          className="arcade-screen-power"
          type="button"
          aria-label={power.label}
          aria-pressed={powered}
          data-in-crop={inCrop || undefined}
          style={artworkPoint(power.x, power.y)}
          onClick={() => setPowerPhase(powered ? 'stopping' : 'starting')}
        >
          <span aria-hidden="true" />
        </button>
      )}
    </>
  );
}

const cabinetOutline = `M 5 121 Q 5 117 11 115 L 81 102 Q 85 100 91 104 L 198 163 Q 202 165 202 170
  L 200 304 Q 200 308 195 312 L 198 360 Q 200 393 213 425 L 215 435 L 214 579
  Q 222 579 222 585 Q 222 593 209 602 L 206 609 L 209 620 L 244 625 L 286 628
  Q 292 629 291 635 L 290 649 L 303 653 Q 307 654 307 660 L 307 686 Q 308 691 304 697
  L 289 716 L 269 740 L 248 768 L 151 768 L 7 757 Q 5 756 5 750 L 4 690 L 6 627
  L 4 570 L 6 517 L 4 464 L 5 414 L 4 361 L 5 309 L 4 263 L 5 214 Z`;

const tvOutline = `M 935 128 Q 935 125 939 122 L 989 91 Q 998 85 1005 82
  Q 1012 79 1025 81 L 1086 85 L 1118 90 L 1186 100 Q 1195 101 1198 111
  L 1199 131 Q 1199 134 1196 136 L 1189 141 Q 1186 143 1186 148 L 1186 158
  L 1169 166 L 1130 182 L 1090 198 L 1036 219 L 990 237 L 951 252
  Q 948 253 947 249 L 946 237 Q 945 234 942 232 Q 936 229 935 220 Z`;

const straightOutlines = {
  cabinet: `M 5 118 L 85 101 L 201 166 L 200 305 L 195 312 L 198 363 L 215 435
    L 214 579 L 222 582 L 220 594 L 206 608 L 209 621 L 291 630 L 290 649
    L 307 656 L 307 693 L 248 768 H 151 L 5 757 Z`,
  tv: `M 935 125 L 1009 80 L 1190 100 L 1198 106 L 1198 134 L 1186 142
    V 158 L 948 253 L 946 235 L 935 228 Z`,
};

function ArcadeHotspot({ kind, bounds, outline, href, label, zoom }: {
  kind: 'cabinet' | 'tv';
  bounds: ArtworkBounds;
  outline: string;
  href: string;
  label: string;
  zoom?: boolean;
}) {
  const [x, y, width, height] = bounds;
  const silhouette = `arcade-${kind}-silhouette`;
  const mask = `arcade-${kind}-mask`;

  return (
    <div className={`arcade-hotspot arcade-${kind}`} style={{
      ...artworkPlacement(bounds), '--hotspot-x': x / 1280, '--hotspot-y': y / 768,
    } as CSSProperties}>
      <svg className="arcade-hotspot-trace" viewBox={`${x} ${y} ${width} ${height}`} preserveAspectRatio="none" aria-hidden="true" focusable="false">
        <defs>
          <path id={silhouette} vectorEffect="non-scaling-stroke" d={outline} />
          <clipPath id={mask} clipPathUnits="objectBoundingBox">
            <use href={`#${silhouette}`} transform={`scale(${1 / width} ${1 / height}) translate(${-x} ${-y})`} />
          </clipPath>
        </defs>
        <g className="arcade-hotspot-highlight">
          <use className="arcade-hotspot-ink" href={`#${silhouette}`} />
          <path className="arcade-hotspot-outline" d={straightOutlines[kind]} pathLength={1} vectorEffect="non-scaling-stroke" />
        </g>
      </svg>
      <span className="arcade-hotspot-art" style={{ clipPath: `url(#${mask})` }} aria-hidden="true" />
      <a className="arcade-hotspot-link" style={{ clipPath: `url(#${mask})` }} href={href} data-arcade-zoom={zoom || undefined} data-career-tv={kind === 'tv' || undefined} aria-label={label}>
        <span className="arcade-hotspot-screen" aria-hidden="true" />
      </a>
    </div>
  );
}

export function ArcadeHero({ children, projectsHref, careerHref, locale }: { children: ReactNode; projectsHref: string; careerHref: string; locale: Locale }) {
  const heroRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const hero = heroRef.current;
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (!hero || motion.matches) return;

    const introKey = 'maxy.arcade-intro-seen';
    try {
      if (localStorage.getItem(introKey)) return;
    } catch {
      // The intro can still play if browser storage is unavailable.
    }

    const visible = new Set<Element>();
    const observer = new IntersectionObserver((entries) => {
      for (const { target, intersectionRatio } of entries) {
        const threshold = target === hero ? .6 : .01;
        if (intersectionRatio >= threshold) visible.add(target);
        else visible.delete(target);
      }
      if (motion.matches || !visible.has(hero) || visible.size < 2) return;

      hero.dataset.arcadeIntro = '';
      observer.disconnect();
      try {
        localStorage.setItem(introKey, '1');
      } catch {
        // Storage is only used to remember the first visit.
      }
    }, { threshold: [.01, .6] });
    observer.observe(hero);
    for (const hotspot of hero.querySelectorAll('.arcade-hotspot')) observer.observe(hotspot);
    return () => observer.disconnect();
  }, []);

  function followPointer(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType === 'touch' || !(event.target instanceof Element) || !event.target.closest('.arcade-hotspot-link')) return;

    const layer = event.currentTarget;
    const bounds = layer.getBoundingClientRect();
    const x = event.clientX - bounds.left;
    const y = event.clientY - bounds.top;
    const flipX = x > bounds.width - 112;
    const flipY = y > bounds.height - 48;
    layer.style.setProperty('--hint-pointer-x', `${x + (flipX ? -14 : 14)}px`);
    layer.style.setProperty('--hint-pointer-y', `${y + (flipY ? -14 : 14)}px`);
    layer.style.setProperty('--hint-shift-x', flipX ? '-100%' : '0%');
    layer.style.setProperty('--hint-shift-y', flipY ? '-100%' : '0%');
    layer.dataset.pointerHint = '';
  }

  return (
    <section ref={heroRef} className="hero text-center" aria-labelledby="hero-title">
      <div className="shell hero-content">{children}</div>
      <div className="arcade-layer" onPointerOver={followPointer} onPointerMove={followPointer}
        onPointerLeave={(event) => { delete event.currentTarget.dataset.pointerHint; }}>
        <div className="arcade-scene">
          {screenLoops.map((screen) => <ArcadeScreenLoop key={screen.src} {...screen} power={screen.power && { ...screen.power, label: ui[locale].power }} />)}
          <ArcadeHotspot kind="cabinet" bounds={[0, 101, 310, 667]} outline={cabinetOutline} href={projectsHref} label={ui[locale].gameWork} zoom />
          <ArcadeHotspot kind="tv" bounds={[934, 79, 266, 175]} outline={tvOutline} href={careerHref} label={ui[locale].gameCareer} />
          <div className="arcade-light-sparks" style={artworkPlacement([683, 169, 46, 58])} aria-hidden="true">
            <i /><i />
          </div>
          <ArcadeSoundEffects />
        </div>
        <span className="arcade-hotspot-hint arcade-projects-hint" aria-hidden="true">{ui[locale].projects}</span>
        <span className="arcade-hotspot-hint arcade-timeline-hint" aria-hidden="true">{ui[locale].timeline}</span>
      </div>
    </section>
  );
}
