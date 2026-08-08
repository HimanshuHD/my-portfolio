import { Link } from 'react-router-dom';

export default function NotFound() {
  return <section className="section page-section not-found"><div className="eyebrow"><span className="dot" /> 404</div><h1>Page not <em>found.</em></h1><p>The page you're looking for doesn't exist.</p><Link className="button primary" to="/">Back home</Link></section>;
}
