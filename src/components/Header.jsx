import { ArrowUpRight, Menu, X } from 'lucide-react';
import { FaGithub, FaLinkedinIn } from 'react-icons/fa6';
import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import BrandLogo from './BrandLogo';

const nav = [['Home', '/'], ['About', '/about'], ['Experience', '/experience'], ['Work', '/work'], ['Contact', '/contact']];

export default function Header() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  return (
    <header className="header">
      <BrandLogo />
      <button className="menu" onClick={() => setOpen(!open)} aria-label="Toggle menu">
        {open ? <X /> : <Menu />}
      </button>
      <nav className={open ? 'nav open' : 'nav'}>
        {nav.map(([label, path]) => (
          <Link className={location.pathname === path ? 'active' : ''} key={path} to={path} onClick={() => setOpen(false)}>{label}</Link>
        ))}
      </nav>
      <div className="header-actions">
        <div className="social-links" aria-label="Social links">
          <a href="https://github.com/HimanshuHD" target="_blank" rel="noreferrer" aria-label="GitHub"><FaGithub /></a>
          <a href="https://www.linkedin.com/in/himanshu-digari/" target="_blank" rel="noreferrer" aria-label="LinkedIn"><FaLinkedinIn /></a>
        </div>
        <Link className="header-cta" to="/contact">Let's Connect <ArrowUpRight size={16} /></Link>
      </div>
    </header>
  );
}
