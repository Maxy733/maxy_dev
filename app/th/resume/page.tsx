import { ResumeView } from '../../resume/resume-view';
import { ui } from '../../locale';

export const metadata = { title: ui.th.résumé };

export default function Page() {
  return <ResumeView locale="th" />;
}
