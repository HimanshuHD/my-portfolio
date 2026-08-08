import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PageTransition from '../components/PageTransition';

export default function MainLayout() {
  return <div className="site"><Header /><main><PageTransition><Outlet /></PageTransition></main><Footer /></div>;
}
