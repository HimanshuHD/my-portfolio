import { ArrowDown, ArrowUpRight, Download, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import SectionLabel from '../components/SectionLabel';
import ProjectCard from '../components/ProjectCard';
import SkillList from '../components/SkillList';
import TechStack from '../components/TechStack';
import InteractiveScene from '../components/home/InteractiveScene';
import { projects, skills } from '../data/portfolio';

const scrollToAbout = () => {
  document.getElementById('about')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

export default function Home() {
  return <>
    <section className="hero hero-3d" aria-labelledby="hero-title">
      <div className="hero-grid">
        <div className="hero-copy hero-copy-animated">
          <div className="eyebrow"><span className="dot" /> Available for the right challenge</div>
          <p className="hero-intro">HELLO, I'M</p>
          <h1 id="hero-title">Himanshu<br /><em>Digari</em></h1>
          <p className="hero-role">TECHNOLOGY LEAD &amp; FRONTEND ENGINEER</p>
          <p className="hero-text">I build scalable, performant and delightful web experiences using modern JavaScript frameworks.</p>
          <TechStack />
          <div className="hero-actions">
            <Link className="button primary" to="/work">View My Work <ArrowUpRight size={18} /></Link>
            <a className="button ghost" href="/resume.pdf" download>Download Resume <Download size={17} /></a>
          </div>
        </div>
        <div className="hero-art hero-art-3d">
          <InteractiveScene />
          <div className="floating-badge badge-one"><Sparkles size={14} /> Interactive by default</div>
          <div className="floating-badge badge-two">Vue · React · JS · TS</div>
        </div>
      </div>
      <button className="scroll-down" type="button" onClick={scrollToAbout} aria-label="Scroll to About section">
        <span className="mouse-icon"><span /></span>
        <span>Scroll Down</span>
        <ArrowDown size={18} />
      </button>
    </section>

    <section className="hero-stats" aria-label="Career highlights">
      <div><strong>7+</strong><span>Years Experience</span></div>
      <div><strong>15+</strong><span>Projects Delivered</span></div>
      <div><strong>12+</strong><span>Happy Clients</span></div>
      <div><strong>1</strong><span>Goal: Impact</span></div>
    </section>

    <section id="about" className="section about"><SectionLabel>01 — ABOUT</SectionLabel><div className="about-content"><h2>Engineering with a <span>human</span> perspective.</h2><div><p>With 7+ years in technology, I specialize in frontend engineering, architecture and technical leadership. My sweet spot is where strong engineering meets thoughtful product experience.</p><p>I care about clean systems, reusable components, accessibility, performance and helping teams do their best work.</p><div className="stats"><div><strong>7+</strong><small>Years in tech</small></div><div><strong>10+</strong><small>Engineers led</small></div><div><strong>30%</strong><small>Dev effort reduced</small></div></div></div></div></section>
    <section className="section skills"><SectionLabel>02 — TOOLKIT</SectionLabel><div className="skills-wrap"><h2>The tools I use to <span>make things work.</span></h2><SkillList skills={skills} /></div></section>
    <section className="section work"><SectionLabel>03 — SELECTED WORK</SectionLabel><div className="work-head"><h2>Ideas, systems,<br /><span>shipped.</span></h2><p>A selection of the problems I've enjoyed solving — from product architecture to developer experience.</p></div><div className="project-grid">{projects.map((project, index) => <ProjectCard project={project} index={index} key={project.title} />)}</div><Link className="button ghost section-button" to="/work">View all work <ArrowUpRight size={18} /></Link></section>
  </>;
}
