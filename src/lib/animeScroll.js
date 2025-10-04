// src/lib/animeScroll.js
import anime from 'animejs';

export function makeScrollScrubber({
  sectionEl,
  buildTimeline, // () => anime.timeline({ autoplay:false }) with .add(...) steps
  startOffset = 0, // px from top of section to start scrubbing
  endOffset = 0,   // px from bottom of section to end scrubbing
}) {
  if (!sectionEl) return { destroy() {} };

  const tl = buildTimeline();
  let rafId = 0;
  let lastW = window.innerWidth;

  const update = () => {
    const rect = sectionEl.getBoundingClientRect();
    const viewH = window.innerHeight;
    const total = rect.height - startOffset - endOffset + viewH; // extra len while pinned-ish
    const passed = viewH - (rect.top + startOffset);
    const p = Math.min(1, Math.max(0, passed / total));
    tl.seek(p * tl.duration);
    rafId = requestAnimationFrame(update);
  };

  const onResize = () => {
    if (lastW !== window.innerWidth) {
      lastW = window.innerWidth;
      // Recalculate once to avoid stale geometry
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(update);
    }
  };

  rafId = requestAnimationFrame(update);
  window.addEventListener('resize', onResize);

  return {
    destroy() {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', onResize);
      tl.pause();
    },
    tl,
  };
}

export function staggerChildren(query, opts = {}) {
  return anime.stagger(opts.step ?? 60, { start: 0, ...opts });
}
