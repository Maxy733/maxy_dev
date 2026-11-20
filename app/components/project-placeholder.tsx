import type { Project } from '../projects';

const labels = {
  screenshot: 'Screenshot to be added',
  chart: 'Original chart to be added',
  result: 'Original result to be added',
};

export function ProjectPlaceholder({ visual, title }: {
  visual: NonNullable<Project['visual']>;
  title: string;
}) {
  if (visual === 'screenshot') {
    return (
      <figure className="feature-frame m-0">
        <div className="preview-window">
          <div className="preview-toolbar">
            <span className="window-dots" aria-hidden="true"><i /><i /><i /></span>
            <span>{title}</span>
          </div>
          <div className="preview-canvas">
            <div className="placeholder-caption" aria-hidden="true">
              <span className="image-symbol" />
              <span>{labels[visual]}</span>
            </div>
          </div>
        </div>
        <figcaption className="sr-only">{labels[visual]}</figcaption>
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
      <figcaption>{labels[visual]}</figcaption>
    </figure>
  );
}
