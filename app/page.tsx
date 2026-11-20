import Link from 'next/link';
import { ProjectPlaceholder } from './components/project-placeholder';
import { Reveal } from './components/reveal';
import { contact, projects, resumePath } from './projects';

const [featured, internship, dataMining, ...moreProjects] = projects;
const selectedProjects = [internship, dataMining];

export default function Home() {
  return (
    <main id="main">
      <section className="shell hero text-center" aria-labelledby="hero-title">
        <h1 id="hero-title">Data Science <span>&amp; Applied AI</span></h1>
        <p>I’m Kyaw ‘Max’ Tay Za, a Computer Science graduate in Bangkok who analyzes data and builds AI applications.</p>
        <a className="primary-action" href="#work">Explore my work</a>
      </section>

      <section id="work" className="shell featured" aria-labelledby="featured-title">
        <Reveal kind="image">
          <ProjectPlaceholder visual={featured.visual} title={featured.title} />
        </Reveal>
        <Reveal className="feature-description split-heading">
          <div>
            <p className="eyebrow">{featured.category}</p>
            <h2 id="featured-title">{featured.title}</h2>
          </div>
          <div className="feature-copy">
            <p>{featured.description}</p>
            <Link className="text-link" href={`/work/${featured.slug}`}>Read the case study</Link>
          </div>
        </Reveal>
      </section>

      <section className="shell portfolio-section" aria-labelledby="selected-title">
        <Reveal>
          <h2 id="selected-title">Selected data work</h2>
          <div className="data-grid">
            {selectedProjects.map((project) => (
              <article className="data-card" key={project.slug}>
                <ProjectPlaceholder visual={project.visual} title={project.title} />
                <div className="data-card-copy">
                  <p className="eyebrow">{project.category}</p>
                  <h3>{project.title}</h3>
                  <p>{project.description}</p>
                  <Link className="text-link" href={`/work/${project.slug}`} aria-label={`View case study for ${project.title}`}>View case study</Link>
                </div>
              </article>
            ))}
          </div>
        </Reveal>
      </section>

      <section className="shell portfolio-section" aria-labelledby="more-title">
        <Reveal>
          <h2 id="more-title">More projects</h2>
          <ul className="project-list">
            {moreProjects.map((project) => (
              <li key={project.slug}>
                <Link className="project-row" href={`/work/${project.slug}`}>
                  <h3>{project.title}</h3>
                  <p>{project.description}</p>
                  <span className="row-link" aria-hidden="true">View project</span>
                </Link>
              </li>
            ))}
          </ul>
        </Reveal>
      </section>

      <section className="closing-panel" aria-label="About and contact">
        <Reveal className="shell closing-grid">
          <div id="about">
            <h2>About me</h2>
            <p className="bio">Short bio to be added.</p>
            <dl className="credentials">
              <div><dt>Degree</dt><dd>Computer Science, Assumption University</dd></div>
              <div><dt>Concentration</dt><dd>Informatics and Data Science</dd></div>
              <div><dt>GPA</dt><dd>3.66</dd></div>
              <div><dt>Skills</dt><dd>Python, SQL, Pandas, applied AI</dd></div>
            </dl>
          </div>
          <div id="contact">
            <h2>Get in touch</h2>
            <ul className="contact-list">
              <li><a href={`mailto:${contact.email}`}>Email <small>{contact.email}</small></a></li>
              <li><a href={`https://github.com/${contact.githubUsername}`}>GitHub <small>@{contact.githubUsername}</small></a></li>
              <li><Link href={resumePath}>Preview résumé</Link></li>
            </ul>
          </div>
        </Reveal>
      </section>
    </main>
  );
}
