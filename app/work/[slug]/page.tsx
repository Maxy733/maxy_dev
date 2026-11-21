import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CaseStudyCardMatch } from '../../components/case-study-match';
import { ProjectPlaceholder } from '../../components/project-placeholder';
import { ProjectScreenshot } from '../../components/project-screenshot';
import { Reveal } from '../../components/reveal';
import { overviewTopics, projects, type Project } from '../../projects';

type Props = PageProps<'/work/[slug]'>;

export function generateStaticParams() {
  return projects.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((item) => item.slug === slug);
  return project ? { title: project.title, description: project.description } : {};
}

export default async function CaseStudy({ params }: Props) {
  const { slug } = await params;
  const project: Project | undefined = projects.find((item) => item.slug === slug);
  if (!project) notFound();
  const { title, description, study, screenshots, techStack, techStackBadge, visual = 'screenshot' } = project;
  const [cover, ...gallery] = screenshots ?? [];

  return (
    <main id="main" className="shell case-page">
      <Link className="primary-action case-back" href="/#work" data-case-study-project={slug}>
        <span aria-hidden="true">←</span> Back
      </Link>

      <article className="case-study" aria-label="Case study">
        <section id="evidence" className="case-overview" aria-labelledby="evidence-title">
          <header className="case-header">
            <h1>{title}</h1>
            <p className="case-description">{description}</p>
            {!!techStack?.length && (
              <section className="case-tech-stack" aria-labelledby="tech-stack-title">
                <h2 id="tech-stack-title">Tech stack</h2>
                <ul role="list">
                  {techStack.map(({ name, src }) => (
                    <li key={src} tabIndex={0} aria-label={name}>
                      <Image src={src} alt="" width={32} height={32} />
                      <span className="case-tech-stack-tooltip" aria-hidden="true">{name}</span>
                    </li>
                  ))}
                </ul>
                {techStackBadge && <Image {...techStackBadge} className="case-tech-stack-badge" unoptimized />}
              </section>
            )}
          </header>

          <Reveal className="case-copy">
            <h2 id="evidence-title">Project overview</h2>
            <ul className="case-overview-list">
              {overviewTopics.map((topic) => (
                <li key={topic} id={topic === 'Evidence' ? undefined : topic.toLowerCase()}>
                  <strong>{topic}</strong>{' '}{study[topic]}
                </li>
              ))}
            </ul>
          </Reveal>

          <div className="case-visual">
            <CaseStudyCardMatch slug={slug}>
              {cover ? (
                <ProjectScreenshot screenshot={cover} showCaption eager />
              ) : (
                <ProjectPlaceholder visual={visual} title={title} />
              )}
            </CaseStudyCardMatch>
          </div>
          {gallery.map((screenshot) => (
            <Reveal key={screenshot.src} className="case-visual" kind="image">
              <ProjectScreenshot screenshot={screenshot} showCaption />
            </Reveal>
          ))}
        </section>
      </article>
    </main>
  );
}
