// src/App.jsx
import AnimeBackground from './components/AnimeBackground';
import { Outlet } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';

export default function App() {
  return (
    // Make the whole app a column so the footer sits at the end
    <div className="min-h-screen flex flex-col text-white relative">
      {/* Fixed background sphere behind everything */}
      <AnimeBackground />

      {/* Sticky header stays on top */}
      <Header />

      {/* Main grows to fill available space so footer sticks to bottom */}
      <main className="relative z-10 flex-1">
        <Outlet />
      </main>

      {/* Compact footer, now reliably at the bottom */}
      <Footer />
    </div>
  );
}
