import type { Metadata } from 'next';
import Image from 'next/image';
import resumePreview from './resume-preview.png';

export const metadata: Metadata = { title: 'Résumé' };

export default function ResumePage() {
  return (
    <main id="main" className="shell resume-page">
      <div className="resume-heading">
        <h1>Résumé</h1>
        <a className="primary-action" href="/max-tay-za-resume.pdf" download="Kyaw_Tay_Za_Resume_Public.pdf">
          Download PDF
        </a>
      </div>
      <div className="resume-document">
        <Image
          src={resumePreview}
          alt="Preview of Kyaw Tay Za’s one-page résumé"
          sizes="(max-width: 760px) calc(100vw - 64px), 800px"
          loading="eager"
        />
      </div>
    </main>
  );
}
