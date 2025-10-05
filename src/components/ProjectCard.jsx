import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import anime from 'animejs';

export default function ProjectCard({ project, index = 0 }) {
  const cardRef = useRef(null);
  const imgRef = useRef(null);
  const sheenRef = useRef(null);

  // Reveal on enter (softer + shadow pop)
  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            anime({
              targets: el,
              opacity: [0, 1],
              translateY: [22, 0],
              scale: [0.985, 1],
              filter: ['brightness(0.95)', 'brightness(1)'],
              duration: 520,
              easing: 'easeOutCubic',
              delay: index * 70,
            });
            anime({
              targets: el.querySelectorAll('[data-btn]'),
              opacity: [0, 1],
              translateY: [12, 0],
              duration: 300,
              easing: 'easeOutCubic',
              delay: anime.stagger(60, { start: 160 }),
            });
            io.disconnect();
          }
        });
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.15 }
    );

    el.style.opacity = '0';
    el.style.transform = 'translateY(22px) scale(0.985)';
    io.observe(el);

    return () => io.disconnect();
  }, [index]);

  // Hover interactions: tilt, parallax, sheen, lift/glow
  useEffect(() => {
    const el = cardRef.current;
    const img = imgRef.current;
    const sheen = sheenRef.current;
    if (!el || !img || !sheen) return;

    let pointerInside = false;

    function onMove(e) {
      if (!pointerInside) return;
      const r = el.getBoundingClientRect();
      const nx = (e.clientX - r.left) / r.width - 0.5; // -0.5..0.5
      const ny = (e.clientY - r.top) / r.height - 0.5;

      // Smooth tilt (less twitchy)
      anime({
        targets: el,
        rotateY: nx * 9,
        rotateX: -ny * 7,
        translateZ: 10,
        duration: 260,
        easing: 'easeOutCubic',
      });

      // Image parallax + gentle zoom
      anime({
        targets: img,
        translateX: nx * 10,
        translateY: ny * 8,
        scale: 1.045,
        duration: 260,
        easing: 'easeOutCubic',
      });

      // Follow-up sheen drift (subtle, after first sweep)
      const offset = (e.clientX - r.left) / r.width;
      sheen.style.transform = `translateX(${(offset - 0) * 160}%) rotate(0deg)`;
    }

    function onEnter(e) {
      pointerInside = true;

      // lift + glow pop
      anime({
        targets: el,
        translateY: -3,
        scale: 1.006,
        boxShadow: [
          '0 10px 30px -10px rgba(0,0,0,.35)',
          '0 18px 38px -12px rgba(0,0,0,.55)',
        ],
        duration: 240,
        easing: 'easeOutCubic',
      });

      // image initial zoom
      anime({
        targets: img,
        scale: 1.04,
        duration: 220,
        easing: 'easeOutCubic',
      });

      // one-time sheen sweep across (eye-catching but quick)
      const r = el.getBoundingClientRect();
      const startX = -120;
      const endX = 300;
      sheen.style.opacity = '0';
      sheen.style.transform = `translateX(${startX}%) rotate(20deg)`;
      anime({
        targets: sheen,
        opacity: [0, 0.35, 0],
        duration: 420,
        easing: 'easeOutCubic',
        update: (ins) => {
          const p = ins.progress / 100; // 0..1
          const x = startX + (endX - startX) * p;
          sheen.style.transform = `translateX(${x}%) rotate(0deg)`;
        },
      });

      onMove(e);
    }

    function onLeave() {
      pointerInside = false;

      // elastic settle back (softer than a snap)
      anime({
        targets: el,
        rotateX: 0,
        rotateY: 0,
        translateZ: 0,
        translateY: 0,
        scale: 1,
        boxShadow: '0 10px 30px -10px rgba(0,0,0,.5)',
        duration: 520,
        easing: 'easeOutElastic(1, .7)',
      });

      anime({
        targets: img,
        translateX: 0,
        translateY: 0,
        scale: 1.2,
        duration: 420,
        easing: 'easeOutElastic(1, .7)',
      });

      anime({ targets: sheen, opacity: 0, duration: 200, easing: 'easeOutCubic' });
    }

    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerleave', onLeave);
    el.addEventListener('pointerenter', onEnter);
    return () => {
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerleave', onLeave);
      el.removeEventListener('pointerenter', onEnter);
    };
  }, []);

  return (
    <article
      ref={cardRef}
      className="group relative rounded-2xl bg-white/5 dark:bg-white/10 backdrop-blur border border-white/10 overflow-hidden shadow-[0_10px_30px_-10px_rgba(0,0,0,.5)] transition-[box-shadow,transform,filter]"
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <img
          ref={imgRef}
          src={project.cover}
          alt={`${project.title} cover`}
          className="h-full w-full object-cover will-change-transform"
          loading="lazy"
        />
        {/* sheen */}
        <span
          ref={sheenRef}
          className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/2 opacity-0 bg-gradient-to-r from-white/10 via-white/50 to-white/10"
          style={{ transform: 'translateX(-120%) rotate(20deg)' }}
          aria-hidden
        />
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-4">
          <h3 className="text-lg font-semibold tracking-wide">{project.title}</h3>
          <span
            className="shrink-0 rounded-full px-2 py-0.5 text-xs"
            style={{ background: `${project.accent}22`, color: project.accent }}
            title="Year"
          >
            {project.year}
          </span>
        </div>
        {project.summary && (
          <p className="mt-1 text-sm text-white/70 line-clamp-2">{project.summary}</p>
        )}
        {!!project.tags?.length && (
          <div className="mt-2 flex flex-wrap gap-2">
            {project.tags.slice(0, 4).map((t) => (
              <span
                key={t}
                className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-white/80"
              >
                {t}
              </span>
            ))}
          </div>
        )}

        <div className="mt-3 flex items-center gap-2">
          <Link to={`/projects/${project.slug}`} className="card-btn cta" data-btn>
            Details
          </Link>

          {project.links?.code && (
            <a
              href={project.links.code}
              target="_blank"
              rel="noreferrer"
              className="card-btn card-btn--ghost cta"
              data-btn
            >
              Code
            </a>
          )}
        </div>
      </div>

      {/* accent ring on hover (already styled by tokens) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-2xl ring-0 group-hover:ring-2 transition"
        style={{ boxShadow: `inset 0 0 0 2px ${project.accent}55` }}
      />
    </article>
  );
}
