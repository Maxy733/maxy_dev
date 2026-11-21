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
      <Image src={src} width={width} height={height} alt={alt} loading={eager ? 'eager' : undefined} unoptimized />
      {showCaption && <figcaption>{caption}</figcaption>}
    </figure>
  );
}
