import { ArticleView, articleMetadata, articleParams } from '../../../articles/[slug]/article-view';

export const generateStaticParams = articleParams;

export async function generateMetadata({ params }: PageProps<'/articles/[slug]'>) {
  return articleMetadata((await params).slug, 'en');
}

export default async function Page({ params }: PageProps<'/articles/[slug]'>) {
  return <ArticleView slug={(await params).slug} locale="en" />;
}
