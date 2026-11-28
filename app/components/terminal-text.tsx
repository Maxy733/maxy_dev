export function TerminalText({ text, part }: { text: string; part?: string }) {
  return (
    <span className="career-terminal-text" data-career-terminal={part}>
      <span className="career-terminal-source">{text}</span>
      <span className="career-terminal-output" aria-hidden="true" />
    </span>
  );
}

type TerminalLine = { line: HTMLElement | null; interval: number; delay?: number };

export function typeTerminalText(entries: TerminalLine[], signal: AbortSignal, leadIn = 150) {
  const segmenter = typeof Intl.Segmenter === 'function' ? new Intl.Segmenter(undefined, { granularity: 'grapheme' }) : null;
  const lines = entries.flatMap(({ line, interval, delay = 0 }) => {
    const source = line?.querySelector('.career-terminal-source')?.textContent;
    const output = line?.querySelector<HTMLElement>('.career-terminal-output');
    if (!line || !source || !output) return [];
    const letters = segmenter ? Array.from(segmenter.segment(source), ({ segment }) => segment) : Array.from(source);
    return [{ line, output, letters, interval, delay, count: -1 }];
  });
  if (signal.aborted || !lines.length) return Promise.resolve();

  for (const { line } of lines) line.dataset.typing = 'waiting';
  const startsAt = performance.now() + leadIn;

  return new Promise<void>((resolve) => {
    let frame = 0;

    function stop() {
      window.cancelAnimationFrame(frame);
      signal.removeEventListener('abort', stop);
      for (const { line, output } of lines) {
        delete line.dataset.typing;
        output.textContent = '';
      }
      resolve();
    }

    function tick(now: number) {
      const elapsed = now - startsAt;
      let remaining = false;
      for (const entry of lines) {
        if (entry.count === entry.letters.length) continue;
        const lineElapsed = elapsed - entry.delay;
        if (lineElapsed < 0) {
          remaining = true;
          continue;
        }
        const count = Math.min(entry.letters.length, 1 + Math.floor(lineElapsed / entry.interval));
        if (count !== entry.count) {
          entry.count = count;
          entry.line.dataset.typing = 'active';
          entry.output.textContent = entry.letters.slice(0, count).join('');
        }
        if (count === entry.letters.length) {
          delete entry.line.dataset.typing;
          entry.output.textContent = '';
        } else {
          remaining = true;
        }
      }
      if (remaining) frame = window.requestAnimationFrame(tick);
      else stop();
    }

    signal.addEventListener('abort', stop, { once: true });
    frame = window.requestAnimationFrame(tick);
  });
}
