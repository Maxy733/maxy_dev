import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CaseStudyCardMatch } from '../../components/case-study-match';
import { ProjectPlaceholder } from '../../components/project-placeholder';
import { ProjectScreenshot } from '../../components/project-screenshot';
import { Reveal } from '../../components/reveal';
import { overviewTopics, projects, type Project } from '../../projects';
import { localizedPath, ui, type Locale } from '../../locale';
import { localizeThaiProjectImage, thaiProjects } from '../../thai-content';
import './case-study.css';

export const caseStudyParams = () => projects.map(({ slug }) => ({ slug }));

export function caseStudyMetadata(slug: string, locale: Locale): Metadata {
  const project = projects.find((item) => item.slug === slug);
  if (!project) return {};
  const { title, description } = { ...project, ...(locale === 'th' ? thaiProjects[slug] : undefined) };
  return { title, description };
}

const thaiTopics = { Question: 'คำถาม', Data: 'ข้อมูล', Approach: 'แนวทาง', Evidence: 'ผลลัพธ์และหลักฐาน' };

export function CaseStudy({ slug, locale }: { slug: string; locale: Locale }) {
  const project: Project | undefined = projects.find((item) => item.slug === slug);
  if (!project) notFound();
  const { screenshots, techStack, techStackBadge, visual = 'screenshot' } = project;
  const { title, description, study } = { ...project, ...(locale === 'th' ? thaiProjects[slug] : undefined) };
  const text = ui[locale];
  const [cover, ...gallery] = locale === 'th' ? screenshots?.map(localizeThaiProjectImage) ?? [] : screenshots ?? [];

  return (
    <main id="main" className="shell case-page">
      <Link className="primary-action case-back" href={localizedPath('/', locale) + '#work'} data-case-study-project={slug}>
        <span aria-hidden="true">←</span> {text.back}
      </Link>

      <article className="case-study" aria-label={text.caseStudy}>
        <section id="evidence" className="case-overview" aria-labelledby="evidence-title">
          <header className="case-header">
            <h1>{title}</h1>
            <p className="case-description">{description}</p>
            {!!techStack?.length && (
              <section className="case-tech-stack" aria-labelledby="tech-stack-title">
                <h2 id="tech-stack-title">{text.stack}</h2>
                <ul role="list">
                  {techStack.map(({ name, src }) => {
                    const label = locale === 'th' ? name.replace(/ \(planned\)$/, ' (อยู่ในแผน)') : name;
                    return (
                      <li key={src} tabIndex={0} aria-label={label}>
                        <Image src={src} alt="" width={32} height={32} />
                        <span className="case-tech-stack-tooltip" aria-hidden="true">{label}</span>
                      </li>
                    );
                  })}
                </ul>
                {techStackBadge && <Image {...techStackBadge} alt={locale === 'th' ? 'ตรารับรองการอบรม AWS Academy Cloud Security Foundations' : techStackBadge.alt} className="case-tech-stack-badge" unoptimized />}
              </section>
            )}
          </header>

          <Reveal className="case-copy">
            <h2 id="evidence-title">{text.overview}</h2>
            <ul className="case-overview-list">
              {overviewTopics.map((topic) => {
                const content = study[topic];
                return (
                  <li key={topic} id={topic === 'Evidence' ? undefined : topic.toLowerCase()}>
                    <strong>{locale === 'th' ? thaiTopics[topic] : topic}</strong>{' '}
                    {typeof content === 'string' ? content : content.map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                  </li>
                );
              })}
            </ul>
          </Reveal>

          <div className="case-visual">
            <CaseStudyCardMatch slug={slug}>
              {cover ? (
                <ProjectScreenshot screenshot={cover} showCaption eager />
              ) : (
                <ProjectPlaceholder visual={visual} title={title} locale={locale} />
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
