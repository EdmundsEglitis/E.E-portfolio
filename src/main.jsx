import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App.jsx';
import Home from './routes/Home.jsx';
import Projects from './routes/Projects.jsx';
import About from './routes/About.jsx';
import Contact from './routes/Contact.jsx';
import ProjectDetail from './routes/ProjectDetail.jsx';
import './index.css';
import anime from 'animejs';
import { useUI, initTheme } from './store/uiStore';
import { initScrollProgress } from './lib/animeScroll';

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

initTheme();

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: 'projects', element: <Projects /> },
      { path: 'projects/:slug', element: <ProjectDetail /> },
      { path: 'about', element: <About /> },
      { path: 'contact', element: <Contact /> },
    ],
  },
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<RouterProvider router={router} />);


const stop = initScrollProgress((p) => useUI.getState().setDocProgress(p));
window.addEventListener('beforeunload', () => stop && stop());
