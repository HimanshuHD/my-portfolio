import { ExternalLink } from 'lucide-react';

export default function ProjectCard({ project, index }) {
  return <article className="project">
    <div className="project-number">0{index + 1}</div>
    <div>
      <div className="time">{project.type}</div>
      <h3>{project.title}</h3>
      <p>{project.text}</p>
      <div className="tags">{project.tags.map(tag => <span key={tag}>{tag}</span>)}</div>
    </div>
    <ExternalLink size={20} />
  </article>;
}
