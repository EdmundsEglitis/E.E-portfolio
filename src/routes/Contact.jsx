import { useEffect, useMemo, useRef, useState } from 'react';
import anime from 'animejs';
import { useUI } from '../store/uiStore';

// 🔧 Set your contact info here:
const EMAIL = 'edmunds3011@gmail.com';
const PHONE = '+37120223727'; // ← replace with your real number (E.164 or local format)

export default function Contact() {
  const reducedFX = useUI((s) => s.reducedFX);
  const flapRef = useRef(null);
  const envelopeRef = useRef(null);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);

  // Split into characters to stagger on enter
  const emailChars = useMemo(() => EMAIL.split(''), []);
  const phoneChars = useMemo(() => PHONE.split(''), []);

  // Polyfill createDrawable (JS-safe, idempotent)
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

  useEffect(() => {
    document.title = 'Contact — Edmunds Eglītis';

    // Entrance timeline
    const tl = anime.timeline({ autoplay: true });
    tl.add({
      targets: '.contact-card',
      opacity: [0, 1],
      translateY: [18, 0],
      duration: 420,
      easing: 'easeOutCubic',
    })
      .add(
        {
          targets: '.email-char',
          translateY: [12, 0],
          opacity: [0, 1],
          delay: anime.stagger(18),
          duration: 300,
          easing: 'easeOutCubic',
        },
        '-=160'
      )
      .add(
        {
          targets: '.phone-char',
          translateY: [12, 0],
          opacity: [0, 1],
          delay: anime.stagger(16),
          duration: 280,
          easing: 'easeOutCubic',
        },
        '-=120'
      );

    // Envelope flap loop
    let loop;
    if (!reducedFX && flapRef.current) {
      const flap = flapRef.current;
      flap.style.transformOrigin = '50% 20%';
      flap.style.transformStyle = 'preserve-3d';
      loop = anime({
        targets: flap,
        rotateX: [{ value: -25 }, { value: -12 }],
        duration: 2800,
        direction: 'alternate',
        easing: 'easeInOutSine',
        loop: true,
      });
    }

    // Pause loops when hidden
    const onVis = () => (document.hidden ? loop && loop.pause() : loop && loop.play());
    document.addEventListener('visibilitychange', onVis);

    return () => {
      tl.pause();
      if (loop) loop.pause();
      document.removeEventListener('visibilitychange', onVis);
    };
  }, [reducedFX]);

  async function copy(text, setFn, anchorSelector) {
    try {
      await navigator.clipboard.writeText(text);
      setFn(true);
      popConfetti(anchorSelector);
      setTimeout(() => setFn(false), 1200);
    } catch {
      // ignore clipboard errors
    }
  }

  function popConfetti(anchorSelector) {
    const anchor = document.querySelector(anchorSelector);
    if (!anchor) return;

    const n = 12;
    const host = document.createElement('div');
    host.className = 'pointer-events-none absolute inset-0';
    anchor.appendChild(host);

    const frags = [];
    for (let i = 0; i < n; i++) {
      const s = document.createElement('span');
      s.className = 'absolute left-1/2 top-1/2 block';
      s.style.width = '2px';
      s.style.height = '8px';
      s.style.background = 'rgba(99,102,241,.9)'; // indigo
      s.style.borderRadius = '1px';
      s.style.transformOrigin = 'center bottom';
      host.appendChild(s);
      frags.push(s);
    }

    anime({
      targets: frags,
      translateX: (_, i) => Math.cos((i / n) * Math.PI * 2) * (32 + Math.random() * 10),
      translateY: (_, i) => Math.sin((i / n) * Math.PI * 2) * (32 + Math.random() * 10),
      rotate: (_, i) => (i / n) * 360,
      scale: [{ value: 1.2, duration: 80 }, { value: 1, duration: 120 }],
      opacity: [{ value: 1 }, { value: 0, delay: 120 }],
      duration: 420,
      easing: 'easeOutCubic',
      complete: () => host.remove(),
    });
  }

  function openGmailCompose() {
    const url = `https://mail.google.com/mail/?view=cm&to=${encodeURIComponent(
      EMAIL
    )}&su=${encodeURIComponent('Hello Edmunds')}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  function openMailto() {
    window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent('Hello Edmunds')}`;
  }

  function callNow() {
    window.location.href = `tel:${PHONE.replace(/\s+/g, '')}`;
  }

  function smsNow() {
    window.location.href = `sms:${PHONE.replace(/\s+/g, '')}`;
  }

  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <section className="glass p-6 sm:p-8 contact-card relative overflow-hidden">
        <header className="mb-6">
          <h1 className="text-3xl font-extrabold tracking-tight">Let’s get in touch</h1>
          <p className="muted mt-1">Best way to reach me is by email or phone.</p>
        </header>

        {/* Envelope visual */}
        <div className="relative mb-6">
          <Envelope flapRef={flapRef} envelopeRef={envelopeRef} />
        </div>

        {/* Email display */}
        <div className="space-y-3">
          <div
            id="email-burst-anchor"
            className="relative inline-flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3"
            title="Click Copy to copy address"
          >
            <span className="text-xs uppercase tracking-wider text-white/60">Email</span>
            <code className="text-lg sm:text-xl font-semibold select-all">
              {emailChars.map((c, i) => (
                <span key={`e-${i}`} className="email-char inline-block opacity-0">
                  {c === ' ' ? '\u00A0' : c}
                </span>
              ))}
            </code>
            <button
              className="card-btn ml-2"
              onClick={() => copy(EMAIL, setCopiedEmail, '#email-burst-anchor')}
              aria-label="Copy email address"
            >
              {copiedEmail ? 'Copied!' : 'Copy'}
            </button>
          </div>

          <div className="flex flex-wrap gap-3">
            <button className="card-btn" onClick={openGmailCompose}>
              Compose in Gmail
            </button>

          </div>
        </div>

        {/* Divider */}
        <div className="my-6 h-px w-full bg-white/10" aria-hidden="true" />

        {/* Phone display */}
        <div className="space-y-3">
          <div
            id="phone-burst-anchor"
            className="relative inline-flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3"
            title="Click Copy to copy number"
          >
            <span className="text-xs uppercase tracking-wider text-white/60">Phone</span>
            <code className="text-lg sm:text-xl font-semibold select-all">
              {phoneChars.map((c, i) => (
                <span key={`p-${i}`} className="phone-char inline-block opacity-0">
                  {c === ' ' ? '\u00A0' : c}
                </span>
              ))}
            </code>
            <button
              className="card-btn ml-2"
              onClick={() => copy(PHONE, setCopiedPhone, '#phone-burst-anchor')}
              aria-label="Copy phone number"
            >
              {copiedPhone ? 'Copied!' : 'Copy'}
            </button>
          </div>

          <div className="flex flex-wrap gap-3">
            <button className="card-btn" onClick={callNow}>
              Call now
            </button>
            <button className="card-btn card-btn--ghost" onClick={smsNow}>
              Send SMS
            </button>
          </div>
        </div>

        <p className="text-xs opacity-60 mt-5">
          Tip: copy the address/number or use the quick actions to start your message instantly.
        </p>
      </section>
    </main>
  );
}

/* ---------- Envelope SVG with animated flap ---------- */
function Envelope({ flapRef, envelopeRef }) {
  useEffect(() => {
    if (flapRef.current) {
      flapRef.current.style.transformOrigin = '50% 20%';
      flapRef.current.style.transformStyle = 'preserve-3d';
    }
  }, [flapRef]);

  return (
    <svg
      ref={envelopeRef}
      className="w-48 h-32 block mx-auto drop-shadow"
      viewBox="0 0 240 160"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      {/* body */}
      <rect x="20" y="40" width="200" height="100" rx="12" fill="rgba(255,255,255,.06)" stroke="rgba(255,255,255,.18)" />
      {/* letter */}
      <rect x="32" y="48" width="176" height="84" rx="8" fill="rgba(255,255,255,.08)" stroke="rgba(255,255,255,.14)" />
      {/* inner chevron */}
      <path d="M24 56 L120 116 L216 56" stroke="rgba(255,255,255,.25)" />
      {/* flap (animated) */}
      <path
        ref={flapRef}
        d="M24 56 L120 16 L216 56 L216 56"
        fill="rgba(99,102,241,.35)"
        stroke="rgba(255,255,255,.2)"
      />
    </svg>
  );
}
