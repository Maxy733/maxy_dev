import type { ReactNode } from 'react';

export function ProjectPreviewWindow({ title, controls, children }: {
  title: string;
  controls?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="preview-window">
      <div className="preview-toolbar">
        <span className="window-dots" aria-hidden="true"><i /><i /><i /></span>
        <span className="preview-window-title" aria-hidden="true">{title}</span>
        {controls && <div className="preview-controls">{controls}</div>}
      </div>
      {children}
    </div>
  );
}
