// src/components/Footer.jsx
import React from 'react';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative z-10 border-t border-white/10 bg-black/20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 sm:py-5">
        <p className="text-center text-[12.5px] leading-tight text-white/60">
          © {year} Edmunds Eglītis —
          <span className="mx-1.5">Built with</span>
          React, Tailwind, and anime.js.
        </p>
      </div>
    </footer>
  );
}
