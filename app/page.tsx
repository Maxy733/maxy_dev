import Link from 'next/link';
import { ArticleCarousel } from './articles/carousel';
import { articles } from './articles/content';
import { ArcadeHero } from './components/arcade-hero';
import { ArcadeProjects } from './components/arcade-projects';
import { CareerTimeline } from './components/career-timeline';
import { Reveal } from './components/reveal';
import { contact, projects, resumePath } from './projects';

const carouselArtwork: Record<string, { alt: string; file?: string } | undefined> = {
  'libby-bot': { alt: 'Product illustration of Libby Bot’s book catalog on a laptop beside a closed book.' },
  'internship-performance-analysis': { alt: 'Illustrative box plots on a glass panel beside a survey sheet and pencil.' },
  'data-mining': { alt: 'Illustration of a scatter plot with nearby points highlighted and a small association graph.' },
  'au-document-wallet': {
    file: 'stylized-card-foldable.webp',
    alt: 'Foldable phone mockup showing the AU Wallet home and transcript-sharing screens side by side.',
  },
  'stocksync-ai': { alt: 'Concept illustration of a shopping cart with groceries and a handle-mounted scanner.' },
  'network-security-simulation': { alt: 'Illustration of network lab hardware arranged around a glass shield.' },
};
const firstCarouselProject = 'au-document-wallet';
const carouselOrder = projects.toSorted(
  (first, second) => Number(second.slug === firstCarouselProject) - Number(first.slug === firstCarouselProject),
);
const carouselProjects = carouselOrder.map(({ slug, title, description, ...project }) => {
  const artwork = carouselArtwork[slug];
  const preview = artwork ? {
    src: `/projects/${slug}/${artwork.file ?? 'stylized-card.webp'}`,
    width: 1280,
    height: 720,
    alt: artwork.alt,
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

function CareerTerminalText({ part, text }: {
  part: 'heading' | 'summary' | 'education-title' | 'education-details' | 'skills-title' | 'skills-details';
  text: string;
}) {
  return (
    <span className="career-terminal-text" data-career-terminal={part}>
      <span className="career-terminal-source">{text}</span>
      <span className="career-terminal-output" aria-hidden="true" />
    </span>
  );
}

export default function Home() {
  return (
    <main id="main">
      <ArcadeHero projectsHref={projectsHref} careerHref="#career">
        <h1 id="hero-title">Data Science <span>&amp; Applied AI</span></h1>
        <p>Nice to meet you! I’m Kyaw Tay Za. You can call me Maxy.</p>
        <a className="primary-action" href={projectsHref} data-arcade-zoom>Explore my work</a>
      </ArcadeHero>

      <ArcadeProjects projects={carouselProjects} />

      <section id="career" className="shell portfolio-section" aria-labelledby="career-title">
        <Reveal>
          <h2 id="career-title"><CareerTerminalText part="heading" text="Career" /></h2>
          <div className="career-details">
            <CareerTimeline />
            <div className="career-terminal-panels">
              <p className="career-terminal-panel"><CareerTerminalText part="summary" text={careerSummary} /></p>
              <div className="career-terminal-panel career-education">
                <h3><CareerTerminalText part="education-title" text="Education" /></h3>
                <p><CareerTerminalText part="education-details" text={'B.Sc. in Computer Science\nInformatics and Data Science concentration'} /></p>
                <h3><CareerTerminalText part="skills-title" text="Skills" /></h3>
                <p><CareerTerminalText part="skills-details" text={careerSkills} /></p>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      <section id="articles" className="shell portfolio-section" aria-labelledby="selected-title">
        <Reveal>
          <ArticleCarousel>
            {articles.map((article) => (
              <li key={article.slug}>
                <Link className="data-card" href={`/articles/${article.slug}`} aria-label={`Read ${article.title}`}>
                  <div className="data-card-copy">
                    <p className="eyebrow">{article.category}</p>
                    <h3>{article.title}</h3>
                    <p>{article.description}</p>
                    <span className="text-link">Read article</span>
                  </div>
                </Link>
              </li>
            ))}
          </ArticleCarousel>
        </Reveal>
      </section>

      <section className="closing-panel" aria-label="About and contact">
        <Reveal className="shell closing-grid">
          <div id="about">
            <h2>About me</h2>
            <dl className="credentials">
              <div><dt>Full Name</dt><dd>Kyaw Tay Za</dd></div>
              <div><dt>Nickname</dt><dd>M@xy</dd></div>
              <div><dt>Field</dt><dd>Data Science &amp; Applied AI</dd></div>
              <div><dt>Degree</dt><dd>Computer Science, Assumption University</dd></div>
              <div><dt>Concentration</dt><dd>Informatics and Data Science</dd></div>
              <div><dt>GPA</dt><dd>3.66</dd></div>
              <div><dt>Skills</dt><dd>{aboutSkills.join(', ')}</dd></div>
              <div><dt>Languages</dt><dd>English (IELTS Band 7), Burmese, Thai (still learning)</dd></div>
              <div><dt>Hobbies</dt><dd>Video games, music, drawing, badminton, and swimming</dd></div>
            </dl>
          </div>
          <div id="contact">
            <h2>Get in touch</h2>
            <ul className="contact-list">
              <li><a href={`mailto:${contact.email}`}>Email <small>{contact.email}</small></a></li>
              <li><a href={`https://github.com/${contact.githubUsername}`}>GitHub <small>@{contact.githubUsername}</small></a></li>
              <li><a href={`https://www.linkedin.com/in/${contact.linkedinUsername}/`}>LinkedIn <small>{contact.linkedinUsername}</small></a></li>
              <li><Link href={resumePath}>Preview résumé</Link></li>
            </ul>
          </div>
        </Reveal>
      </section>
    </main>
  );
}
