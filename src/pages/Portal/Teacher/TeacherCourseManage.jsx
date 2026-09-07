import React, { useState } from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import { Card, Badge, DataTable, Bar } from '../../../components/portal/PortalKit.jsx';
import { GradePill } from '../../../components/portal/PortalBits.jsx';
import { Icon } from '../../../components/ui/Kit.jsx';
import {
  getLearningCourse, studentCourseProgressPct, studentQuizScore,
  studentAssignmentGrade, setGrade, getGrade, allLessons,
} from '../../../data/learning.js';
import { students, gradeFor } from '../../../data/school.js';
import cn from '../../../lib/cn.js';

function GradeCell({ student, assignment }) {
  const [flashed, setFlashed] = useState(false);
  const defaultGrade = studentAssignmentGrade(student.id, assignment.id, assignment.points);
  const saved = getGrade(assignment.id, student.id);

  function record(points) {
    setGrade(assignment.id, student.id, Math.max(0, Math.min(assignment.points, Number(points) || 0)));
    setFlashed(true);
    setTimeout(() => setFlashed(false), 1200);
  }

  return (
    <div className="flex items-center justify-between gap-2 rounded-lg bg-off-white-50 px-3 py-2.5 text-sm ring-1 ring-line/60">
      <div className="min-w-0">
        <p className="truncate font-medium text-ink">{student.name}</p>
        <p className="text-xs text-body/70">{student.class}</p>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <input
          type="number"
          min="0"
          max={assignment.points}
          defaultValue={saved ?? defaultGrade}
          onChange={(e) => record(e.target.value)}
          className={cn(
            'w-16 rounded-sm border border-line bg-paper px-2 py-1.5 text-sm outline-none focus:border-accent',
            flashed && 'border-emerald-400'
          )}
          aria-label={`${assignment.title} grade for ${student.name}`}
        />
        <span className="text-xs text-body/70">/{assignment.points}</span>
      </div>
    </div>
  );
}

export default function TeacherCourseManage() {
  const { slug } = useParams();
  const course = getLearningCourse(slug);
  const [tab, setTab] = useState('progress');
  if (!course) return <Navigate to="/portal/teacher/learn" replace />;

  const lessons = allLessons(course);
  const roster = students.filter((s) => (course.level === 'SSS' ? s.class.startsWith('SS') : s.class.startsWith('JSS')));

  return (
    <div className="flex flex-col gap-6">
      <Link to="/portal/teacher/learn" className="flex items-center gap-2 text-sm font-medium text-accent hover:underline">
        <Icon name="chevron-left" className="c-icon--sm" />
        My courses
      </Link>

      {/* Hero card */}
      <Card className="overflow-hidden p-0">
        <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center">
          <img src={course.img} alt="" className="h-20 w-28 shrink-0 rounded-md object-cover" />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone="cyan">{course.subject}</Badge>
              <Badge tone="muted">{course.level === 'JSS' ? 'Junior' : 'Senior'} Secondary</Badge>
              <Badge tone="warn">{lessons.length} lessons</Badge>
            </div>
            <h1 className="h3 mt-2 text-heading">{course.title}</h1>
            <p className="mt-1 text-sm text-body">{roster.length} learners enrolled</p>
          </div>
        </div>

        <div className="flex gap-1 border-t border-line bg-band/40 p-2">
          {[
            ['progress', 'Progress'],
            ['quiz', 'Quiz results'],
            ['grades', 'Grading'],
          ].map(([t, label]) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                'rounded-md px-3 py-1.5 text-sm font-semibold capitalize transition-colors',
                tab === t ? 'bg-accent text-white shadow-sm' : 'text-body hover:bg-paper hover:text-heading'
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </Card>

      {tab === 'progress' && (
        <Card>
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
      )}

      {tab === 'quiz' && (
        <Card>
          <h3 className="h4 mb-1 text-heading">Quiz results — {course.quiz.title}</h3>
          <p className="mb-4 text-sm text-body">
            Best scores for {course.quiz.questions.length}-question quiz across the roster.
          </p>
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
      )}

      {tab === 'grades' && (
        <div className="flex flex-col gap-6">
          {course.assignments.map((a) => (
            <Card key={a.id}>
              <div className="mb-1 flex flex-wrap items-center gap-2">
                <Badge tone="warn">{a.kind}</Badge>
                <Badge tone="muted">{a.points} pts</Badge>
              </div>
              <h3 className="h5 text-heading">{a.title}</h3>
              <p className="mt-1 text-sm text-body">{a.prompt}</p>

              <div className="mt-4 grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
                {roster.map((s) => (
                  <GradeCell key={s.id} student={s} assignment={a} />
                ))}
              </div>
              <p className="mt-3 text-xs text-body/70">
                Enter a score to record a grade — it saves instantly and updates the learner's record.
              </p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}