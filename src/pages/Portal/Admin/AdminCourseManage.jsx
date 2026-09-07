import React from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import { PageHeading, Card, Badge, DataTable, Bar } from '../../../components/portal/PortalKit.jsx';
import { GradePill } from '../../../components/portal/PortalBits.jsx';
import { Icon } from '../../../components/ui/Kit.jsx';
import {
  getLearningCourse, studentCourseProgressPct, studentQuizScore, allLessons,
} from '../../../data/learning.js';
import { students, gradeFor } from '../../../data/school.js';

export default function AdminCourseManage() {
  const { slug } = useParams();
  const course = getLearningCourse(slug);
  if (!course) return <Navigate to="/portal/admin/learn" replace />;

  const lessons = allLessons(course);
  const roster = students.filter((s) =>
    course.level === 'SSS' ? s.class.startsWith('SS') : s.class.startsWith('JSS')
  );

  return (
    <div className="flex flex-col gap-6">
      <Link to="/portal/admin/learn" className="flex items-center gap-2 text-sm font-medium text-accent hover:underline">
        <Icon name="chevron-left" className="c-icon--sm" />
        All courses
      </Link>

      <Card className="overflow-hidden p-0">
        <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center">
          <img src={course.img} alt="" className="h-20 w-28 shrink-0 rounded-md object-cover" />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone="cyan">{course.subject}</Badge>
              <Badge tone="muted">{course.level === 'JSS' ? 'Junior Secondary' : 'Senior Secondary'}</Badge>
              <Badge tone="warn">{lessons.length} lessons</Badge>
              <Badge tone="accent">Live</Badge>
            </div>
            <h1 className="h3 mt-2 text-heading">{course.title}</h1>
            <p className="mt-1 text-sm text-body">{course.teacher} · {course.duration}</p>
          </div>
          <Link to={`/courses/${course.slug}`} className="c-button c-button--secondary !py-2.5 shrink-0">
            View public page
            <Icon name="arrow" className="c-icon--sm" />
          </Link>
        </div>
      </Card>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <h3 className="h4 mb-1 text-heading">Learner progress</h3>
          <p className="mb-4 text-sm text-body">
            Lessons finished as a percentage of total lessons in the course.
          </p>
          <div className="flex flex-col gap-3">
            {roster.map((s) => {
              const pct = studentCourseProgressPct(s.id, course.slug);
              return (
                <div key={s.id} className="grid grid-cols-[minmax(0,18rem)_1fr_3.5rem] items-center gap-3 text-sm">
                  <div className="min-w-0">
                    <p className="truncate font-medium text-ink">{s.name}</p>
                    <p className="text-xs text-body/70">{s.id} · {s.class}</p>
                  </div>
                  <Bar pct={pct} tone={pct === 100 ? 'success' : 'accent'} />
                  <span className="text-right font-semibold text-heading">{pct}%</span>
                </div>
              );
            })}
          </div>
        </Card>

        <Card>
          <h3 className="h4 mb-3 text-heading">Course summary</h3>
          <dl className="flex flex-col divide-y divide-line text-sm">
            <div className="flex items-center justify-between py-3">
              <dt className="text-body/80">Lessons</dt>
              <dd className="font-semibold text-heading">{lessons.length}</dd>
            </div>
            <div className="flex items-center justify-between py-3">
              <dt className="text-body/80">Modules</dt>
              <dd className="font-semibold text-heading">{course.modules.length}</dd>
            </div>
            <div className="flex items-center justify-between py-3">
              <dt className="text-body/80">Quiz questions</dt>
              <dd className="font-semibold text-heading">{course.quiz.questions.length}</dd>
            </div>
            <div className="flex items-center justify-between py-3">
              <dt className="text-body/80">Assignments</dt>
              <dd className="font-semibold text-heading">{course.assignments.length}</dd>
            </div>
            <div className="flex items-center justify-between py-3">
              <dt className="text-body/80">Roster size</dt>
              <dd className="font-semibold text-heading">{roster.length}</dd>
            </div>
            <div className="flex items-center justify-between py-3">
              <dt className="text-body/80">Duration</dt>
              <dd className="font-semibold text-heading">{course.duration}</dd>
            </div>
          </dl>
        </Card>
      </div>

      <Card>
        <h3 className="h4 mb-4 text-heading">Quiz results</h3>
        <DataTable
          head={['Learner', 'Class', 'Score', 'Grade', 'Status']}
          rows={roster.map((s) => {
            const q = studentQuizScore(s.id, course.slug);
            const pct = Math.round((q.score / q.total) * 100);
            const pctGrade = gradeFor(pct);
            return [
              <div key="n"><p className="font-medium text-ink">{s.name}</p><p className="text-xs text-body/70">{s.id}</p></div>,
              <Badge key="c" tone="muted">{s.class}</Badge>,
              <span key="s" className="font-semibold">{q.score}/{q.total}</span>,
              <GradePill key="g" letter={pctGrade.letter} />,
              <Badge key="st" tone={pct >= 50 ? 'success' : 'warn'}>{pct >= 50 ? 'Passed' : 'Retake'}</Badge>,
            ];
          })}
        />
      </Card>
    </div>
  );
}