import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { ProjectScreenshot } from '../../components/project-screenshot';
import { ArticleBackToTop } from '../back-to-top';
import { articles } from '../content';

type Props = PageProps<'/articles/[slug]'>;
const projectArticleSlugs = ['internship-performance-analysis', 'data-mining'];

export function generateStaticParams() {
  return [...articles.map(({ slug }) => ({ slug })), ...projectArticleSlugs.map((slug) => ({ slug }))];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = articles.find((item) => item.slug === slug);
  return article ? {
    title: article.title,
    description: article.description,
    keywords: [...article.keywords],
  } : {};
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  if (projectArticleSlugs.includes(slug)) redirect(`/work/${slug}`);

  const article = articles.find((item) => item.slug === slug);
  if (!article) notFound();

  const { abstract, authors, affiliation, keywords, sections, pdfPath } = article;
  return (
    <main id="main">
      <div className="shell article-page">
        <Link className="primary-action case-back" href="/#articles" aria-label="Back to Articles">
          <span aria-hidden="true">←</span> Back
        </Link>
        <article className="article-paper" aria-labelledby="article-title">
          <header className="article-header">
            <p className="article-category">{article.category}</p>
            <h1 id="article-title">{article.title}</h1>
            {!abstract && <p className="article-summary">{article.description}</p>}
            <p className="article-byline">
              {authors?.join(', ') ?? 'Kyaw Tay Za'} <span>{affiliation ?? 'Portfolio write-up'}</span>
            </p>
            {pdfPath && <a className="primary-action article-download" href={pdfPath} download>Download PDF</a>}
          </header>

          {abstract && (
            <section id="abstract" className="article-abstract" aria-labelledby="abstract-title">
              <h2 id="abstract-title">Abstract</h2>
              <p>{abstract}</p>
              <dl className="article-keywords">
                <dt>Keywords</dt>
                <dd>{keywords.join(', ')}</dd>
              </dl>
            </section>
          )}

          <div className="article-layout" data-summary={!abstract || undefined}>
            <nav className="article-contents" aria-labelledby="article-contents-title">
              <h2 id="article-contents-title">Contents</h2>
              <ul>
                {abstract && <li><a href="#abstract">Abstract</a></li>}
                {sections.map(({ id, title }) => <li key={id}><a href={`#${id}`}>{title}</a></li>)}
              </ul>
            </nav>

            <div className="article-body">
              {sections.map(({ id, title, paragraphs, questions, subsections, link, figures }) => (
                <section key={id} id={id} aria-labelledby={`${id}-title`}>
                  <h2 id={`${id}-title`}>{title}</h2>
                  {paragraphs?.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                  {questions && <ol>{questions.map((question) => <li key={question}>{question}</li>)}</ol>}
                  {subsections?.map((subsection) => (
                    <div className="article-subsection" key={subsection.title}>
                      <h3>{subsection.title}</h3>
                      {subsection.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                    </div>
                  ))}
                  {link && (
                    <p>
                      <a className="text-link" href={link.href} target="_blank" rel="noopener noreferrer">
                        {link.label} <span aria-hidden="true">↗</span>
                      </a>
                    </p>
                  )}
                  {figures?.map((screenshot, index) => (
                    <ProjectScreenshot
                      key={screenshot.src}
                      screenshot={{ ...screenshot, caption: `Figure ${index + 1}. ${screenshot.caption}` }}
                      showCaption
                    />
                  ))}
                </section>
              ))}
            </div>
          </div>
        </article>
      </div>
      <ArticleBackToTop key={slug} />
    </main>
  );
}
