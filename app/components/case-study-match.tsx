import { ViewTransition, type ReactNode } from 'react';

export const caseStudyTransitionType = 'case-study';

export function CaseStudyCardMatch({ slug, children }: {
  slug: string;
  children: ReactNode;
}) {
  return (
    <ViewTransition
      name={`case-study-card-${slug}`}
      default="none"
      share={{ default: 'none', [caseStudyTransitionType]: 'case-study-card' }}
    >
      {children}
    </ViewTransition>
  );
}
