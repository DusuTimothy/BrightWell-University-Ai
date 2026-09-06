import React from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import { PageHeading, Card, Badge, Bar } from '../../../components/portal/PortalKit.jsx';
import { Icon } from '../../../components/ui/Kit.jsx';
import { getLearningCourse, allLessons, getProgressFor, courseProgressPct, getQuizScore, levelLabel, branchById } from '../../../data/learning.js';
import cn from '../../../lib/cn.js';

export default function StudentLearningCourse() {
  const { slug } = useParams();
  const course = getLearningCourse(slug);
  if (!course) return <Navigate to="/portal/learn" replace />;

  const lessons = allLessons(course);
  const done = getProgressFor(course.slug);
  const pct = courseProgressPct(course.slug);
  const quiz = getQuizScore(course.slug);
  const branch = branchById(course.branch);

  return (
    <div className="flex flex-col gap-6">
      <PageHeading
        title={course.title}
        subtitle={`${course.subject} · ${levelLabel(course)} · ${branch.label} · ${course.teacher}`}
        actions={<Link to="/portal/learn" className="c-button c-button--secondary !py-2.5">Back to my learning</Link>}
      />

      <Card className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <Badge tone="accent">{done.length}/{lessons.length} lessons complete</Badge>
            {pct === 100 && <Badge tone="success">Course complete</Badge>}
          </div>
          <div className="mt-3 max-w-xl">
            <Bar pct={pct} />
          </div>
          <p className="mt-2 text-sm text-body/70">{pct}% complete — finish all lessons to unlock the full record.</p>
        </div>
        <Link to={`/portal/student/learn/${course.slug}/${lessons[0].id}`} className="c-button c-button--primary !py-2.5 shrink-0">
          {done.length ? 'Continue learning' : 'Start learning'}
          <Icon name="arrow" className="c-icon--sm" />
        </Link>
      </Card>

      <div className="grid gap-4 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <div className="flex flex-col gap-6">
            {course.modules.map((m) => {
              const moduleDone = m.lessons.filter((l) => done.includes(l.id)).length;
              return (
                <Card key={m.id}>
                  <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                    <h3 className="h4 text-heading">{m.title}</h3>
                    <Badge tone={moduleDone === m.lessons.length ? 'success' : 'muted'}>
                      {moduleDone}/{m.lessons.length} lessons
                    </Badge>
                  </div>
                  <ol className="flex flex-col divide-y divide-line/60">
                    {m.lessons.map((l) => {
                      const complete = done.includes(l.id);
                      return (
                        <li key={l.id}>
                          <Link
                            to={`/portal/student/learn/${course.slug}/${l.id}`}
                            className="group flex items-center gap-3 py-3 text-sm"
                          >
                            <span className={cn(
                              'grid size-8 shrink-0 place-items-center rounded-full',
                              complete ? 'bg-emerald-500 text-white' : 'bg-brand text-white'
                            )}>
                              <Icon name={complete ? 'check' : 'play'} className="c-icon--sm" />
                            </span>
                            <span className="flex-1 font-medium text-ink group-hover:text-accent">{l.title}</span>
                            <span className="flex items-center gap-1 text-xs text-body/70">
                              <Icon name="clock" className="c-icon--xs" />
                              {l.minutes}m
                            </span>
                          </Link>
                        </li>
                      );
                    })}
                  </ol>
                </Card>
              );
            })}

            <Card>
              <div className="mb-3 flex items-center justify-between">
                <h3 className="h4 text-heading">Course quiz</h3>
                {quiz ? <Badge tone={quiz.score / quiz.total >= 0.5 ? 'success' : 'warn'}>Best {quiz.score}/{quiz.total}</Badge> : <Badge tone="muted">Not taken</Badge>}
              </div>
              <p className="text-sm text-body">
                A {course.quiz.questions.length}-question test covering the whole course. Your best score is saved to your record.
              </p>
              <div className="mt-4">
                <Link to={`/portal/student/learn/${course.slug}/quiz`} className="c-button c-button--secondary !py-2.5">
                  {quiz ? 'Retake quiz' : 'Take quiz'}
                  <Icon name="award" className="c-icon--sm" />
                </Link>
              </div>
            </Card>

            <Card>
              <div className="mb-3 flex items-center justify-between">
                <h3 className="h4 text-heading">Assignments</h3>
                <Badge tone="muted">{course.assignments.length} open</Badge>
              </div>
              <p className="text-sm text-body">
                Submit your work for feedback. Assignments are graded by your course leader.
              </p>
              <div className="mt-4">
                <Link to={`/portal/student/learn/${course.slug}/assignments`} className="c-button c-button--secondary !py-2.5">
                  View assignments
                  <Icon name="clipboard" className="c-icon--sm" />
                </Link>
              </div>
            </Card>
          </div>
        </div>

        <div className="lg:col-span-4">
          <Card className="sticky top-8">
            <h3 className="h5 text-heading">About this course</h3>
            <p className="mt-2 text-sm leading-relaxed text-body">{course.blurb}</p>
            <ul className="mt-4 flex flex-col gap-2 text-sm">
              <li className="flex items-center gap-2 text-body">
                <Icon name="graduation-cap" className="c-icon--sm fill-accent" />
                {course.duration} of study
              </li>
              <li className="flex items-center gap-2 text-body">
                <Icon name="book-open" className="c-icon--sm fill-accent" />
                {lessons.length} lessons · {course.modules.length} modules
              </li>
              <li className="flex items-center gap-2 text-body">
                <Icon name="award" className="c-icon--sm fill-accent" />
                {course.quiz.questions.length}-question final quiz
              </li>
              <li className="flex items-center gap-2 text-body">
                <Icon name="clipboard" className="c-icon--sm fill-accent" />
                {course.assignments.length} graded assignments
              </li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}