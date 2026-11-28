import Image from 'next/image';
import Link from 'next/link';
import resumePreview from './resume-preview.png';
import { localizedPath, ui, type Locale } from '../locale';
import './resume.css';

export function ResumeView({ locale }: { locale: Locale }) {
  const text = ui[locale];
  return (
    <main id="main" className="shell resume-page">
      <Link className="primary-action case-back" href={localizedPath('/', locale)}>
        <span aria-hidden="true">←</span> {text.back}
      </Link>
      <div className="resume-heading">
        <h1>{text.résumé}</h1>
        <a className="primary-action" href="/max-tay-za-resume.pdf" download="Kyaw_Tay_Za_Resume_Public.pdf">
          {text.download}
        </a>
      </div>
      <div className="resume-document">
        <Image
          src={resumePreview}
          alt={locale === 'th' ? 'ตัวอย่างเรซูเม่หนึ่งหน้าของ Kyaw Tay Za (ภาษาอังกฤษ)' : 'Preview of Kyaw Tay Za’s one-page résumé'}
          sizes="(max-width: 760px) calc(100vw - 64px), 800px"
          loading="eager"
        />
      </div>
    </main>
  );
}
