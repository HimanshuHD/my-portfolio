import React from 'react';
import { createRoot } from 'react-dom/client';
import { ArrowUpRight, Github, Linkedin, Mail, MapPin, Menu, X, Download, ExternalLink } from 'lucide-react';
import './styles.css';

const skills = ['Vue.js', 'React', 'JavaScript', 'TypeScript', 'HTML & CSS', 'Frontend Architecture', 'Performance', 'Accessibility', 'I18n', 'Webpack', 'Git', 'Agile / Scrum'];

const projects = [
  { title: 'Discovery Education Platform', type: 'EdTech · Frontend Architecture', text: 'Led a 10+ engineer frontend team and evolved a client framework to reduce development effort by around 30%.', tags: ['Vue.js', 'Architecture', 'Leadership'] },
  { title: 'Reusable UI Systems', type: 'Design Systems · DX', text: 'Built reusable patterns and components that improved consistency, delivery speed and maintainability across product surfaces.', tags: ['Vue', 'SCSS', 'Components'] },
  { title: 'Modern Web Experiences', type: 'Performance · Accessibility', text: 'Focused on responsive, accessible and high-performance interfaces across complex web applications and hybrid mobile experiences.', tags: ['A11y', 'I18n', 'Performance'] }
];

function App() {
  const [open, setOpen] = React.useState(false);
  const nav = ['About', 'Experience', 'Work', 'Contact'];
  return <div className="site">
    <header className="header">
      <a className="logo" href="#top">HD<span>.</span></a>
      <button className="menu" onClick={() => setOpen(!open)} aria-label="Toggle menu">{open ? <X/> : <Menu/>}</button>
      <nav className={open ? 'nav open' : 'nav'}>{nav.map(item => <a key={item} href={'#'+item.toLowerCase()} onClick={() => setOpen(false)}>{item}</a>)}</nav>
      <a className="header-cta" href="#contact">Let's talk <ArrowUpRight size={16}/></a>
    </header>

    <main id="top">
      <section className="hero">
        <div className="hero-grid">
          <div className="hero-copy">
            <div className="eyebrow"><span className="dot"/> Available for the right challenge</div>
            <h1>Building digital<br/><em>experiences</em> that matter.</h1>
            <p className="hero-text">I'm Himanshu — a Technology Lead and Frontend Engineer turning complex product ideas into fast, scalable and delightful web experiences.</p>
            <div className="hero-actions"><a className="button primary" href="#work">Explore my work <ArrowUpRight size={18}/></a><a className="button ghost" href="#contact">Get in touch</a></div>
          </div>
          <div className="hero-art" aria-hidden="true"><div className="orb orb-a"/><div className="orb orb-b"/><div className="code-card"><span>const</span> engineer = {'{'}<br/><b>  focus:</b> 'impact',<br/><b>  craft:</b> 'frontend',<br/><b>  mindset:</b> 'systems'<br/>{'}'};</div></div>
        </div>
        <div className="scroll-note">SCROLL TO EXPLORE <span>↓</span></div>
      </section>

      <section className="section about" id="about"><div className="section-label">01 — ABOUT</div><div className="about-content"><h2>Engineering with a <span>human</span> perspective.</h2><div><p>With 7+ years in technology, I specialize in frontend engineering, architecture and technical leadership. My sweet spot is where strong engineering meets thoughtful product experience.</p><p>I care about clean systems, reusable components, accessibility, performance and helping teams do their best work.</p><div className="stats"><div><strong>7+</strong><small>Years in tech</small></div><div><strong>10+</strong><small>Engineers led</small></div><div><strong>30%</strong><small>Dev effort reduced</small></div></div></div></div></section>

      <section className="section experience" id="experience"><div className="section-label">02 — EXPERIENCE</div><div className="timeline"><article><div className="time">TECHNOLOGY LEAD · PRESENT</div><h3>Technical direction, without losing the craft.</h3><p>Leading frontend engineering initiatives, mentoring engineers and making architecture decisions for scalable product experiences.</p><ul><li>Lead a frontend team and establish engineering standards.</li><li>Drive architecture, performance and reusable component strategy.</li><li>Mentor engineers and help teams grow through practical learning.</li></ul></article><article><div className="time">FRONTEND ENGINEER · DISCOVERY EDUCATION</div><h3>Turning a framework into a force multiplier.</h3><p>Led a 10+ engineer team working with a client-designed Vue.js framework and enhanced the framework to reduce development effort by around 30%.</p><ul><li>Built and evolved reusable frontend patterns.</li><li>Improved developer experience and delivery efficiency.</li><li>Received a Delivery Excellence award for the work.</li></ul></article></div></section>

      <section className="section skills"><div className="section-label">03 — TOOLKIT</div><div className="skills-wrap"><h2>The tools I use to <span>make things work.</span></h2><div className="skill-list">{skills.map((skill, i) => <span key={skill}><b>0{i+1}</b>{skill}</span>)}</div></div></section>

      <section className="section work" id="work"><div className="section-label">04 — SELECTED WORK</div><div className="work-head"><h2>Ideas, systems,<br/><span>shipped.</span></h2><p>A selection of the problems I've enjoyed solving — from product architecture to developer experience.</p></div><div className="project-grid">{projects.map((p, i) => <article className="project" key={p.title}><div className="project-number">0{i+1}</div><div><div className="time">{p.type}</div><h3>{p.title}</h3><p>{p.text}</p><div className="tags">{p.tags.map(t => <span key={t}>{t}</span>)}</div></div><ExternalLink size={20}/></article>)}</div></section>

      <section className="contact" id="contact"><div className="section-label">05 — CONTACT</div><div className="contact-inner"><div><p className="kicker">HAVE A PROJECT IN MIND?</p><h2>Let's build something<br/><em>worth talking about.</em></h2></div><a className="contact-mail" href="mailto:himanshudigari@gmail.com">himanshudigari@gmail.com <ArrowUpRight/></a></div><div className="contact-meta"><span><MapPin size={16}/> India</span><span>Frontend · Architecture · Leadership</span></div></section>
    </main>
    <footer><span>© {new Date().getFullYear()} Himanshu Digari</span><div><a href="https://github.com/HimanshuHD" target="_blank" rel="noreferrer"><Github size={18}/></a><a href="https://www.linkedin.com/in/himanshudigari/" target="_blank" rel="noreferrer"><Linkedin size={18}/></a><a href="mailto:himanshudigari@gmail.com"><Mail size={18}/></a></div></footer>
  </div>
}
createRoot(document.getElementById('root')).render(<App />);
