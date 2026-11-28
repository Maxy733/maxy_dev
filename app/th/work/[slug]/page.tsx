import { CaseStudy, caseStudyMetadata, caseStudyParams } from '../../../work/[slug]/case-study';

export const generateStaticParams = caseStudyParams;

export async function generateMetadata({ params }: PageProps<'/th/work/[slug]'>) {
  return caseStudyMetadata((await params).slug, 'th');
}

export default async function Page({ params }: PageProps<'/th/work/[slug]'>) {
  return <CaseStudy slug={(await params).slug} locale="th" />;
}
