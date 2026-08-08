import SectionLabel from '../components/SectionLabel';
import ProjectCard from '../components/ProjectCard';
import { projects } from '../data/portfolio';

export default function Work() {
  return <section className="section page-section"><SectionLabel>03 — SELECTED WORK</SectionLabel><div className="work-head"><h1>Ideas, systems,<br /><span>shipped.</span></h1><p>A selection of the problems I've enjoyed solving — from product architecture to developer experience.</p></div><div className="project-grid">{projects.map((project, index) => <ProjectCard project={project} index={index} key={project.title} />)}</div></section>;
}
