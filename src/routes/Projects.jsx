import projects from '../data/projects.json';
import ProjectCard from '../components/ProjectCard.jsx';
import anime from 'animejs';
import { useEffect } from 'react';

export default function Projects() {
  useEffect(() => {
    document.title = 'Projects — Edmunds Eglītis';
    const t = anime.timeline({ autoplay: true });
    t.add({
      targets: '[data-project-card]',
      translateY: [18, 0],
      opacity: [0, 1],
      delay: anime.stagger(70),
      duration: 420,
      easing: 'easeOutCubic',
    });
    return () => t.pause();
  }, []);

  return (
    <main className="relative min-h-screen">
      <section className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <header className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold">Projects</h1>
          <p className="opacity-80">
            A simple, fast grid — hover for a tiny 3D tilt, click for details.
          </p>
        </header>

        <div className="grid gap-6 sm:gap-7 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p, i) => (
            <div key={p.slug} data-project-card>
              <ProjectCard project={p} index={i} />
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
