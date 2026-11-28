import Link from 'next/link';
import { ArticleCard } from './articles/article-card';
import { ArticleCarousel } from './articles/carousel';
import { articles } from './articles/content';
import { ArcadeHero } from './components/arcade-hero';
import { ArcadeProjects } from './components/arcade-projects';
import { CareerTimeline } from './components/career-timeline';
import { Reveal } from './components/reveal';
import { TerminalReveal } from './components/terminal-reveal';
import { TerminalText } from './components/terminal-text';
import { contact, projects, resumePath } from './projects';
import { localizedPath, ui, type Locale } from './locale';
import { thaiAboutFields, thaiArticles, thaiCareer, thaiFeaturedArtwork, thaiProjects } from './thai-content';
import './home.css';

const carouselArtwork: Record<string, string | undefined> = {
  'libby-bot': 'Pixel-art laptop showing Libby Bot’s book catalog, with a closed book beside it.',
  'network-security-simulation': 'Pixel-art shield and padlock above a network switch connected to two servers.',
  'au-document-wallet': 'Pixel-art foldable phone showing the AU Wallet home and transcript-sharing screens at a registrar’s desk.',
  'internship-performance-analysis': 'Pixel-art reports with pink and cyan box plots beside a checklist and calculator.',
  'stocksync-ai': 'Pixel-art shopping cart with a mounted scanner reading a barcode on a grocery shelf.',
  'data-mining': 'Pixel-art scatter plot with highlighted neighbors and a network of connected media icons.',
};
const firstCarouselProject = 'au-document-wallet';
const carouselOrder = projects.toSorted(
  (first, second) => Number(second.slug === firstCarouselProject) - Number(first.slug === firstCarouselProject),
);
const carouselProjects = carouselOrder.map(({ slug, title, description, ...project }) => {
  const artwork = carouselArtwork[slug];
  const preview = artwork ? {
    src: `/projects/${slug}/featured-preview.webp`,
    width: 1672,
    height: 941,
    alt: artwork,
    caption: '',
  } : 'preview' in project ? project.preview : undefined;

  return {
    slug, title, description, preview,
    visual: 'visual' in project ? project.visual : undefined,
    screenshot: 'screenshots' in project ? project.screenshots[0] : undefined,
  };
});
const projectsHref = '#projects';
const careerSummary = `I’m interested in roles in data science, applied AI, and software development. Also crazy about video games, music, many types of art form, drawing, badminton, and swimming.

Even though I might not have much skills, I'm truly willing to learn, improve, meet with interesting people, and travel around the world with them.`;
const careerSkills = 'Python, SQL, applied AI, recommendation systems, and React Native';
const aboutSkills = [
  'Python, SQL, pandas, Looker Studio, Excel Solver',
  'Applied AI, scikit-learn, KNN, Apriori, recommendation systems',
  'TypeScript, React Native, Expo, Next.js, Tailwind CSS',
  'Flask, PostgreSQL, AWS',
];
const englishAboutFields = [
  ['Full Name', 'Kyaw Tay Za'],
  ['Nickname', 'M@xy'],
  ['Field', 'Data Science & Applied AI'],
  ['Degree', 'Computer Science, Assumption University'],
  ['Concentration', 'Informatics and Data Science'],
  ['GPA', '3.66'],
  ['Skills', aboutSkills.join(', ')],
  ['Languages', 'English (IELTS Band 7)\nBurmese\nThai (work in progress..)'],
  ['Hobbies', 'Video games, music, drawing, badminton, and swimming'],
];

export function Home({ locale }: { locale: Locale }) {
  const thai = locale === 'th';
  const text = ui[locale];
  const aboutFields = thai ? thaiAboutFields : englishAboutFields;
  const featuredProjects = thai ? carouselProjects.map((project) => {
    const { title, description } = { ...project, ...thaiProjects[project.slug] };
    return {
      ...project,
      title,
      description,
      preview: project.preview && {
        ...project.preview,
        alt: thaiFeaturedArtwork[project.slug] ?? project.preview.alt,
      },
    };
  }) : carouselProjects;
  return (
    <main id="main">
      <ArcadeHero projectsHref={projectsHref} careerHref="#career" locale={locale}>
        <h1 id="hero-title">{thai ? 'วิทยาการข้อมูล' : 'Data Science'} <span>{thai ? 'และ AI ประยุกต์' : '& Applied AI'}</span></h1>
        <p>
          {thai ? 'ยินดีที่ได้รู้จักครับ ผมเป็นนักพัฒนาคนหนึ่ง เรียกผมว่า' : 'Nice to meet you! I’m a small developer & you can call me'}{' '}
          <Link href={localizedPath('/', locale) + '#about'} className="hero-about-link" aria-describedby="hero-about-hint">
            Maxy
            <span className="arcade-hotspot-hint hero-about-hint" id="hero-about-hint" role="tooltip">{text.about}</span>
          </Link>{thai ? ' ก็ได้ครับ' : '.'}
        </p>
        <a className="primary-action" href={projectsHref} data-arcade-zoom>{text.explore}</a>
      </ArcadeHero>

      <ArcadeProjects projects={featuredProjects} locale={locale} />

      <section id="career" className="shell portfolio-section" aria-labelledby="career-title">
        <Reveal>
          <h2 id="career-title"><TerminalText part="heading" text={text.career} /></h2>
          <div className="career-details">
            <CareerTimeline locale={locale} />
            <div className="career-terminal-panels">
              <p className="career-terminal-panel"><TerminalText part="summary" text={thai ? thaiCareer.summary : careerSummary} /></p>
              <div className="career-terminal-panel career-education">
                <h3><TerminalText part="education-title" text={text.education} /></h3>
                <p><TerminalText part="education-details" text={thai ? thaiCareer.education : 'B.Sc. in Computer Science\nInformatics and Data Science concentration'} /></p>
                <h3><TerminalText part="skills-title" text={text.skills} /></h3>
                <p><TerminalText part="skills-details" text={thai ? thaiCareer.skills : careerSkills} /></p>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      <section id="articles" className="shell article-section portfolio-section" aria-labelledby="selected-title">
        <Reveal>
          <ArticleCarousel locale={locale}>
            {articles.map((article) => (
              <ArticleCard key={article.slug} {...article} {...(thai ? thaiArticles[article.slug] : undefined)} locale={locale} />
            ))}
          </ArticleCarousel>
        </Reveal>
      </section>

      <section className="closing-panel" aria-label={text.aboutContact}>
        <Reveal className="shell closing-grid">
          <TerminalReveal id="about" heading={text.aboutMe} as="dl" className="credentials">
            {aboutFields.map(([label, value]) => (
              <div key={label}>
                <dt><TerminalText text={label} /></dt>
                <dd><TerminalText text={value} /></dd>
              </div>
            ))}
          </TerminalReveal>
          <TerminalReveal id="contact" heading={text.contact} as="ul" className="contact-list">
            <li><a href={`mailto:${contact.email}`}>
              <TerminalText text={text.email} /> <small><TerminalText text={contact.email} /></small>
            </a></li>
            <li><a href={`https://github.com/${contact.githubUsername}`}>
              <TerminalText text="GitHub" /> <small><TerminalText text={`@${contact.githubUsername}`} /></small>
            </a></li>
            <li><a href={`https://www.linkedin.com/in/${contact.linkedinUsername}/`}>
              <TerminalText text="LinkedIn" /> <small><TerminalText text={contact.linkedinUsername} /></small>
            </a></li>
            <li><Link href={localizedPath(resumePath, locale)}><TerminalText text={text.previewRésumé} /></Link></li>
          </TerminalReveal>
        </Reveal>
      </section>
      <footer className="homepage-credit">
        {text.credit} <a className="text-link" href={`https://github.com/${contact.githubUsername}/maxy_dev`}>Kyaw Tay Za</a>
      </footer>
    </main>
  );
}
