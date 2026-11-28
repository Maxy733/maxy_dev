const gait = [
  { rearX: 0, rearY: 0, frontX: 0, frontY: 0, bob: 0 },
  { rearX: -3, rearY: 0, frontX: 3, frontY: 0, bob: 0 },
  { rearX: -1, rearY: -2, frontX: 0, frontY: 0, bob: -1 },
  { rearX: 3, rearY: 0, frontX: -3, frontY: 0, bob: 0 },
  { rearX: 0, rearY: 0, frontX: -1, frontY: -2, bob: -1 },
];

function drawKnight(context: CanvasRenderingContext2D, sprite: HTMLImageElement, pose: number, facing: number) {
  const { width, height } = context.canvas;
  context.clearRect(0, 0, width, height);
  context.save();
  if (facing === 1) {
    context.translate(width, 0);
    context.scale(-1, 1);
  }

  if (pose === 0) {
    context.drawImage(sprite, 0, 0);
  } else {
    // The source faces left. Move its two boot regions to alternate footsteps.
    const step = gait[pose];
    const bootTop = 51;
    const bootSplit = 29;
    const bootHeight = height - bootTop;
    const rearWidth = width - bootSplit;
    context.drawImage(sprite, 0, 0, width, bootTop, 0, step.bob, width, bootTop);
    context.drawImage(sprite, 0, bootTop, bootSplit, bootHeight,
      step.frontX, bootTop + step.frontY, bootSplit, bootHeight);
    context.drawImage(sprite, bootSplit, bootTop, rearWidth, bootHeight,
      bootSplit + step.rearX, bootTop + step.rearY, rearWidth, bootHeight);
  }
  context.restore();
}

type Point = { x: number; y: number };
type TrailPoint = Point & { distance: number };

function measureTrail(map: HTMLElement) {
  const origin = map.getBoundingClientRect();
  const points: TrailPoint[] = [];
  const stops: number[] = [];

  function add(point: Point) {
    const previous = points.at(-1);
    const length = previous ? Math.hypot(point.x - previous.x, point.y - previous.y) : 0;
    if (!previous || length > 0) points.push({ ...point, distance: (previous?.distance ?? 0) + length });
  }

  for (const marker of map.querySelectorAll('.career-marker')) {
    const bounds = marker.getBoundingClientRect();
    const point = { x: bounds.left + bounds.width / 2 - origin.left, y: bounds.top + bounds.height / 2 - origin.top };
    const previous = points.at(-1);
    // The desktop trail turns halfway between markers. On mobile it runs straight down.
    if (previous && previous.x !== point.x && previous.y !== point.y) {
      const turn = (previous.x + point.x) / 2;
      add({ x: turn, y: previous.y });
      add({ x: turn, y: point.y });
    }
    add(point);
    stops.push(points.at(-1)?.distance ?? 0);
  }

  return { points, stops };
}

export function connectCareerKnight(map: HTMLElement, knight: HTMLElement, canvas: HTMLCanvasElement) {
  const context = canvas.getContext('2d');
  if (!context) return null;
  context.imageSmoothingEnabled = false;
  const sprite = new Image();
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let trail = measureTrail(map);
  let destination = 0;
  let distance = 0;
  let walked = 0;
  let frame = 0;
  let previousTime = 0;
  let facing = 1;
  let lastFacing = 0;
  let lastPose = -1;

  function render(pose: number) {
    const next = trail.points.findIndex((point) => point.distance >= distance);
    const end = trail.points[next] ?? trail.points.at(-1);
    if (!end) return;
    const start = trail.points[next - 1];
    const progress = start ? (distance - start.distance) / (end.distance - start.distance) : 1;
    const x = start ? start.x + (end.x - start.x) * progress : end.x;
    const y = start ? start.y + (end.y - start.y) * progress : end.y;
    knight.style.transform = `translate(${x}px, ${y}px)`;
    if (context && sprite.complete && sprite.naturalWidth && (pose !== lastPose || facing !== lastFacing)) {
      drawKnight(context, sprite, pose, facing);
      knight.dataset.ready = '';
      lastPose = pose;
      lastFacing = facing;
    }
  }

  function settle() {
    window.cancelAnimationFrame(frame);
    frame = 0;
    previousTime = 0;
    walked = 0;
    distance = trail.stops[destination] ?? 0;
    delete knight.dataset.walking;
    render(0);
  }

  function walk(now: number) {
    const target = trail.stops[destination];
    const remaining = target - distance;
    const elapsed = previousTime ? Math.min(now - previousTime, 48) : 0;
    const step = elapsed * .384;
    if (Math.abs(remaining) <= step) {
      settle();
      return;
    }

    previousTime = now;
    distance += Math.sign(remaining) * step;
    walked += step;
    render(walkingPose());
    frame = window.requestAnimationFrame(walk);
  }

  const walkingPose = () => 1 + Math.floor(walked / 24) % (gait.length - 1);
  const onLoad = () => render(frame ? walkingPose() : 0);
  sprite.addEventListener('load', onLoad, { once: true });
  sprite.src = '/career-knight.png';
  settle();
  const resize = new ResizeObserver(() => {
    trail = measureTrail(map);
    settle();
  });
  resize.observe(map);
  motion.addEventListener('change', settle);

  return {
    visit(stop: number) {
      if (stop === destination || trail.stops[stop] === undefined) return;
      destination = stop;
      facing = trail.stops[stop] < distance ? -1 : 1;
      if (motion.matches) settle();
      else if (!frame) {
        knight.dataset.walking = '';
        frame = window.requestAnimationFrame(walk);
      }
    },
    disconnect() {
      window.cancelAnimationFrame(frame);
      sprite.removeEventListener('load', onLoad);
      resize.disconnect();
      motion.removeEventListener('change', settle);
    },
  };
}
