import { lazy } from 'react';
import type { RouteRecord } from 'vite-react-ssg';
import SiteLayout from './components/layout/SiteLayout';
import HomePage from './components/home/HomePage';
import { getAllSlugs } from './lib/mdblog';

// Code-split every route except the homepage. Each page becomes its own chunk
// (vite-react-ssg's `lazy` field is build-time aware: it still prerenders each
// page to static HTML AND auto-detects styles to avoid FOUC). This keeps the
// homepage's JS lean, it no longer ships About/Services/Blog/markdown code that
// it never runs. Pages default-export their component, so we map default→Component.
const page = (load: () => Promise<{ default: React.ComponentType }>) => () =>
  load().then((m) => ({ Component: m.default }));

// Client-only routes, lazy so their modules are never evaluated during SSG.
const PortalApp = lazy(() => import('./pages/PortalApp'));
const SubmitReview = lazy(() => import('./components/SubmitReview'));
const PrepPage = lazy(() => import('./pages/PrepPage'));
const AdminPage = lazy(() => import('./pages/AdminPage'));

export const routes: RouteRecord[] = [
  {
    path: '/',
    element: <SiteLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'about', lazy: page(() => import('./pages/AboutPage')) },
      { path: 'services', lazy: page(() => import('./pages/ServicesPage')) },
      { path: 'results', lazy: page(() => import('./pages/ResultsPage')) },
      { path: 'reviews', lazy: page(() => import('./pages/ReviewsPage')) },
      { path: 'faq', lazy: page(() => import('./pages/FaqPage')) },
      { path: 'contact', lazy: page(() => import('./pages/ContactPage')) },
      { path: 'careers', lazy: page(() => import('./pages/CareersPage')) },
      { path: 'blog', lazy: page(() => import('./pages/BlogIndexPage')) },
      {
        path: 'blog/:slug',
        lazy: page(() => import('./pages/BlogPostPage')),
        getStaticPaths: () => getAllSlugs().map((s) => `/blog/${s}`),
      },
      // Prerendered to /404/index.html → copied to /404.html in postbuild so
      // Netlify serves it (with a real 404 status) for unmatched URLs.
      { path: '404', lazy: page(() => import('./pages/NotFoundPage')) },
      { path: '*', lazy: page(() => import('./pages/NotFoundPage')) },
    ],
  },

  // Paid-ads landing page, prerendered (fast load for ad traffic) but it
  // deliberately stands outside SiteLayout so it has no global nav/footer.
  // noindex + kept out of the sitemap (paid traffic only).
  { path: '/get-started', lazy: page(() => import('./pages/LandingPage')) },

  // Dynamic, client-only app routes (excluded from prerender via includedRoutes).
  { path: '/portal/*', element: <PortalApp /> },
  { path: '/submit-review', element: <SubmitReview /> },
  // Post-booking call-prep page (uploads + goal + objection videos).
  { path: '/prep', element: <PrepPage /> },
  // Private command center (key-gated client-side; data via Apps Script API).
  // NOTE: /admin is the Decap CMS Content Studio, so the dashboard lives at /hq.
  { path: '/hq', element: <AdminPage /> },
];
