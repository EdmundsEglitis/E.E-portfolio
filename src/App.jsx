// src/App.jsx
import AnimeBackground from './components/AnimeBackground';
import { Outlet, useLocation } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import anime from 'animejs';

export default function App() {
  const location = useLocation();
  const isHome = location.pathname === '/';
  const curtainRef = useRef(null);

  useEffect(() => {
    const el = curtainRef.current;
    if (!el) return;

    const tl = anime.timeline({ autoplay: true });
    tl.add({
      targets: el,
      scaleX: [0, 1],
      transformOrigin: 'left center',
      duration: 220,
      easing: 'easeInQuad',
    }).add({
      targets: el,
      scaleX: [1, 0],
      transformOrigin: 'right center',
      duration: 230,
      easing: 'easeOutQuad',
      delay: 20,
    });
    return () => tl.pause();
  }, [location.pathname]);

  return (
    <div className="min-h-screen">
      {/* Background always mounted, fixed and behind content */}
      <AnimeBackground />


      {/* optional curtain element if you use it */}
      <div
        ref={curtainRef}
        className="pointer-events-none fixed inset-0 z-50 bg-black"
        style={{ transform: 'scaleX(0)' }}
        aria-hidden
      />
    </div>
  );
}
