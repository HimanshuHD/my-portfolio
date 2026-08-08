import { ArrowUpRight, Cpu, Gamepad2, Headphones, Laptop, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import SectionLabel from '../components/SectionLabel';
import ProjectCard from '../components/ProjectCard';
import SkillList from '../components/SkillList';
import InteractiveScene from '../components/home/InteractiveScene';
import { projects, skills } from '../data/portfolio';

const playfulItems = [
  { icon: Laptop, label: 'Build', note: 'Interfaces' },
  { icon: Cpu, label: 'Think', note: 'Systems' },
  { icon: Headphones, label: 'Tune', note: 'Details' },
  { icon: Gamepad2, label: 'Play', note: 'Ideas' }
];

export default function Home() {
  return <>
    <section className="hero hero-3d">
      <div className="hero-grid">
        <div className="hero-copy hero-copy-animated">
          <div className="eyebrow"><span className="dot" /> Available for the right challenge</div>
          <p className="hero-intro">HELLO, I'M HIMANSHU</p>
          <h1>Building digital<br /><em>experiences</em> that matter.</h1>
          <p className="hero-text">Technology Lead & Frontend Engineer turning complex product ideas into fast, scalable and delightful web experiences.</p>
          <div className="hero-actions">
            <Link className="button primary" to="/work">Explore my work <ArrowUpRight size={18} /></Link>
            <Link className="button ghost" to="/contact">Get in touch</Link>
          </div>
          <div className="playful-strip" aria-label="What I bring to projects">
            {playfulItems.map(({ icon: Icon, label, note }) => <div className="playful-item" key={label}><Icon size={17} /><span><b>{label}</b><small>{note}</small></span></div>)}
          </div>
        </div>
        <div className="hero-art hero-art-3d">
          <InteractiveScene />
          <div className="floating-badge badge-one"><Sparkles size={14} /> Interactive by default</div>
          <div className="floating-badge badge-two">Vue · React · JS</div>
        </div>
      </div>
      <div className="scroll-note">EXPLORE THE PORTFOLIO <span>↓</span></div>
    </section>
    <section className="section about"><SectionLabel>01 — ABOUT</SectionLabel><div className="about-content"><h2>Engineering with a <span>human</span> perspective.</h2><div><p>With 7+ years in technology, I specialize in frontend engineering, architecture and technical leadership. My sweet spot is where strong engineering meets thoughtful product experience.</p><p>I care about clean systems, reusable components, accessibility, performance and helping teams do their best work.</p><div className="stats"><div><strong>7+</strong><small>Years in tech</small></div><div><strong>10+</strong><small>Engineers led</small></div><div><strong>30%</strong><small>Dev effort reduced</small></div></div></div></div></section>
    <section className="section skills"><SectionLabel>02 — TOOLKIT</SectionLabel><div className="skills-wrap"><h2>The tools I use to <span>make things work.</span></h2><SkillList skills={skills} /></div></section>
    <section className="section work"><SectionLabel>03 — SELECTED WORK</SectionLabel><div className="work-head"><h2>Ideas, systems,<br /><span>shipped.</span></h2><p>A selection of the problems I've enjoyed solving — from product architecture to developer experience.</p></div><div className="project-grid">{projects.map((project, index) => <ProjectCard project={project} index={index} key={project.title} />)}</div><Link className="button ghost section-button" to="/work">View all work <ArrowUpRight size={18} /></Link></section>
  </>;
}
