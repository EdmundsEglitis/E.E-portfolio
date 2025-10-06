import { Link } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import anime from 'animejs';
import { useUI } from '../store/uiStore';

export default function Home() {
  const reducedFX = useUI((s) => s.reducedFX);

  useEffect(() => {
    document.title = 'Home — Edmunds Eglītis';


    if (!anime.createDrawable) {
      anime.createDrawable = function (selectorOrEls) {
        const targets =
          typeof selectorOrEls === 'string'
            ? document.querySelectorAll(selectorOrEls)
            : selectorOrEls;
        return { animate: (opts = {}) => anime({ targets, ...opts }), targets };
      };
    }


    const tl = anime.timeline({ easing: 'easeOutCubic', duration: 420, autoplay: true });
    tl.add({
      targets: '.h-split > span',
      translateY: [24, 0],
      opacity: [0, 1],
      delay: anime.stagger(45),
    })
      .add({ targets: '.cta', opacity: [0, 1], translateY: [12, 0] }, '-=120')
      .add(
        { targets: '.chip', opacity: [0, 1], translateY: [10, 0], delay: anime.stagger(50) },
        '-=200'
      );


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

  const words = ['Building', 'stunning,', 'responsive', 'web', 'experiences.'];

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
          My name is Edmunds I am a junior full-stack developer currently focused on Laravel/React,
          Explore my selected work and get in touch.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link to="/projects" className="card-btn cta">
            View Projects
          </Link>
          <Link to="/contact" className="card-btn card-btn--ghost cta">
            Contact
          </Link>
        </div>


        <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Chip label="Contacts" value=" Get in touch" to="/contact" />
          <Chip label="Projects" value=" Some projects" to="/projects" />
          <Chip label="About" value=" Who am I?" to="/about" />
        </div>
      </div>

      <div className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(ellipse_at_center,transparent_0%,transparent_55%,rgba(0,0,0,0.25)_80%,rgba(0,0,0,0.55)_100%)]" />
    </section>
  );
}

function Chip({ label, value, to }) {
  const reducedFX = useUI((s) => s.reducedFX);
  const rootRef = useRef(null);
  const sheenRef = useRef(null);
  const ringRef = useRef(null);
  const auraRef = useRef(null);
  const borderRef = useRef(null);


  const burst = (x, y) => {
    const el = rootRef.current;
    if (!el) return;
    const count = 10;
    const dots = Array.from({ length: count }).map(() => {
      const s = document.createElement('span');
      s.style.position = 'absolute';
      s.style.top = `${y}px`;
      s.style.left = `${x}px`;
      s.style.width = '6px';
      s.style.height = '6px';
      s.style.borderRadius = '9999px';
      s.style.pointerEvents = 'none';
      s.style.background = 'rgba(255,255,255,.75)';
      el.appendChild(s);
      return s;
    });

    anime({
      targets: dots,
      translateX: () => anime.random(-36, 36),
      translateY: () => anime.random(-24, 24),
      scale: [{ value: 1.2, duration: 80 }, { value: 0, duration: 320 }],
      opacity: [{ value: 1, duration: 60 }, { value: 0, duration: 340 }],
      easing: 'easeOutCubic',
      duration: 400,
      complete: () => dots.forEach((n) => n.remove()),
    });
  };

  useEffect(() => {
    const el = rootRef.current;
    const sheen = sheenRef.current;
    const ring = ringRef.current;
    const aura = auraRef.current;
    const border = borderRef.current;
    if (!el) return;
    if (reducedFX) return;


    const float = anime({
      targets: el,
      translateY: [-1.5, 1.5],
      duration: 3400,
      direction: 'alternate',
      easing: 'easeInOutSine',
      loop: true,
      autoplay: true,
    });


    border.style.background =
      'conic-gradient(from 0deg, rgba(129,140,248,.0), rgba(129,140,248,.65), rgba(168,85,247,.35), rgba(129,140,248,.0))';
    const spin = anime({
      targets: border,
      rotate: '1turn',
      duration: 6000,
      easing: 'linear',
      loop: true,
      autoplay: true,
    });

    const onVis = () => (document.hidden ? (float.pause(), spin.pause()) : (float.play(), spin.play()));
    document.addEventListener('visibilitychange', onVis);


    const onMove = (e) => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;

      anime({
        targets: el,
        rotateY: px * 10,
        rotateX: -py * 8,
        duration: 140,
        easing: 'easeOutQuad',
      });

      const offset = (e.clientX - r.left) / r.width;
      sheen.style.transform = `translateX(${(offset - 0.5) * 220}%) rotate(18deg)`;
    };

    const onEnter = () => {

      anime({
        targets: el,
        scale: [1, 1.035],
        duration: 180,
        easing: 'easeOutCubic',
      });
      anime({
        targets: aura,
        opacity: [{ value: 0.0, duration: 0 }, { value: 0.45, duration: 180 }],
        boxShadow: [
          '0 0 0 0 rgba(129,140,248,0.0)',
          '0 0 24px 6px rgba(129,140,248,.22)',
        ],
        easing: 'easeOutCubic',
        duration: 240,
      });
      anime({
        targets: ring,
        opacity: [{ value: 0, duration: 0 }, { value: 1, duration: 160 }],
        easing: 'easeOutCubic',
      });
      anime({
        targets: sheen,
        opacity: [0, 0.35],
        duration: 220,
        easing: 'easeOutCubic',
      });
    };

    const onLeave = () => {
      anime({
        targets: [el],
        rotateX: 0,
        rotateY: 0,
        translateX: 0,
        translateY: 0,
        scale: 1,
        duration: 240,
        easing: 'easeOutCubic',
      });
      anime({ targets: [aura, ring, sheen], opacity: 0, duration: 200, easing: 'easeOutCubic' });
    };

    const onDown = (e) => {
      const r = el.getBoundingClientRect();
      burst(e.clientX - r.left, e.clientY - r.top);
      anime({ targets: el, scale: 0.985, duration: 90, easing: 'easeOutCubic' });
    };
    const onUp = () => anime({ targets: el, scale: 1.035, duration: 120, easing: 'easeOutCubic' });

    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerenter', onEnter);
    el.addEventListener('pointerleave', onLeave);
    el.addEventListener('pointerdown', onDown);
    el.addEventListener('pointerup', onUp);

    return () => {
      float.pause();
      spin.pause();
      document.removeEventListener('visibilitychange', onVis);
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerenter', onEnter);
      el.removeEventListener('pointerleave', onLeave);
      el.removeEventListener('pointerdown', onDown);
      el.removeEventListener('pointerup', onUp);
    };
  }, [reducedFX]);

  const Inner = (
    <>

      <span
        ref={borderRef}
        className="pointer-events-none absolute inset-0 rounded-[16px] opacity-40"
        style={{
          WebkitMask:
            'linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
          padding: '1px',
        }}
        aria-hidden
      />

      <span
        ref={auraRef}
        className="pointer-events-none absolute inset-0 rounded-[16px] opacity-0"
        aria-hidden
      />

      <span
        ref={sheenRef}
        className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/2 opacity-0 bg-gradient-to-r from-white/5 via-white/35 to-white/5 rounded-full"
        style={{ transform: 'translateX(-120%) rotate(18deg)' }}
        aria-hidden
      />

      <span
        ref={ringRef}
        className="pointer-events-none absolute inset-0 rounded-[16px] opacity-0"
        style={{ boxShadow: 'inset 0 0 0 2px rgba(129,140,248,.45)' }}
        aria-hidden
      />

      <span className="relative z-10 text-xs uppercase tracking-wider text-white/60">{label}</span>
      <span className="relative z-10 text-base font-semibold text-white">{value}</span>
    </>
  );

  const cls =
    'relative card-glass p-3 chip hover:brightness-110 transition will-change-transform overflow-hidden select-none';

  return to ? (
    <Link ref={rootRef} to={to} className={cls}>
      {Inner}
    </Link>
  ) : (
    <div ref={rootRef} className={cls} role="button" tabIndex={0}>
      {Inner}
    </div>
  );
}
