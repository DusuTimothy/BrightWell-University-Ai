import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { PageHeading, Card, Stat, Badge, DataTable } from '../../../components/portal/PortalKit.jsx';
import { GradePill } from '../../../components/portal/PortalBits.jsx';
import { Icon } from '../../../components/ui/Kit.jsx';
import {
  learningCourses, allLessons, courseProgressPct, studentCourseProgressPct,
  studentQuizScore, getLearningCourse,
} from '../../../data/learning.js';
import { getPortalUser } from '../../../lib/portalAuth.js';
import { staff, students, gradeFor } from '../../../data/school.js';

export default function TeacherDashboard() {
  const user = getPortalUser();
  const me = staff.find((t) => t.id === user.id) || staff[0];
  const myCourses = learningCourses.filter((c) => c.teacherId === me.id);

  const stats = useMemo(() => {
    const totalLessons = myCourses.reduce((a, c) => a + allLessons(c).length, 0);
    const totalAssignments = myCourses.reduce((a, c) => a + c.assignments.length, 0);
    const learners = students.filter((s) =>
      myCourses.some((c) => c.level === (s.class.startsWith('SS') ? 'SSS' : 'JSS'))
    );
    const avgProgress = myCourses.length
      ? Math.round(myCourses.reduce((a, c) => a + courseProgressPct(c.slug), 0) / myCourses.length)
      : 0;
    return { totalLessons, totalAssignments, learners: learners.length, avgProgress };
  }, [myCourses]);

  const recentSubmissions = useMemo(() => {
    const out = [];
    myCourses.forEach((c) => {
      c.assignments.forEach((a) => {
        students.slice(0, 4).forEach((s) => {
          out.push({
            student: s.name,
            class: s.class,
            course: c.title,
            assignment: a.title,
            points: a.points,
            grade: Math.round(a.points * (45 + (s.id.charCodeAt(4) + a.id.length) % 50) / 100),
          });
        });
      });
    });
    return out.slice(0, 6);
  }, [myCourses]);

  const myCourseNames = new Set(myCourses.map((c) => c.title));

  return (
    <div className="flex flex-col gap-6">
      <PageHeading
        title={`Hello, ${user.name.split(' ')[0]}`}
        subtitle={`${me.subject} instructor · ${myCourses.length} courses on the platform`}
        actions={
          <Link to="/portal/teacher/learn" className="c-button c-button--secondary !py-2.5">
            View my courses
            <Icon name="arrow" className="c-icon--sm" />
          </Link>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="Active courses" value={myCourses.length} sub="Published on platform" icon={<Icon name="book-open" className="c-icon--sm" />} />
        <Stat label="Lessons" value={stats.totalLessons} sub="Across your courses" icon={<Icon name="play" className="c-icon--sm" />} />
        <Stat label="Assignments" value={stats.totalAssignments} sub="Awaiting grading" icon={<Icon name="clipboard" className="c-icon--sm" />} />
        <Stat label="Learners enrolled" value={stats.learners} sub="In your subject area" icon={<Icon name="users" className="c-icon--sm" />} />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <h3 className="h4 mb-4 text-heading">Recent submissions</h3>
          {recentSubmissions.length === 0 ? (
            <p className="text-sm text-body">No submissions yet.</p>
          ) : (
            <DataTable
              head={['Learner', 'Course', 'Assignment', 'Grade']}
              rows={recentSubmissions.map((r) => [
                <div key="n">
                  <p className="font-medium text-ink">{r.student}</p>
                  <p className="text-xs text-body/70">{r.class}</p>
                </div>,
                <span key="c" className="text-sm text-body">{r.course}</span>,
                <span key="a" className="text-sm text-body">{r.assignment}</span>,
                <div key="g" className="flex items-center gap-2">
                  <GradePill letter={gradeFor(Math.round((r.grade / r.points) * 100)).letter} />
                  <span className="text-sm font-semibold">{r.grade}/{r.points}</span>
                </div>,
              ])}
            />
          )}
        </Card>

        <Card>
          <h3 className="h4 mb-3 text-heading">Quick actions</h3>
          <ul className="flex flex-col gap-2">
            <li>
              <Link to="/portal/teacher/learn" className="flex items-center justify-between gap-2 rounded-lg bg-band/40 p-3 text-sm font-medium hover:bg-band">
                <span className="flex items-center gap-2">
                  <Icon name="book-open" className="c-icon--sm fill-accent" />
                  My courses
                </span>
                <Icon name="chevron-right" className="c-icon--xs" />
              </Link>
            </li>
            {myCourses[0] && (
              <li>
                <Link to={`/portal/teacher/learn/${myCourses[0].slug}/manage`} className="flex items-center justify-between gap-2 rounded-lg bg-band/40 p-3 text-sm font-medium hover:bg-band">
                  <span className="flex items-center gap-2">
                    <Icon name="clipboard" className="c-icon--sm fill-accent" />
                    Grade assignments
                  </span>
                  <Icon name="chevron-right" className="c-icon--xs" />
                </Link>
              </li>
            )}
            <li>
              <Link to="/courses" className="flex items-center justify-between gap-2 rounded-lg bg-band/40 p-3 text-sm font-medium hover:bg-band">
                <span className="flex items-center gap-2">
                  <Icon name="search" className="c-icon--sm fill-accent" />
                  View public catalogue
                </span>
                <Icon name="chevron-right" className="c-icon--xs" />
              </Link>
            </li>
          </ul>

          <div className="mt-4 rounded-lg bg-brand/5 p-4 text-xs leading-relaxed text-body">
            <p className="font-semibold text-heading">Tip</p>
            <p className="mt-1">
              Use the Manage page for any course to track learner progress, view quiz scores and grade assignments.
            </p>
          </div>
        </Card>
      </div>

      {myCourses.length > 0 && (
        <Card>
          <h3 className="h4 mb-3 text-heading">Your courses at a glance</h3>
          <div className="flex flex-col gap-3">
            {myCourses.map((c) => {
              const lessons = allLessons(c);
              const pct = courseProgressPct(c.slug);
              return (
                <div key={c.slug} className="flex flex-wrap items-center gap-4 rounded-lg bg-band/30 p-3">
                  <img src={c.img} alt="" className="h-12 w-16 shrink-0 rounded object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-heading">{c.title}</p>
                    <p className="text-xs text-body/70">
                      {lessons.length} lessons · {c.assignments.length} assignments · {c.quiz.questions.length}-question quiz
                    </p>
                  </div>
                  <div className="w-32">
                    <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
                      <div className="h-full rounded-full bg-accent" style={{ width: `${pct}%` }} />
                    </div>
                    <p className="mt-1 text-right text-xs font-semibold text-heading">{pct}%</p>
                  </div>
                  <Link to={`/portal/teacher/learn/${c.slug}/manage`} className="text-sm font-semibold text-accent hover:underline">
                    Manage →
                  </Link>
                </div>
              );
            })}
          </div>
        </Card>
      )}
    </div>
  );
}