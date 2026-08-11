import { Link } from 'react-router-dom';

export default function BrandLogo() {
  return (
    <Link className="brand-logo" to="/" aria-label="Himanshu Digari home">
      <svg viewBox="0 0 92 52" role="img" aria-hidden="true">
        <path className="brand-mark-accent" d="M6 7h11v14h12V7h11v38H29V31H17v14H6z" />
        <path className="brand-mark-light" d="M48 7h15c13 0 22 7 22 19s-9 19-22 19H48zm12 10v18h3c6 0 10-3 10-9s-4-9-10-9z" />
      </svg>
    </Link>
  );
}
