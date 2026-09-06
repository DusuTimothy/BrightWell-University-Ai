import React, { lazy, Suspense, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import PublicHeader from './components/layout/PublicHeader.jsx';
import PublicFooter from './components/layout/PublicFooter.jsx';

const HomePage = lazy(() => import('./pages/Public/HomePage.jsx'));
const AdmissionsPage = lazy(() => import('./pages/Public/AdmissionsPage.jsx'));
const CoursesPage = lazy(() => import('./pages/Public/CoursesPage.jsx'));
const NewsPage = lazy(() => import('./pages/Public/NewsPage.jsx'));
const NewsArticlePage = lazy(() => import('./pages/Public/NewsArticlePage.jsx'));
const ResearchPage = lazy(() => import('./pages/Public/ResearchPage.jsx'));
const AboutPage = lazy(() => import('./pages/Public/AboutPage.jsx'));
const StudentLifePage = lazy(() => import('./pages/Public/StudentLifePage.jsx'));
const EventsPage = lazy(() => import('./pages/Public/EventsPage.jsx'));
const ContactPage = lazy(() => import('./pages/Public/ContactPage.jsx'));
const SearchPage = lazy(() => import('./pages/Public/SearchPage.jsx'));
const NotFoundPage = lazy(() => import('./pages/Public/NotFoundPage.jsx'));

function Loader() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center">
      <img src="/crest.svg" alt="" className="w-16 animate-pulse" />
    </div>
  );
}

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' });
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <div className="font-sans">
      <ScrollToTop />
      <a
        href="#main-content"
        className="sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:left-4 focus-visible:top-4 focus-visible:z-[300] focus-visible:bg-white focus-visible:px-5 focus-visible:py-3 focus-visible:font-bold focus-visible:text-royal focus-visible:shadow-lg"
      >
        Skip to main content
      </a>
      <PublicHeader />
      <main id="main-content" tabIndex={-1} className="outline-none">
        <Suspense fallback={<Loader />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/admissions" element={<AdmissionsPage />} />
            <Route path="/courses" element={<CoursesPage />} />
            <Route path="/news" element={<NewsPage />} />
            <Route path="/news/:slug" element={<NewsArticlePage />} />
            <Route path="/research" element={<ResearchPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/student-life" element={<StudentLifePage />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </main>
      <PublicFooter />
    </div>
  );
}