import { NavLink, Link } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import anime from 'animejs';
import { useUI } from '../store/uiStore';

export default function Header() {
  const barRef = useRef(null);
  const underlineRef = useRef(null);
  const docProgress = useUI((s) => s.docProgress);
  const [open, setOpen] = useState(false);


  useEffect(() => {
    const el = barRef.current;
    if (!el) return;
    anime({
      targets: el,
      width: `${Math.round(docProgress * 100)}%`,
      duration: 120,
      easing: 'linear',
    });
  }, [docProgress]);


  useEffect(() => {
    const ul = underlineRef.current;
    if (!ul) return;

    const container = document.querySelector('#primary-nav');
    if (!container) return;

    const links = Array.from(container.querySelectorAll('a'));

    function moveTo(el) {
      const r = el.getBoundingClientRect();
      const parent = container.getBoundingClientRect();
      const x = r.left - parent.left;
      anime({
        targets: ul,
        translateX: x,
        width: r.width,
        opacity: 1,
        duration: 200,
        easing: 'easeOutCubic',
      });
    }

    function hide() {
      anime({ targets: ul, opacity: 0, duration: 180, easing: 'easeOutCubic' });
    }

    links.forEach((a) => {
      a.addEventListener('mouseenter', () => moveTo(a));
      a.addEventListener('focus', () => moveTo(a));
      a.addEventListener('mouseleave', hide);
      a.addEventListener('blur', hide);
    });

    return () => {
      links.forEach((a) => {
        a.removeEventListener('mouseenter', () => moveTo(a));
        a.removeEventListener('focus', () => moveTo(a));
        a.removeEventListener('mouseleave', hide);
        a.removeEventListener('blur', hide);
      });
    };
  }, []);

  return (
    <header className="sticky top-0 z-40 backdrop-blur bg-black/30 border-b border-white/10">

      <div className="h-0.5 bg-indigo-500" ref={barRef} style={{ width: '0%' }} aria-hidden />

      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-4">
        <Link to="/" className="font-bold">Edmunds</Link>

        <nav id="primary-nav" className="ml-auto hidden sm:flex relative items-center gap-2">
          <NavLinkPill to="/" label="Home" />
          <NavLinkPill to="/projects" label="Projects" />
          <NavLinkPill to="/about" label="About" />
          <NavLinkPill to="/contact" label="Contact" />

          <span
            ref={underlineRef}
            className="pointer-events-none absolute -bottom-1 left-0 h-[2px] rounded bg-white/60 opacity-0"
            style={{ width: 0, transform: 'translateX(0px)' }}
          />
        </nav>

        <button
          className="sm:hidden ml-auto card-btn focus-ring"
          aria-expanded={open ? 'true' : 'false'}
          onClick={() => setOpen((s) => !s)}
        >
          Menu
        </button>
      </div>

      <div
        className={`sm:hidden overflow-hidden transition-[max-height] duration-300 ${open ? 'max-h-64' : 'max-h-0'}`}
        aria-hidden={open ? 'false' : 'true'}
      >
        <div className="px-4 pb-3 flex flex-col gap-2">
          <NavLinkMobile to="/" label="Home" onClick={() => setOpen(false)} />
          <NavLinkMobile to="/projects" label="Projects" onClick={() => setOpen(false)} />
          <NavLinkMobile to="/about" label="About" onClick={() => setOpen(false)} />
          <NavLinkMobile to="/contact" label="Contact" onClick={() => setOpen(false)} />
        </div>
      </div>
    </header>
  );
}

function NavLinkPill({ to, label }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `px-3 py-1.5 rounded-lg hover:bg-white/10 transition-transform ${isActive ? 'bg-white/10' : ''}`
      }
      aria-current={({ isActive }) => (isActive ? 'page' : undefined)}
      onMouseEnter={(e) => pop(e.currentTarget)}
      onFocus={(e) => pop(e.currentTarget)}
    >
      {label}
    </NavLink>
  );
}

function NavLinkMobile({ to, label, onClick }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `px-3 py-2 rounded-lg hover:bg-white/10 ${isActive ? 'bg-white/10' : ''}`
      }
      onClick={onClick}
    >
      {label}
    </NavLink>
  );
}

function pop(el) {
  anime({
    targets: el,
    scale: [{ value: 1.05, duration: 120, easing: 'easeOutQuad' }, { value: 1, duration: 140, easing: 'easeOutQuad' }],
  });
}
