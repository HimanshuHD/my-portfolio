import { HashRouter, Route, Routes } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import About from './pages/About';
import Experience from './pages/Experience';
import Work from './pages/Work';
import Contact from './pages/Contact';
import RubiksTestPage from './pages/RubiksTestPage';
import NotFound from './pages/NotFound';

export default function App() {
  return <HashRouter>
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/experience" element={<Experience />} />
        <Route path="/work" element={<Work />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/rubiks-test" element={<RubiksTestPage />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  </HashRouter>;
}
