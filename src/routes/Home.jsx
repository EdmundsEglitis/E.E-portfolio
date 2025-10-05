import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import anime from 'animejs';
import { useUI } from '../store/uiStore';

export default function Home() {
  const reducedFX = useUI((s) => s.reducedFX);

  useEffect(() => {
    document.title = 'Home — Edmunds Eglītis';

    // Polyfill createDrawable (once)
    if (!anime.createDrawable) {
      anime.createDrawable = function (selectorOrEls) {
        const targets =
          typeof selectorOrEls === 'string'
            ? document.querySelectorAll(selectorOrEls)
            : selectorOrEls;
        return {
          animate: (opts = {}) => anime({ targets, ...opts }),
          targets,
        };
      };
    }

    const tl = anime.timeline({ easing: 'easeOutCubic', duration: 420, autoplay: true });
    tl.add({
      targets: '.h-split > span',
      translateY: [24, 0],
      opacity: [0, 1],
      delay: anime.stagger(45),
    })
      .add(
        { targets: '.cta', opacity: [0, 1], translateY: [12, 0] },
        '-=120'
      )
      .add(
        { targets: '.chip', opacity: [0, 1], translateY: [10, 0], delay: anime.stagger(50) },
        '-=200'
      );

    // text.svg inline drawing
    if (!reducedFX) {
      const drawable = anime.createDrawable('#heroText path');
      drawable.animate({
        targets: '#heroText path',
        strokeDashoffset: [anime.setDashoffset, 0],
        duration: 1200,
        easing: 'easeInOutSine',
        delay: anime.stagger(30),
      });
      anime({ targets: '#heroText', opacity: [0.8, 1], duration: 600, delay: 900 });

      // subtle idle wobble
      const wobble = anime({
        targets: '#heroText',
        rotate: [-0.4, 0.4],
        duration: 4000,
        direction: 'alternate',
        easing: 'easeInOutSine',
        loop: true,
      });

      const onVis = () => (document.hidden ? wobble.pause() : wobble.play());
      document.addEventListener('visibilitychange', onVis);
      return () => {
        wobble.pause();
        document.removeEventListener('visibilitychange', onVis);
      };
    }
  }, [reducedFX]);

  // Split headline into spans for stagger
  const words = ['Building', 'stunning,', 'animated', 'web', 'experiences.'];

  return (
    <section className="relative min-h-[calc(100vh-64px)] flex items-center">
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
        <p className="text-sm tracking-widest uppercase text-white/70 mb-2">Portfolio</p>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight h-split">
          {words.map((w, i) => (
            <span key={i} className={`${w === 'web' ? 'text-gradient' : ''} inline-block mr-2`}>
              {w}
            </span>
          ))}
        </h1>

        {/* Decorative inline text.svg (stroke draw) */}
        <svg
          id="heroText"
          className="mt-4 w-[280px] sm:w-[360px] opacity-90"
          viewBox="0 0 200 36"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden="true"
        >
          <path d="M4 28 C 18 10, 42 10, 56 28" />
          <path d="M60 28 C 76 10, 100 10, 116 28" />
          <path d="M120 28 C 136 10, 160 10, 176 28" />
        </svg>

        <p className="mt-4 max-w-2xl text-white/80 text-lg">
          I’m Edmunds — a junior full-stack developer currently focused on Laravel/React, Explore my selected work and say hello.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link to="/projects" className="card-btn cta">View Projects</Link>
          <Link to="/contact" className="card-btn card-btn--ghost cta">Contact</Link>
        </div>

        <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Chip label="Focus" value="Laravel · React" />
          <Chip label="Style" value="Anime.js · Tailwind" />
          <Chip label="Projects" value="Some projects" to="/projects" />
          <Chip label="About" value="Who am I" to="/about" />
        </div>
      </div>

      {/* vignette */}
      <div className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(ellipse_at_center,transparent_0%,transparent_55%,rgba(0,0,0,0.25)_80%,rgba(0,0,0,0.55)_100%)]" />
    </section>
  );
}

function Chip({ label, value, to }) {
  const Inner = (
    <>
      <span className="text-xs uppercase tracking-wider text-white/60">{label}</span>
      <span className="text-base font-semibold text-white">{value}</span>
    </>
  );
  return to ? (
    <Link to={to} className="card-glass p-3 chip hover:brightness-110 transition">
      {Inner}
    </Link>
  ) : (
    <div className="card-glass p-3 chip">{Inner}</div>
  );
}
