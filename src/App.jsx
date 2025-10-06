import AnimeBackground from './components/AnimeBackground';
import { Outlet } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';

export default function App() {
  return (

    <div className="min-h-screen flex flex-col text-white relative">

      <AnimeBackground />
      <Header />
      <main className="relative z-10 flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
