// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App.jsx';
import './index.css';
import anime from 'animejs';

// polyfill (safe)
if (!anime.createDrawable) {
  anime.createDrawable = function (selectorOrEls) {
    const targets =
      typeof selectorOrEls === 'string'
        ? document.querySelectorAll(selectorOrEls)
        : selectorOrEls;
    return { animate: (opts = {}) => anime({ targets, ...opts }), targets };
  };
}

const router = createBrowserRouter([
  { path: '/', element: <App /> },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <RouterProvider router={router} />
);