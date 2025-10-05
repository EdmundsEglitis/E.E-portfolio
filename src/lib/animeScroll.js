// Smooth document scroll progress 0..1 with a low-pass filter
export function initScrollProgress(onProgress) {
  let raf, last = 0, smooth = 0;

  const tick = (t) => {
    const dt = (t - last) / 1000 || 0.016;
    last = t;

    const doc = document.documentElement;
    const max = Math.max(1, (doc.scrollHeight || document.body.scrollHeight) - window.innerHeight);
    const raw = window.scrollY / max;

    // Low-pass filter factor depends on dt to be frame-rate independent
    const k = 1 - Math.pow(0.001, dt);
    smooth += (raw - smooth) * k;

    if (onProgress) onProgress(Math.min(1, Math.max(0, smooth)));

    raf = requestAnimationFrame(tick);
  };

  raf = requestAnimationFrame(tick);
  return () => cancelAnimationFrame(raf);
}
