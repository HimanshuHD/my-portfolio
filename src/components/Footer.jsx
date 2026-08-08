import { ExternalLink, Mail } from 'lucide-react';

export default function Footer() {
  return <footer><span>© {new Date().getFullYear()} Himanshu Digari</span><div><a href="https://github.com/HimanshuHD" target="_blank" rel="noreferrer">GitHub <ExternalLink size={14} /></a><a href="https://www.linkedin.com/in/himanshudigari/" target="_blank" rel="noreferrer">LinkedIn <ExternalLink size={14} /></a><a href="mailto:himanshudigari@gmail.com"><Mail size={18} /></a></div></footer>;
}
