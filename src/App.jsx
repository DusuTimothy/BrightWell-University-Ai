import React, { lazy, Suspense, useEffect } from 'react';
import { Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom';
import PublicHeader from './components/layout/PublicHeader.jsx';
import PublicFooter from './components/layout/PublicFooter.jsx';
import PortalShell from './components/portal/PortalShell.jsx';

const HomePage = lazy(() => import('./pages/Public/HomePage.jsx'));
const CoursesPage = lazy(() => import('./pages/Public/CoursesPage.jsx'));
const CourseDetailPage = lazy(() => import('./pages/Public/CourseDetailPage.jsx'));
const AboutPage = lazy(() => import('./pages/Public/AboutPage.jsx'));
const NotFoundPage = lazy(() => import('./pages/Public/NotFoundPage.jsx'));

const PortalLoginPage = lazy(() => import('./pages/Portal/PortalLoginPage.jsx'));
const SignUpStep1 = lazy(() => import('./pages/Portal/Signup/SignUpStep1.jsx'));
const SignUpStep2 = lazy(() => import('./pages/Portal/Signup/SignUpStep2.jsx'));
const SignUpStep3 = lazy(() => import('./pages/Portal/Signup/SignUpStep3.jsx'));
const SignUpDone = lazy(() => import('./pages/Portal/Signup/SignUpDone.jsx'));

const AdminDashboard = lazy(() => import('./pages/Portal/Admin/AdminDashboard.jsx'));
const AdminLearning = lazy(() => import('./pages/Portal/Admin/AdminLearning.jsx'));
const AdminCourseManage = lazy(() => import('./pages/Portal/Admin/AdminCourseManage.jsx'));

const StudentDashboard = lazy(() => import('./pages/Portal/Student/StudentDashboard.jsx'));
const StudentLearning = lazy(() => import('./pages/Portal/Student/StudentLearning.jsx'));
const StudentLearningCourse = lazy(() => import('./pages/Portal/Student/StudentLearningCourse.jsx'));
const StudentLessonPlayer = lazy(() => import('./pages/Portal/Student/StudentLessonPlayer.jsx'));
const StudentQuiz = lazy(() => import('./pages/Portal/Student/StudentQuiz.jsx'));
const StudentAssignments = lazy(() => import('./pages/Portal/Student/StudentAssignments.jsx'));
const StudentQuizRunner = lazy(() => import('./pages/Portal/Student/QuizRunner.jsx'));
const StudentQuizHistory = lazy(() => import('./pages/Portal/Student/StudentQuizHistory.jsx'));
const StudentWishlist = lazy(() => import('./pages/Portal/Student/StudentWishlist.jsx'));
const StudentCertificates = lazy(() => import('./pages/Portal/Student/StudentCertificates.jsx'));
const StudentDeadlines = lazy(() => import('./pages/Portal/Student/StudentDeadlines.jsx'));
const StudentCalendar = lazy(() => import('./pages/Portal/Student/StudentCalendar.jsx'));
const StudentGrades = lazy(() => import('./pages/Portal/Student/StudentGrades.jsx'));
const StudentAchievements = lazy(() => import('./pages/Portal/Student/StudentAchievements.jsx'));
const StudentBrowse = lazy(() => import('./pages/Portal/Student/StudentBrowse.jsx'));
const StudentAccount = lazy(() => import('./pages/Portal/Student/StudentAccount.jsx'));

const TeacherDashboard = lazy(() => import('./pages/Portal/Teacher/TeacherDashboard.jsx'));
const TeacherLearning = lazy(() => import('./pages/Portal/Teacher/TeacherLearning.jsx'));
const TeacherCourseManage = lazy(() => import('./pages/Portal/Teacher/TeacherCourseManage.jsx'));
const TeacherQuizzes = lazy(() => import('./pages/Portal/Teacher/Quizzes/TeacherQuizzes.jsx'));
const NewQuiz = lazy(() => import('./pages/Portal/Teacher/Quizzes/NewQuiz.jsx'));
const TeacherQuizDetail = lazy(() => import('./pages/Portal/Teacher/Quizzes/TeacherQuizDetail.jsx'));
const QuestionBank = lazy(() => import('./pages/Portal/Teacher/QuestionBank.jsx'));
const PlaceholderPage = lazy(() => import('./pages/Portal/PlaceholderPage.jsx'));

function Loader() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center">
      <img src="/crest.svg" alt="" className="w-16 animate-pulse" />
    </div>
  );
}

function ScrollOutPage({ title, subtitle, icon, back, cta }) {
  return <PlaceholderPage title={title} subtitle={subtitle} icon={icon} back={back} cta={cta} />;
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
            <Route path="/courses" element={<CoursesPage />} />
            <Route path="/courses/:slug" element={<CourseDetailPage />} />
            <Route path="/about" element={<AboutPage />} />
          </Route>

          <Route path="/portal" element={<Navigate to="/portal/login" replace />} />
          <Route path="/portal/login" element={<PortalLoginPage />} />
          <Route path="/portal/signup" element={<SignUpStep1 />} />
          <Route path="/portal/signup/profile" element={<SignUpStep2 />} />
          <Route path="/portal/signup/preferences" element={<SignUpStep3 />} />
          <Route path="/portal/signup/done" element={<SignUpDone />} />

          {/* ADMIN */}
          <Route path="/portal/admin" element={<PortalShell role="admin" />}>
            <Route index element={<AdminDashboard />} />
            <Route path="users" element={<ScrollOutPage title="Users" subtitle="Manage every account on the platform." icon="users" back={{ to: '/portal/admin', label: 'Back to dashboard' }} />} />
            <Route path="users/roles" element={<ScrollOutPage title="Roles & permissions" subtitle="RBAC matrix" icon="shield" />} />
            <Route path="users/import" element={<ScrollOutPage title="Bulk import" subtitle="CSV upload & validation" icon="upload" />} />
            <Route path="learn" element={<AdminLearning />} />
            <Route path="learn/:slug" element={<AdminCourseManage />} />
            <Route path="courses/approvals" element={<ScrollOutPage title="Pending approvals" subtitle="Review queue" icon="clipboard-check" />} />
            <Route path="courses/taxonomy" element={<ScrollOutPage title="Categories & tags" subtitle="Course taxonomy" icon="folder-tree" />} />
            <Route path="enrolments" element={<ScrollOutPage title="Enrolments" subtitle="Per course / cohort / term" icon="user-plus" />} />
            <Route path="payments" element={<ScrollOutPage title="Payments" subtitle="Stripe-like ledger" icon="credit-card" />} />
            <Route path="payments/refunds" element={<ScrollOutPage title="Refunds" subtitle="Refund queue" icon="rotate-ccw" />} />
            <Route path="payments/coupons" element={<ScrollOutPage title="Coupons" subtitle="Discount codes" icon="ticket-percent" />} />
            <Route path="reports/revenue" element={<ScrollOutPage title="Revenue reports" subtitle="Earnings & forecasts" icon="line-chart" />} />
            <Route path="analytics" element={<ScrollOutPage title="Platform metrics" subtitle="Funnels & retention" icon="bar-chart-3" />} />
            <Route path="analytics/engagement" element={<ScrollOutPage title="Engagement" subtitle="DAU / WAU / MAU" icon="activity" />} />
            <Route path="analytics/cohorts" element={<ScrollOutPage title="Cohort analysis" subtitle="Retention cohorts" icon="users-2" />} />
            <Route path="announcements" element={<ScrollOutPage title="Announcements" subtitle="Cross-platform banner" icon="megaphone" />} />
            <Route path="emails" element={<ScrollOutPage title="Email templates" subtitle="Transactional emails" icon="mail" />} />
            <Route path="support" element={<ScrollOutPage title="Support inbox" subtitle="Learner support tickets" icon="message-circle" />} />
            <Route path="audit" element={<ScrollOutPage title="Audit log" subtitle="System activity" icon="scroll-text" />} />
            <Route path="flags" element={<ScrollOutPage title="Feature flags" subtitle="Toggle platform features" icon="flag" />} />
            <Route path="integrations" element={<ScrollOutPage title="Integrations" subtitle="Zoom, Stripe, S3…" icon="plug" />} />
            <Route path="settings" element={<ScrollOutPage title="Settings" subtitle="Organisation config" icon="settings" />} />
          </Route>

          {/* INSTRUCTOR */}
          <Route path="/portal/teacher" element={<PortalShell role="teacher" />}>
            <Route index element={<TeacherDashboard />} />
            <Route path="courses" element={<TeacherLearning />} />
            <Route path="courses/new" element={<ScrollOutPage title="Create new course" subtitle="Course authoring wizard" icon="plus-circle" back={{ to: '/portal/teacher/courses', label: 'Back to courses' }} />} />
            <Route path="courses/:slug/manage" element={<TeacherCourseManage />} />
            <Route path="content/lessons" element={<ScrollOutPage title="Lessons" subtitle="Cross-course lesson library" icon="file-text" />} />
            <Route path="content/media" element={<ScrollOutPage title="Media library" subtitle="Uploaded videos, PDFs, images" icon="film" />} />
            <Route path="content/questions" element={<QuestionBank />} />
            <Route path="quizzes" element={<TeacherQuizzes />} />
            <Route path="quizzes/new" element={<NewQuiz />} />
            <Route path="quizzes/:id" element={<TeacherQuizDetail />} />
            <Route path="assignments" element={<ScrollOutPage title="Assignments" subtitle="Manage across courses" icon="file-check" />} />
            <Route path="rubrics" element={<ScrollOutPage title="Rubrics" subtitle="Reusable grading rubrics" icon="sliders" />} />
            <Route path="gradebook" element={<ScrollOutPage title="Gradebook" subtitle="Spreadsheet view" icon="table-2" />} />
            <Route path="students" element={<ScrollOutPage title="Roster" subtitle="All learners" icon="users" />} />
            <Route path="students/progress" element={<ScrollOutPage title="Progress map" subtitle="Per-student journey" icon="map" />} />
            <Route path="students/at-risk" element={<ScrollOutPage title="At-risk students" subtitle="Auto-flagged by inactivity / grades" icon="alert-triangle" />} />
            <Route path="analytics/course" element={<ScrollOutPage title="Course analytics" subtitle="Engagement, completion" icon="bar-chart" />} />
            <Route path="analytics/quiz" element={<ScrollOutPage title="Quiz analytics" subtitle="Item analysis & pass rates" icon="pie-chart" />} />
            <Route path="announcements" element={<ScrollOutPage title="Announcements" subtitle="Per-course posts" icon="megaphone" />} />
            <Route path="messages" element={<ScrollOutPage title="Messages" subtitle="Direct messages" icon="message-square" />} />
            <Route path="settings/profile" element={<ScrollOutPage title="Profile" subtitle="Public instructor profile" icon="user" />} />
            <Route path="settings/payouts" element={<ScrollOutPage title="Payouts" subtitle="Earnings & bank info" icon="wallet" />} />
          </Route>

          {/* STUDENT (LEARNER) */}
          <Route path="/portal/student" element={<PortalShell role="student" />}>
            <Route index element={<StudentDashboard />} />
            <Route path="courses" element={<StudentLearning />} />
            <Route path="courses/:slug" element={<StudentLearningCourse />} />
            <Route path="courses/:slug/:lessonId" element={<StudentLessonPlayer />} />
            <Route path="courses/:slug/quiz" element={<StudentQuiz />} />
            <Route path="courses/:slug/assignments" element={<StudentAssignments />} />
            <Route path="wishlist" element={<StudentWishlist />} />
            <Route path="certificates" element={<StudentCertificates />} />
            <Route path="browse" element={<StudentBrowse />} />
            <Route path="browse/branch/:id" element={<StudentBrowse />} />
            <Route path="deadlines" element={<StudentDeadlines />} />
            <Route path="calendar" element={<StudentCalendar />} />
            <Route path="grades" element={<StudentGrades />} />
            <Route path="quizzes" element={<StudentQuizHistory />} />
            <Route path="quizzes/take/:id" element={<StudentQuizRunner />} />
            <Route path="achievements" element={<StudentAchievements />} />
            <Route path="account/profile" element={<StudentAccount title="Profile" />} />
            <Route path="account/notifications" element={<StudentAccount title="Notifications" />} />
            <Route path="account/help" element={<StudentAccount title="Help & support" />} />
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </div>
  );
}