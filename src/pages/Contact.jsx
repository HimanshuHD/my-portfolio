import { ArrowUpRight, MapPin } from 'lucide-react';
import SectionLabel from '../components/SectionLabel';

export default function Contact() {
  return <section className="contact page-contact"><SectionLabel>04 — CONTACT</SectionLabel><div className="contact-inner"><div><p className="kicker">HAVE A PROJECT IN MIND?</p><h1>Let's build something<br /><em>worth talking about.</em></h1></div><a className="contact-mail" href="mailto:himanshudigari@gmail.com">himanshudigari@gmail.com <ArrowUpRight /></a></div><div className="contact-meta"><span><MapPin size={16} /> India</span><span>Frontend · Architecture · Leadership</span></div></section>;
}
