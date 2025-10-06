import { useEffect, useRef } from 'react';
import anime from 'animejs';
import projects from '../data/projects.json';
import ProjectCard from '../components/ProjectCard.jsx';

export default function Projects() {
  const gridRef = useRef(null);

  useEffect(() => {
    document.title = 'Projects — Edmunds Eglītis';

    const tl = anime.timeline({ autoplay: true });
    tl.add({
      targets: gridRef.current,
      opacity: [0, 1],
      translateY: [16, 0],
      duration: 380,
      easing: 'easeOutCubic',
    }).add(
      {
        targets: gridRef.current?.querySelectorAll('[data-proj-card]'),
        translateY: [18, 0],
        opacity: [0, 1],
        delay: anime.stagger(70),
        duration: 420,
        easing: 'easeOutCubic',
      },
      '-=160'
    );

    return () => tl.pause();
  }, []);

  const items = projects.slice(0, 4);

  return (
    <main className="relative min-h-screen">
      <section className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-10">
        <header className="mb-6">
          <h1 className="text-3xl sm:text-4xl font-extrabold">Projects</h1>
          <p className="opacity-80">some of my projects</p>
        </header>

        <div
          ref={gridRef}
          className="opacity-0 grid gap-6 sm:gap-7 grid-cols-1 md:grid-cols-2"
        >
          {items.map((p, i) => (
            <div key={p.slug} data-proj-card className="h-full will-change-transform">
              <ProjectCard project={p} index={i} />
            </div>
          ))}
        </div>

        <div className="h-10" />
      </section>
    </main>
  );
}
