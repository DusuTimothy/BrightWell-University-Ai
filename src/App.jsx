import React, { lazy, Suspense, useEffect } from 'react';
import { Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom';
import PublicHeader from './components/layout/PublicHeader.jsx';
import PublicFooter from './components/layout/PublicFooter.jsx';
import PortalShell from './components/portal/PortalShell.jsx';

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

const PortalLoginPage = lazy(() => import('./pages/Portal/PortalLoginPage.jsx'));
const AdminDashboard = lazy(() => import('./pages/Portal/Admin/AdminDashboard.jsx'));
const AdminStudents = lazy(() => import('./pages/Portal/Admin/AdminStudents.jsx'));
const AdminStaff = lazy(() => import('./pages/Portal/Admin/AdminStaff.jsx'));
const AdminClasses = lazy(() => import('./pages/Portal/Admin/AdminClasses.jsx'));
const AdminTimetable = lazy(() => import('./pages/Portal/Admin/AdminTimetable.jsx'));
const AdminGrades = lazy(() => import('./pages/Portal/Admin/AdminGrades.jsx'));
const AdminFees = lazy(() => import('./pages/Portal/Admin/AdminFees.jsx'));
const AdminAnnouncements = lazy(() => import('./pages/Portal/Admin/AdminAnnouncements.jsx'));

const StudentDashboard = lazy(() => import('./pages/Portal/Student/StudentDashboard.jsx'));
const StudentResults = lazy(() => import('./pages/Portal/Student/StudentResults.jsx'));
const StudentTimetable = lazy(() => import('./pages/Portal/Student/StudentTimetable.jsx'));
const StudentFees = lazy(() => import('./pages/Portal/Student/StudentFees.jsx'));
const StudentAnnouncements = lazy(() => import('./pages/Portal/Student/StudentAnnouncements.jsx'));

const TeacherDashboard = lazy(() => import('./pages/Portal/Teacher/TeacherDashboard.jsx'));
const TeacherClasses = lazy(() => import('./pages/Portal/Teacher/TeacherClasses.jsx'));
const TeacherGradebook = lazy(() => import('./pages/Portal/Teacher/TeacherGradebook.jsx'));
const TeacherTimetable = lazy(() => import('./pages/Portal/Teacher/TeacherTimetable.jsx'));
const TeacherAnnouncements = lazy(() => import('./pages/Portal/Teacher/TeacherAnnouncements.jsx'));

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

function PublicLayout() {
  return (
    <>
      <PublicHeader />
      <main id="main-content" tabIndex={-1} className="outline-none">
        <Outlet />
      </main>
      <PublicFooter />
    </>
  );
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
      <Suspense fallback={<Loader />}>
        <Routes>
          <Route element={<PublicLayout />}>
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
          </Route>

          <Route path="/portal" element={<Navigate to="/portal/login" replace />} />
          <Route path="/portal/login" element={<PortalLoginPage />} />

          <Route path="/portal/admin" element={<PortalShell role="admin" />}>
            <Route index element={<AdminDashboard />} />
            <Route path="students" element={<AdminStudents />} />
            <Route path="staff" element={<AdminStaff />} />
            <Route path="classes" element={<AdminClasses />} />
            <Route path="timetable" element={<AdminTimetable />} />
            <Route path="grades" element={<AdminGrades />} />
            <Route path="fees" element={<AdminFees />} />
            <Route path="announcements" element={<AdminAnnouncements />} />
          </Route>

          <Route path="/portal/student" element={<PortalShell role="student" />}>
            <Route index element={<StudentDashboard />} />
            <Route path="results" element={<StudentResults />} />
            <Route path="timetable" element={<StudentTimetable />} />
            <Route path="fees" element={<StudentFees />} />
            <Route path="announcements" element={<StudentAnnouncements />} />
          </Route>

          <Route path="/portal/teacher" element={<PortalShell role="teacher" />}>
            <Route index element={<TeacherDashboard />} />
            <Route path="classes" element={<TeacherClasses />} />
            <Route path="gradebook" element={<TeacherGradebook />} />
            <Route path="timetable" element={<TeacherTimetable />} />
            <Route path="announcements" element={<TeacherAnnouncements />} />
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </div>
  );
}