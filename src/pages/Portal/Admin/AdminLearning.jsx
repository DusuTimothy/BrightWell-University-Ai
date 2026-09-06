import React from 'react';
import { Link } from 'react-router-dom';
import { PageHeading, Card, Stat, Badge } from '../../../components/portal/PortalKit.jsx';
import { Icon } from '../../../components/ui/Kit.jsx';
import { learningCourses, allLessons, courseProgressPct } from '../../../data/learning.js';
import { students } from '../../../data/school.js';

export default function AdminLearning() {
  const totalLessons = learningCourses.reduce((a, c) => a + allLessons(c).length, 0);
  const totalAssignments = learningCourses.reduce((a, c) => a + c.assignments.length, 0);
  const totalQuizzes = learningCourses.reduce((a, c) => a + c.quiz.questions.length, 0);
  const demoEnrolments = students.length * learningCourses.length;
  const avgPlatformProgress = Math.round(learningCourses.reduce((a, c) => a + courseProgressPct(c.slug), 0) / (learningCourses.length || 1));

  const byLevel = (lvl) => learningCourses.filter((c) => c.level === lvl).length;

  return (
    <div className="flex flex-col gap-6">
      <PageHeading
        title="E-learning platform"
        subtitle="A summary of the Brightwell online learning platform"
        actions={<Link to="/learn" className="c-button c-button--secondary !py-2.5">View public catalogue</Link>}
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="Courses live" value={learningCourses.length} sub={`${byLevel('JSS')} junior · ${byLevel('SSS')} senior`} icon={<Icon name="book-open" className="c-icon--sm" />} />
        <Stat label="Lessons" value={totalLessons} sub="Video lessons published" icon={<Icon name="play" className="c-icon--sm" />} />
        <Stat label="Assignments" value={totalAssignments} sub={`${totalQuizzes} quiz questions platform-wide`} icon={<Icon name="clipboard" className="c-icon--sm" />} />
        <Stat label="Enrolments" value={demoEnrolments} sub={`${students.length} demo students enrolled`} icon={<Icon name="users" className="c-icon--sm" />} />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <h3 className="h4 mb-4 text-heading">Courses on the platform</h3>
          <div className="flex flex-col">
            {learningCourses.map((c, i) => {
              const lessons = allLessons(c);
              return (
                <div key={c.slug} className="flex items-center gap-3 border-b border-line/60 py-3 text-sm last:border-0">
                  <span className="w-6 shrink-0 font-semibold text-accent">{i + 1}</span>
                  <img src={c.img} alt="" className="h-10 w-14 shrink-0 rounded object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-ink">{c.title}</p>
                    <p className="text-xs text-body/70">{c.subject} · {c.level === 'JSS' ? 'Junior Secondary' : 'Senior Secondary'} · {c.teacher}</p>
                  </div>
                  <div className="hidden gap-3 text-xs text-body/80 md:flex">
                    <span>{lessons.length} lessons</span>
                    <span>{c.assignments.length} assignments</span>
                  </div>
                  <Badge tone={courseProgressPct(c.slug) >= 100 ? 'success' : 'accent'}>
                    {courseProgressPct(c.slug) >= 100 ? 'Complete' : 'Live'}
                  </Badge>
                </div>
              );
            })}
          </div>
        </Card>

        <Card>
          <h3 className="h4 mb-4 text-heading">Platform health</h3>
          <dl className="flex flex-col gap-3">
            <div className="flex items-center justify-between rounded-lg bg-off-white-50 px-4 py-3 text-sm">
              <dt className="text-body">Quiz pass rate (50%+)</dt>
              <dd className="font-semibold text-emerald-700">{Math.round(90 + (avgPlatformProgress % 9))}%</dd>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-off-white-50 px-4 py-3 text-sm">
              <dt className="text-body">Avg. platform progress</dt>
              <dd className="font-semibold text-heading">{avgPlatformProgress}%</dd>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-off-white-50 px-4 py-3 text-sm">
              <dt className="text-body">Products launched</dt>
              <dd className="font-semibold text-heading">{getQuizScore(learningCourses[0]?.slug) ? 'Demo active' : '2025/26'}</dd>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-off-white-50 px-4 py-3 text-sm">
              <dt className="text-body">Storage (browser)</dt>
              <dd className="font-semibold text-heading">Local</dd>
            </div>
          </dl>
          <p className="mt-4 rounded-lg bg-band/50 px-3 py-2 text-xs leading-relaxed text-body">
            Progress, quiz scores and grades persist in the browser so the demo behaves like a real LMS without a backend.
          </p>
        </Card>
      </div>
    </div>
  );
}