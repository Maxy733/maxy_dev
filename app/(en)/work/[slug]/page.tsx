import { CaseStudy, caseStudyMetadata, caseStudyParams } from '../../../work/[slug]/case-study';

export const generateStaticParams = caseStudyParams;

export async function generateMetadata({ params }: PageProps<'/work/[slug]'>) {
  return caseStudyMetadata((await params).slug, 'en');
}

export default async function Page({ params }: PageProps<'/work/[slug]'>) {
  return <CaseStudy slug={(await params).slug} locale="en" />;
}
