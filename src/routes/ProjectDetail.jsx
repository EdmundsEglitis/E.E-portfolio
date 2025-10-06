import { Link, useParams } from 'react-router-dom';
import data from '../data/projects.json';
import { useEffect, useRef, useState, useCallback } from 'react';
import anime from 'animejs';

export default function ProjectDetail() {
  const { slug } = useParams();
  const project = data.find((p) => p.slug === slug) || data[0];

  const coverRef = useRef(null);

  useEffect(() => {
    document.title = `${project.title} — Project`;

    const enter = anime.timeline({ autoplay: true });
    enter
      .add({
        targets: coverRef.current,
        opacity: [0, 1],
        scale: [0.98, 1],
        duration: 420,
        easing: 'easeOutCubic',
      })
      .add(
        {
          targets: '[data-detail-row]',
          translateY: [16, 0],
          opacity: [0, 1],
          delay: anime.stagger(60),
          duration: 380,
          easing: 'easeOutCubic',
        },
        '-=180'
      );

    anime({
      targets: '[data-kpi]',
      innerHTML: (el) => [0, parseInt(el.getAttribute('data-kpi') || '0', 10)],
      round: 1,
      duration: 1200,
      easing: 'easeOutCubic',
      delay: anime.stagger(120),
    });

    return () => enter.pause();
  }, [project]);

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <BackLink />

      {/* Cover (video if provided, else image) */}
      <div
        ref={coverRef}
        className="rounded-xl overflow-hidden border border-white/10 card-glass"
      >
        {project.video ? (
          <VideoBlock video={project.video} accent={project.accent} />
        ) : (
          <img
            src={project.cover}
            alt={`${project.title} cover`}
            className="w-full h-auto"
          />
        )}
      </div>

      {/* Title + summary */}
      <h1 className="text-3xl font-extrabold mt-6" data-detail-row>
        {project.title}
      </h1>
      <p className="opacity-80 mt-2" data-detail-row>
        {project.summary}
      </p>

      {/* Tags (optional) */}
      {!!project.tags?.length && (
        <div className="flex flex-wrap gap-2 mt-3" data-detail-row>
          {project.tags.map((t) => (
            <span key={t} className="card-chip">{t}</span>
          ))}
        </div>
      )}

      {/* KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6" data-detail-row>
        <KPI label="Commits" value={project.kpis?.commits ?? 120} />
      </div>

      {/* Overview (rich paragraphs) */}
      {!!project.overview && (
        <section className="mt-8 space-y-4" data-detail-row>
          <h2 className="text-xl font-semibold">Overview</h2>
          {splitParas(project.overview).map((p, i) => (
            <p key={i} className="opacity-90 leading-relaxed">{p}</p>
          ))}
        </section>
      )}

      {/* Features */}
      {!!project.features?.length && (
        <section className="mt-8" data-detail-row>
          <h2 className="text-xl font-semibold mb-3">Highlights</h2>
          <ul className="space-y-2">
            {project.features.map((f, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="dot dot-emerald" />
                <span className="opacity-90">{f}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Tech stack */}
      {!!project.tech?.length && (
        <section className="mt-8" data-detail-row>
          <h2 className="text-xl font-semibold mb-3">Tech</h2>
          <div className="flex flex-wrap gap-2">
            {project.tech.map((t) => (
              <span key={t} className="card-chip">{t}</span>
            ))}
          </div>
        </section>
      )}

      {/* Gallery (lightbox) */}
      {!!project.gallery?.length && (
        <Gallery images={project.gallery} accent={project.accent} />
      )}

      {/* Links */}
      {!!project.links && (
        <section className="mt-10 flex gap-3" data-detail-row>
          {project.links.code && (
            <a
              href={project.links.code}
              target="_blank"
              rel="noreferrer"
              className="card-btn card-btn--ghost"
              aria-label="Open source code"
            >
              Code
            </a>
          )}
        </section>
      )}
    </main>
  );
}

/* ---------- pieces ---------- */

function BackLink() {
  const spanRef = useRef(null);
  const grow = () =>
    anime({
      targets: spanRef.current,
      width: ['0%', '60%'],
      translateX: ['-50%', '-50%'],
      duration: 260,
      easing: 'easeOutCubic',
    });

  return (
    <Link
      to="/projects"
      className="inline-block mb-4 relative"
      onMouseEnter={grow}
      onFocus={grow}
    >
      ← Back to projects
      <span ref={spanRef} className="absolute left-1/2 -bottom-1 w-0 h-0.5 bg-white/70" aria-hidden />
    </Link>
  );
}

function KPI({ label, value }) {
  return (
    <div className="card-glass p-4 text-center">
      <div className="text-2xl font-bold" data-kpi={value} data-kpi-el>
        0
      </div>
      <div className="text-sm opacity-70">{label}</div>
    </div>
  );
}

function splitParas(text = '') {
  return text
    .split(/\n{2,}/g)
    .map((s) => s.trim())
    .filter(Boolean);
}


function VideoBlock({ video, accent = '#818cf8' }) {
  const wrapRef = useRef(null);

  const isFile = video.type === 'file';
  const isYouTube = video.type === 'youtube';
  const isVimeo = video.type === 'vimeo';


  const loop = video.loop ?? true;
  const muted = video.muted ?? true;
  const controls = video.controls ?? false;

  useEffect(() => {
    const tl = anime.timeline({ autoplay: true });
    tl.add({
      targets: wrapRef.current,
      opacity: [0, 1],
      scale: [0.98, 1],
      duration: 420,
      easing: 'easeOutCubic',
    });
    return () => tl.pause();
  }, []);

  const youtubeId = isYouTube ? getYouTubeId(video.src) : null;
  const vimeoId = isVimeo ? getVimeoId(video.src) : null;

  const youtubeUrl = youtubeId
    ? `https://www.youtube.com/embed/${youtubeId}?autoplay=1&mute=1&controls=0&playsinline=1&rel=0&loop=1&playlist=${youtubeId}`
    : null;

  const vimeoUrl = vimeoId
    ? `https://player.vimeo.com/video/${vimeoId}?autoplay=1&muted=1&loop=1&title=0&byline=0&portrait=0&background=1`
    : null;

  return (
    <figure ref={wrapRef} className="relative">

      <div className="relative w-full" style={{ paddingTop: '56.25%' }}>
        <div className="absolute inset-0">

          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-xl"
            style={{ boxShadow: `inset 0 0 0 2px ${accent}55`, borderRadius: 12 }}
          />


          {isFile && (
            <video
              className="w-full h-full object-cover rounded-xl"
              src={video.src}
              poster={video.poster}
              autoPlay
              muted={muted}
              loop={loop}
              playsInline
              controls={controls}
            />
          )}

          {isYouTube && youtubeUrl && (
            <iframe
              className="w-full h-full rounded-xl"
              src={youtubeUrl}
              title="Project video"
              allow="autoplay; accelerometer; encrypted-media; picture-in-picture"
              allowFullScreen
              frameBorder="0"
            />
          )}


          {isVimeo && vimeoUrl && (
            <iframe
              className="w-full h-full rounded-xl"
              src={vimeoUrl}
              title="Project video"
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
              frameBorder="0"
            />
          )}
        </div>
      </div>

      {video.caption && (
        <figcaption className="text-sm opacity-70 mt-2">
          {video.caption}
        </figcaption>
      )}
    </figure>
  );
}



function Gallery({ images, accent = '#818cf8' }) {
  const [open, setOpen] = useState(false);
  const [idx, setIdx] = useState(0);
  const overlayRef = useRef(null);
  const imgRef = useRef(null);

  const show = useCallback((i) => {
    setIdx(i);
    setOpen(true);
    requestAnimationFrame(() => {
      anime({
        targets: overlayRef.current,
        opacity: [0, 1],
        duration: 220,
        easing: 'easeOutCubic',
      });
      anime({
        targets: imgRef.current,
        scale: [0.94, 1],
        opacity: [0, 1],
        duration: 320,
        easing: 'easeOutCubic',
      });
    });
  }, []);

  const hide = useCallback(() => {
    anime({
      targets: imgRef.current,
      scale: [1, 0.98],
      opacity: [1, 0],
      duration: 200,
      easing: 'easeInCubic',
    });
    anime({
      targets: overlayRef.current,
      opacity: [1, 0],
      duration: 200,
      easing: 'linear',
      complete: () => setOpen(false),
    });
  }, []);

  const prev = useCallback(() => setIdx((i) => (i - 1 + images.length) % images.length), [images.length]);
  const next = useCallback(() => setIdx((i) => (i + 1) % images.length), [images.length]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === 'Escape') hide();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, hide, prev, next]);

  return (
    <>
      <section className="mt-10" data-detail-row>
        <h2 className="text-xl font-semibold mb-4">Gallery</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {images.map((img, i) => (
            <button
              key={img.src + i}
              type="button"
              onClick={() => show(i)}
              className="group relative rounded-lg overflow-hidden border border-white/10 card-glass focus-ring"
              aria-label={`Open image ${i + 1}`}
            >
              <img
                src={img.src}
                alt={img.alt || `Screenshot ${i + 1}`}
                className="w-full h-auto transition-transform duration-300 group-hover:scale-[1.03]"
                loading="lazy"
              />
              {img.caption && (
                <div className="absolute bottom-0 left-0 right-0 p-2 text-sm bg-black/30 backdrop-blur opacity-0 group-hover:opacity-100 transition">
                  {img.caption}
                </div>
              )}
            </button>
          ))}
        </div>
      </section>

      {open && (
        <div
          ref={overlayRef}
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center opacity-0"
          onClick={hide}
          role="dialog"
          aria-modal="true"
        >
          <figure
            className="relative max-w-5xl w-[92vw] md:w-[80vw] rounded-xl overflow-hidden border border-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              ref={imgRef}
              src={images[idx].src}
              alt={images[idx].alt || `Screenshot ${idx + 1}`}
              className="w-full h-auto opacity-0"
            />
            {images[idx].caption && (
              <figcaption className="absolute bottom-0 left-0 right-0 p-3 text-sm bg-black/35">
                {images[idx].caption}
              </figcaption>
            )}

            <div className="absolute inset-x-0 -top-12 flex items-center justify-between px-2">
              <button
                type="button"
                onClick={prev}
                className="card-btn"
                aria-label="Previous image"
              >
                ← Prev
              </button>
              <button
                type="button"
                onClick={hide}
                className="card-btn card-btn--ghost"
                aria-label="Close gallery"
              >
                Close
              </button>
              <button
                type="button"
                onClick={next}
                className="card-btn"
                aria-label="Next image"
              >
                Next →
              </button>
            </div>


            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 rounded-xl"
              style={{ boxShadow: `inset 0 0 0 2px ${accent}55` }}
            />
          </figure>
        </div>
      )}
    </>
  );
}



function getYouTubeId(idOrUrl = '') {

  if (!idOrUrl) return '';

  if (/^[\w-]{11}$/.test(idOrUrl)) return idOrUrl;

  try {
    const u = new URL(idOrUrl);
    if (u.hostname.includes('youtu.be')) {
      return u.pathname.slice(1);
    }
    if (u.searchParams.get('v')) {
      return u.searchParams.get('v');
    }

    const parts = u.pathname.split('/');
    const i = parts.indexOf('embed');
    if (i >= 0 && parts[i + 1]) return parts[i + 1];
  } catch {}
  return '';
}

function getVimeoId(idOrUrl = '') {
  if (!idOrUrl) return '';

  if (/^\d+$/.test(idOrUrl)) return idOrUrl;
  try {
    const u = new URL(idOrUrl);
    const parts = u.pathname.split('/').filter(Boolean);
    return parts[parts.length - 1] || '';
  } catch {}
  return '';
}
