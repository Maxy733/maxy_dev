import { ArticleView, articleMetadata, articleParams } from '../../../articles/[slug]/article-view';

export const generateStaticParams = articleParams;

export async function generateMetadata({ params }: PageProps<'/th/articles/[slug]'>) {
  return articleMetadata((await params).slug, 'th');
}

export default async function Page({ params }: PageProps<'/th/articles/[slug]'>) {
  return <ArticleView slug={(await params).slug} locale="th" />;
}
