import { ArrowUpRight, Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';

const nav = [['About', '/about'], ['Experience', '/experience'], ['Work', '/work'], ['Contact', '/contact']];

export default function Header() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  return <header className="header">
    <Link className="logo" to="/">HD<span>.</span></Link>
    <button className="menu" onClick={() => setOpen(!open)} aria-label="Toggle menu">{open ? <X /> : <Menu />}</button>
    <nav className={open ? 'nav open' : 'nav'}>{nav.map(([label, path]) => <Link className={location.pathname === path ? 'active' : ''} key={path} to={path} onClick={() => setOpen(false)}>{label}</Link>)}</nav>
    <Link className="header-cta" to="/contact">Let's talk <ArrowUpRight size={16} /></Link>
  </header>;
}
