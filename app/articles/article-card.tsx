import Image from 'next/image';
import Link from 'next/link';
import { localizedPath, ui, type Locale } from '../locale';
import type { Article } from './content';

const articleLabelArt = new Map([
  ['Research paper', { src: '/article-labels/research-paper.png', width: 248 }],
  ['Applied AI proposal', { src: '/article-labels/applied-ai-proposal.png', width: 325 }],
]);

export function ArticleCard({ slug, title, category, description, locale }: Pick<Article, 'slug' | 'title' | 'category' | 'description'> & { locale: Locale }) {
  const labelArt = articleLabelArt.get(category);

  return (
    <li>
      <Link className="data-card" href={localizedPath("/articles/" + slug, locale)} aria-label={ui[locale].read + " " + title}>
        <div className="data-card-copy">
          <p className="eyebrow article-label">
            <Image className="article-label-icon" src="/article-labels/document.png" width={38} height={44} alt="" unoptimized />
            {labelArt && <Image className="article-label-art" {...labelArt} height={21} alt="" unoptimized />}
            <span className={labelArt ? 'article-label-text' : undefined}>{category}</span>
          </p>
          <h3>{title}</h3>
          <p>{description}</p>
          <span className="text-link">{ui[locale].read} <span aria-hidden="true">→</span></span>
        </div>
      </Link>
    </li>
  );
}
