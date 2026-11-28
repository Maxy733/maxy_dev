import { ui, type Locale } from '../locale';
import type { Project } from '../projects';
import { ProjectPreviewWindow } from './project-preview-window';

export function ProjectPlaceholder({ visual, title, locale }: {
  visual: NonNullable<Project['visual']>;
  title: string;
  locale: Locale;
}) {
  if (visual === 'screenshot') {
    return (
      <figure className="feature-frame m-0">
        <ProjectPreviewWindow title={title}>
          <div className="preview-canvas">
            <div className="placeholder-caption" aria-hidden="true">
              <span className="image-symbol" />
              <span>{ui[locale][visual]}</span>
            </div>
          </div>
        </ProjectPreviewWindow>
        <figcaption className="sr-only">{ui[locale][visual]}</figcaption>
      </figure>
    );
  }

  return (
    <figure className={`data-visual data-visual--${visual} m-0`}>
      <div className="data-paper" aria-hidden="true">
        {visual === 'chart' ? (
          <div className="chart-skeleton"><i /><i /><i /><i /><i /></div>
        ) : (
          <div className="result-skeleton">
            <div><i /><i /></div><div><i /><i /></div><div><i /><i /></div>
          </div>
        )}
      </div>
      <figcaption>{ui[locale][visual]}</figcaption>
    </figure>
  );
}
