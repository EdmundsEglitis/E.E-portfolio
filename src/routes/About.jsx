import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import anime from 'animejs';

function SkillCard({ src, alt }) {
  const cardRef = useRef(null);

  // Per-card tilt using anime; smooth and bounded
  const onMove = (e) => {
    const el = cardRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;  // -0.5..0.5
    const y = (e.clientY - r.top) / r.height - 0.5;

    anime({
      targets: el,
      duration: 140,
      easing: 'easeOutQuad',
      rotateY: x * 10,
      rotateX: -y * 10,
      translateZ: 8,
    });
  };

  const onLeave = () => {
    const el = cardRef.current;
    if (!el) return;
    anime({
      targets: el,
      duration: 220,
      easing: 'easeOutQuad',
      rotateX: 0,
      rotateY: 0,
      translateZ: 0,
    });
  };

  return (
    <div
      ref={cardRef}
      className="skill-card rounded-xl bg-white/5 border border-white/10 p-4 grid place-items-center will-change-transform"
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      title={alt}
      tabIndex={0}
    >
      <img className="skill-logo h-12 w-auto opacity-0" src={src} alt={alt} loading="lazy" />
    </div>
  );
}

export default function About() {
  useEffect(() => {
    document.title = 'About — Edmunds Eglītis';
    const reduced =
      window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false;

    // Entrance reveal
    const tl = anime.timeline({ autoplay: true });
    tl.add({
      targets: '[data-underline]',
      scaleX: [0, 1],
      easing: 'easeOutQuad',
      duration: 420,
      transformOrigin: 'left center',
    })
      .add(
        {
          targets: '[data-row]',
          opacity: [0, 1],
          translateY: [14, 0],
          delay: anime.stagger(70),
          duration: 320,
          easing: 'easeOutQuad',
        },
        '-=120'
      )
      .add(
        {
          targets: '.skill-logo',
          opacity: [0, 1],
          scale: [0.92, 1],
          delay: anime.stagger(55),
          duration: 280,
          easing: 'easeOutQuad',
        },
        '-=100'
      );

    // Soft glow shimmer (skip when user prefers reduced motion)
    let shimmer;
    if (!reduced) {
      shimmer = anime({
        targets: '.skill-card',
        duration: 2000,
        easing: 'easeInOutSine',
        direction: 'alternate',
        loop: true,
        delay: anime.stagger(150),
        boxShadow: [
          '0 0 0 rgba(0,0,0,0)',
          '0 10px 28px rgba(99,102,241,0.18)',
        ],
        translateY: [{ value: -1 }, { value: 0 }],
      });
    }

    const onHide = () => (document.hidden ? shimmer?.pause() : shimmer?.play());
    document.addEventListener('visibilitychange', onHide);

    return () => {
      tl.pause();
      shimmer?.pause();
      document.removeEventListener('visibilitychange', onHide);
    };
  }, []);

  return (
    <main className="relative max-w-5xl mx-auto px-4 sm:px-6 pt-16 pb-20">
      {/* Glass card 1 */}
      <section className="glass p-6 sm:p-8" data-row>
        <header className="mb-6">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            About
          </h1>
          <span
            data-underline
            className="underline-accent"
            aria-hidden
          />
        </header>

        <p className="opacity-90 leading-relaxed">
          <strong>I am a junior full-stack developer</strong> specializing in
          <span className="text-indigo-300"> Laravel</span> +{' '}
          <span className="text-sky-300">React</span>, who loves bold, animated
          design. I focus on intuitive UI, clean code, and fast-loading
          experiences that feel alive.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            to="/projects"
            className="btn-primary"
          >
            View Projects
          </Link>
          <Link
            to="/contact"
            className="btn-ghost"
          >
            Contact
          </Link>
        </div>
      </section>

      {/* Glass card 2 — skills */}
      <section className="glass p-6 sm:p-8 mt-6" data-row>
        <h2 className="text-xl font-semibold mb-4">Core Stack</h2>
        <div
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-5"
          aria-label="Technologies"
        >
          <SkillCard src="/content/laravel-2.svg" alt="Laravel" />
          <SkillCard src="/content/react-svgrepo-com.svg" alt="React" />
          <SkillCard src="/content/git-icon-logo-svgrepo-com.svg" alt="Git" />
          <SkillCard src="/content/mysql-logo-svgrepo-com.svg" alt="MySQL" />
          <SkillCard src="/content/tailwind-css-svgrepo-com.svg" alt="Tailwind CSS" />
        </div>
      </section>

      {/* Glass card 3 — highlights */}
      <section className="glass p-6 sm:p-8 mt-6" data-row>
        <h2 className="text-xl font-semibold mb-4">Highlights</h2>
        <ol className="relative ml-2 pl-6 space-y-5">
          <li className="relative">
            <span className="dot dot-indigo" />
            <p className="font-medium">Animated portfolio with anime.js</p>
            <p className="text-sm opacity-80">
              A polished portfolio showing off my skills.
            </p>
          </li>
          <li className="relative">
            <span className="dot dot-emerald" />
            <p className="font-medium">Laravel + React apps</p>
            <p className="text-sm opacity-80">
              Complete dynamic websites featuring CRUD systems.
            </p>
          </li>
          <li className="relative">
            <span className="dot dot-sky" />
            <p className="font-medium">Design-driven thinking</p>
            <p className="text-sm opacity-80">
              Currently have found a calling for UI/UX because thats the only thing ai seems to struggle with.
            </p>
          </li>
        </ol>
      </section>
    </main>
  );
}
