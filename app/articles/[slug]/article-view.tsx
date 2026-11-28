import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { ProjectScreenshot } from '../../components/project-screenshot';
import { ArticleBackToTop } from '../back-to-top';
import { articles } from '../content';
import { localizedPath, ui, type Locale } from '../../locale';
import { thaiArticleHeadings, thaiArticles } from '../../thai-content';
import './article.css';

const projectArticleSlugs = ['internship-performance-analysis', 'data-mining'];

export function articleParams() {
  return [...articles.map(({ slug }) => ({ slug })), ...projectArticleSlugs.map((slug) => ({ slug }))];
}

export function articleMetadata(slug: string, locale: Locale): Metadata {
  const article = articles.find((item) => item.slug === slug);
  const localized = (locale === 'th' ? thaiArticles[slug] : undefined) ?? article;
  return article && localized ? {
    title: localized.title,
    description: localized.description,
    keywords: [...article.keywords],
  } : {};
}

export function ArticleView({ slug, locale }: { slug: string; locale: Locale }) {
  if (projectArticleSlugs.includes(slug)) redirect(localizedPath(`/work/${slug}`, locale));

  const article = articles.find((item) => item.slug === slug);
  if (!article) notFound();
  const localized = (locale === 'th' ? thaiArticles[slug] : undefined) ?? article;
  const text = ui[locale];
  const heading = (title: string) => locale === 'th' ? thaiArticleHeadings[title] ?? title : title;

  const { abstract, authors, affiliation, keywords, sections, pdfPath } = article;
  return (
    <main id="main">
      <div className="shell article-page">
        <Link className="primary-action case-back" href={localizedPath('/', locale) + '#articles'} aria-label={text.backToArticles}>
          <span aria-hidden="true">←</span> {text.back}
        </Link>
        <article className="article-paper" aria-labelledby="article-title">
          <header className="article-header">
            <p className="article-category">{localized.category}</p>
            <h1 id="article-title">{localized.title}</h1>
            {(!abstract || locale === 'th') && <p className="article-summary">{localized.description}</p>}
            <p className="article-byline">
              {authors?.join(', ') ?? 'Kyaw Tay Za'} <span>{affiliation ? <span lang="en">{affiliation}</span> : text.portfolioArticle}</span>
            </p>
            {pdfPath && <a className="primary-action article-download" href={pdfPath} download>{text.download}</a>}
          </header>

          {abstract && (
            <section id="abstract" className="article-abstract" aria-labelledby="abstract-title">
              <h2 id="abstract-title">{text.abstract}</h2>
              <p lang="en">{abstract}</p>
              <dl className="article-keywords">
                <dt>{text.keywords}</dt>
                <dd lang="en">{keywords.join(', ')}</dd>
              </dl>
            </section>
          )}

          <div className="article-layout" data-summary={!abstract || undefined}>
            <nav className="article-contents" aria-labelledby="article-contents-title">
              <h2 id="article-contents-title">{text.contents}</h2>
              <ul>
                {abstract && <li><a href="#abstract">{text.abstract}</a></li>}
                {sections.map(({ id, title }) => <li key={id}><a href={`#${id}`}>{heading(title)}</a></li>)}
              </ul>
            </nav>

            <div className="article-body" lang="en">
              {sections.map(({ id, title, paragraphs, questions, subsections, link, figures }) => (
                <section key={id} id={id} aria-labelledby={`${id}-title`}>
                  <h2 id={`${id}-title`} lang={locale}>{heading(title)}</h2>
                  {paragraphs?.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                  {questions && <ol>{questions.map((question) => <li key={question}>{question}</li>)}</ol>}
                  {subsections?.map((subsection) => (
                    <div className="article-subsection" key={subsection.title}>
                      <h3 lang={locale}>{heading(subsection.title)}</h3>
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
                      screenshot={{ ...screenshot, caption: `${text.figure} ${index + 1}. ${screenshot.caption}` }}
                      showCaption
                    />
                  ))}
                </section>
              ))}
            </div>
          </div>
        </article>
      </div>
      <ArticleBackToTop key={slug} label={text.backToTop} />
    </main>
  );
}
