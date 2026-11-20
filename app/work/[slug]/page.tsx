import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ProjectPlaceholder } from '../../components/project-placeholder';
import { Reveal } from '../../components/reveal';
import { projects, studySections } from '../../projects';

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
  const project = projects.find((item) => item.slug === slug);
  if (!project) notFound();

  return (
    <main id="main" className="shell case-page">
      <header className="case-header prose-column">
        <Link className="text-link" href="/#work">All work</Link>
        <p className="eyebrow">{project.category}</p>
        <h1>{project.title}</h1>
        <p>{project.description}</p>
      </header>

      <article className="case-study" aria-label="Case study">
        {studySections.map((heading) => {
          const id = heading.toLowerCase().replaceAll(' ', '-');
          return (
            <section key={heading} id={id} aria-labelledby={`${id}-title`}>
              <Reveal className="prose-column case-copy">
                <h2 id={`${id}-title`}>{heading}</h2>
                <p>{project.study[heading]}</p>
              </Reveal>
              {heading === 'Evidence' && 'visual' in project && (
                <Reveal className="case-visual" kind={project.visual === 'screenshot' ? 'image' : 'section'}>
                  <ProjectPlaceholder visual={project.visual} title={project.title} />
                </Reveal>
              )}
            </section>
          );
        })}
      </article>
    </main>
  );
}
