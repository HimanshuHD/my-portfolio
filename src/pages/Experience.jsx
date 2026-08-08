import SectionLabel from '../components/SectionLabel';
import { experiences } from '../data/portfolio';

export default function Experience() {
  return <section className="section page-section"><SectionLabel>02 — EXPERIENCE</SectionLabel><div className="timeline">{experiences.map(item => <article key={item.time}><div className="time">{item.time}</div><h2>{item.title}</h2><p>{item.text}</p><ul>{item.bullets.map(bullet => <li key={bullet}>{bullet}</li>)}</ul></article>)}</div></section>;
}
