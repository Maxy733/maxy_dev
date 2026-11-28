import Image from 'next/image';
import type { ProjectImage } from '../projects';

export function ProjectScreenshot({ screenshot, showCaption = false, eager = false }: {
  screenshot: ProjectImage;
  showCaption?: boolean;
  eager?: boolean;
}) {
  const { src, width, height, alt, caption } = screenshot;

  return (
    <figure className="project-screenshot" data-portrait={height > width || undefined}>
      {/* Dark Reader can rewrite Next.js's default inline color before React hydrates. */}
      <Image
        src={src}
        width={width}
        height={height}
        alt={alt}
        loading={eager ? 'eager' : undefined}
        style={{ color: undefined }}
        unoptimized
      />
      {showCaption && <figcaption>{caption}</figcaption>}
    </figure>
  );
}
