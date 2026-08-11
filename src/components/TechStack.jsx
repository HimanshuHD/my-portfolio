import { SiJavascript, SiReact, SiTypescript, SiVuedotjs } from 'react-icons/si';

const technologies = [
  { label: 'Vue.js', Icon: SiVuedotjs, className: 'vue' },
  { label: 'React', Icon: SiReact, className: 'react' },
  { label: 'JavaScript', Icon: SiJavascript, className: 'javascript' },
  { label: 'TypeScript', Icon: SiTypescript, className: 'typescript' }
];

export default function TechStack() {
  return (
    <div className="tech-stack" aria-label="Primary technology stack">
      {technologies.map(({ label, Icon, className }) => (
        <div className="tech-chip" key={label}>
          <span className={`tech-icon ${className}`}><Icon aria-hidden="true" /></span>
          <span>{label}</span>
        </div>
      ))}
    </div>
  );
}
