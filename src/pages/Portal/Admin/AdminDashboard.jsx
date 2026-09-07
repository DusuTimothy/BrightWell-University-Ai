import React from 'react';
import { Link } from 'react-router-dom';
import { PageHeading, Card, Stat, Badge, DataTable } from '../../../components/portal/PortalKit.jsx';
import { Icon } from '../../../components/ui/Kit.jsx';
import { learningCourses, allLessons, courseProgressPct } from '../../../data/learning.js';
import { students, staff } from '../../../data/school.js';

export default function AdminDashboard() {
  const totalLessons = learningCourses.reduce((a, c) => a + allLessons(c).length, 0);
  const totalAssignments = learningCourses.reduce((a, c) => a + c.assignments.length, 0);
  const totalQuizzes = learningCourses.reduce((a, c) => a + c.quiz.questions.length, 0);
  const demoEnrolments = students.length * learningCourses.length;
  const avgPlatformProgress = Math.round(learningCourses.reduce((a, c) => a + courseProgressPct(c.slug), 0) / (learningCourses.length || 1));

  const byLevel = (lvl) => learningCourses.filter((c) => c.level === lvl).length;
  const byBranch = (b) => learningCourses.filter((c) => c.branch === b).length;

  return (
    <div className="flex flex-col gap-6">
      <PageHeading
        title="Platform overview"
        subtitle="Brightwell Academy e-learning platform — at a glance"
        actions={
          <Link to="/portal/admin/learn" className="c-button c-button--secondary !py-2.5">
            Manage courses
            <Icon name="arrow" className="c-icon--sm" />
          </Link>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="Courses live" value={learningCourses.length} sub={`${byLevel('JSS')} junior · ${byLevel('SSS')} senior`} icon={<Icon name="book-open" className="c-icon--sm" />} />
        <Stat label="Video lessons" value={totalLessons} sub="Published on platform" icon={<Icon name="play" className="c-icon--sm" />} />
        <Stat label="Assignments" value={totalAssignments} sub={`${totalQuizzes} quiz questions`} icon={<Icon name="clipboard" className="c-icon--sm" />} />
        <Stat label="Enrolments" value={demoEnrolments} sub={`${students.length} demo learners`} icon={<Icon name="users" className="c-icon--sm" />} />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <h3 className="h4 mb-4 text-heading">Platform health</h3>
          <dl className="flex flex-col gap-3">
            <div className="flex items-center justify-between rounded-lg bg-off-white-50 px-4 py-3 text-sm">
              <dt className="text-body">Average platform progress</dt>
              <dd className="font-semibold text-heading">{avgPlatformProgress}%</dd>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-off-white-50 px-4 py-3 text-sm">
              <dt className="text-body">University courses</dt>
              <dd className="font-semibold text-heading">{byBranch('university')}</dd>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-off-white-50 px-4 py-3 text-sm">
              <dt className="text-body">Secondary school courses</dt>
              <dd className="font-semibold text-heading">{byBranch('secondary')}</dd>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-off-white-50 px-4 py-3 text-sm">
              <dt className="text-body">Active instructors</dt>
              <dd className="font-semibold text-heading">{new Set(learningCourses.map((c) => c.teacherId)).size}</dd>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-off-white-50 px-4 py-3 text-sm">
              <dt className="text-body">Storage (browser)</dt>
              <dd className="font-semibold text-heading">Local</dd>
            </div>
          </dl>
        </Card>

        <Card>
          <h3 className="h4 mb-3 text-heading">Quick links</h3>
          <ul className="flex flex-col gap-2">
            <li>
              <Link to="/portal/admin/learn" className="flex items-center justify-between gap-2 rounded-lg bg-band/40 p-3 text-sm font-medium hover:bg-band">
                <span className="flex items-center gap-2">
                  <Icon name="book-open" className="c-icon--sm fill-accent" />
                  Manage courses
                </span>
                <Icon name="chevron-right" className="c-icon--xs" />
              </Link>
            </li>
            <li>
              <Link to="/courses" className="flex items-center justify-between gap-2 rounded-lg bg-band/40 p-3 text-sm font-medium hover:bg-band">
                <span className="flex items-center gap-2">
                  <Icon name="search" className="c-icon--sm fill-accent" />
                  Public catalogue
                </span>
                <Icon name="chevron-right" className="c-icon--xs" />
              </Link>
            </li>
          </ul>

          <div className="mt-4 rounded-lg bg-brand/5 p-4 text-xs leading-relaxed text-body">
            <p className="font-semibold text-heading">Demo note</p>
            <p className="mt-1">
              Progress, quiz scores and grades persist in the browser — the demo behaves like a real LMS without a backend.
            </p>
          </div>
        </Card>
      </div>

      <Card>
        <h3 className="h4 mb-4 text-heading">Top courses by content</h3>
        <DataTable
          head={['#', 'Course', 'Subject', 'Lessons', 'Assignments', 'Status']}
          rows={[...learningCourses]
            .sort((a, b) => allLessons(b).length - allLessons(a).length)
            .slice(0, 8)
            .map((c, i) => [
              <span key="i" className="font-semibold text-accent">{String(i + 1).padStart(2, '0')}</span>,
              <div key="t" className="flex items-center gap-3">
                <img src={c.img} alt="" className="h-9 w-12 shrink-0 rounded object-cover" />
                <span className="font-medium text-ink">{c.title}</span>
              </div>,
              <Badge key="s" tone="cyan">{c.subject}</Badge>,
              <span key="l">{allLessons(c).length}</span>,
              <span key="a">{c.assignments.length}</span>,
              <Badge key="st" tone={courseProgressPct(c.slug) >= 100 ? 'success' : 'accent'}>
                {courseProgressPct(c.slug) >= 100 ? 'Complete' : 'Live'}
              </Badge>,
            ])}
        />
      </Card>
    </div>
  );
}