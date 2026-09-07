import React from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import { PageHeading, Card, Badge, Bar } from '../../../components/portal/PortalKit.jsx';
import { Icon } from '../../../components/ui/Kit.jsx';
import { getLearningCourse, allLessons, getProgressFor, courseProgressPct, getQuizScore, levelLabel, branchById } from '../../../data/learning.js';
import cn from '../../../lib/cn.js';

export default function StudentLearningCourse() {
  const { slug } = useParams();
  const course = getLearningCourse(slug);
  if (!course) return <Navigate to="/portal/student/learn" replace />;

  const lessons = allLessons(course);
  const done = getProgressFor(course.slug);
  const pct = courseProgressPct(course.slug);
  const quiz = getQuizScore(course.slug);
  const branch = branchById(course.branch);

  const completedModules = course.modules.filter((m) => m.lessons.every((l) => done.includes(l.id))).length;
  const nextLesson = lessons.find((l) => !done.includes(l.id));

  return (
    <div className="flex flex-col gap-6">
      {/* Breadcrumb */}
      <Link to="/portal/student/learn" className="flex items-center gap-2 text-sm font-medium text-accent hover:underline">
        <Icon name="chevron-left" className="c-icon--sm" />
        All my courses
      </Link>

      {/* Hero card */}
      <Card className="overflow-hidden p-0">
        <div className="relative">
          <img src={course.img} alt="" className="aspect-[3/1] w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-brand/95 via-brand/40 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-6 text-white">
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone="cyan">{course.subject}</Badge>
              <Badge tone="muted">{branch.label}</Badge>
              <Badge tone="muted">{levelLabel(course)}</Badge>
              {pct === 100 && <Badge tone="success">Course complete</Badge>}
            </div>
            <h1 className="h2 mt-3 text-heading">{course.title}</h1>
            <p className="mt-1 text-sm text-navy-body">
              Taught by <strong>{course.teacher}</strong>
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone={pct === 100 ? 'success' : 'accent'}>
                {done.length}/{lessons.length} lessons complete
              </Badge>
              <Badge tone="muted">{completedModules}/{course.modules.length} modules done</Badge>
            </div>
            <div className="mt-3 max-w-xl">
              <Bar pct={pct} tone={pct === 100 ? 'success' : 'accent'} />
            </div>
            <p className="mt-2 text-sm text-body/80">
              {pct === 100
                ? 'You\'ve completed every lesson — take the quiz or revisit the assignments any time.'
                : `${pct}% complete — keep going, you're making great progress.`}
            </p>
          </div>
          {nextLesson ? (
            <Link to={`/portal/student/learn/${course.slug}/${nextLesson.id}`} className="c-button c-button--primary !py-2.5 shrink-0">
              {done.length ? 'Continue learning' : 'Start course'}
              <Icon name="arrow" className="c-icon--sm" />
            </Link>
          ) : (
            <Link to={`/portal/student/learn/${course.slug}/quiz`} className="c-button c-button--primary !py-2.5 shrink-0">
              Take the quiz
              <Icon name="award" className="c-icon--sm" />
            </Link>
          )}
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-12">
        <div className="lg:col-span-8">
          {/* About */}
          <Card className="mb-6">
            <h3 className="h4 mb-3 text-heading">About this course</h3>
            <p className="text-sm leading-relaxed text-body">{course.blurb}</p>
            <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm">
              <li className="flex items-center gap-2 text-body">
                <Icon name="clock" className="c-icon--sm fill-accent" />
                {course.duration} of study
              </li>
              <li className="flex items-center gap-2 text-body">
                <Icon name="book-open" className="c-icon--sm fill-accent" />
                {lessons.length} lessons in {course.modules.length} modules
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

          {/* Modules */}
          <div className="mb-6 flex flex-col gap-4">
            <h3 className="h4 text-heading">Course contents</h3>
            {course.modules.map((m, mIdx) => {
              const moduleDone = m.lessons.filter((l) => done.includes(l.id)).length;
              return (
                <Card key={m.id} className="p-0">
                  <div className="flex items-center justify-between border-b border-line bg-band/60 px-5 py-3">
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-accent">
                        Module {mIdx + 1}
                      </p>
                      <h4 className="font-heading text-lg text-heading">{m.title}</h4>
                    </div>
                    <Badge tone={moduleDone === m.lessons.length ? 'success' : 'muted'}>
                      {moduleDone}/{m.lessons.length} lessons
                    </Badge>
                  </div>
                  <ol className="divide-y divide-line/60">
                    {m.lessons.map((l, lIdx) => {
                      const complete = done.includes(l.id);
                      return (
                        <li key={l.id}>
                          <Link
                            to={`/portal/student/learn/${course.slug}/${l.id}`}
                            className="group flex items-center gap-3 px-5 py-3 text-sm hover:bg-band/40"
                          >
                            <span className={cn(
                              'grid size-8 shrink-0 place-items-center rounded-full text-xs font-bold',
                              complete ? 'bg-emerald-500 text-white' : 'bg-brand text-white'
                            )}>
                              {complete ? <Icon name="check" className="c-icon--sm" /> : lIdx + 1}
                            </span>
                            <span className="flex-1 font-medium text-ink group-hover:text-accent">{l.title}</span>
                            <span className="flex items-center gap-1 text-xs text-body/70">
                              <Icon name="clock" className="c-icon--xs" />
                              {l.minutes} min
                            </span>
                            <Icon name="chevron-right" className="c-icon--xs text-body/50" />
                          </Link>
                        </li>
                      );
                    })}
                  </ol>
                </Card>
              );
            })}
          </div>

          {/* Quiz card */}
          <Card className="mb-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="grid size-10 place-items-center rounded-md bg-cyan/15 text-cyan-deep">
                    <Icon name="award" className="c-icon--sm" />
                  </span>
                  <div>
                    <h3 className="h5 text-heading">End-of-course quiz</h3>
                    <p className="text-xs text-body/70">{course.quiz.questions.length} questions · best score saved</p>
                  </div>
                </div>
              </div>
              {quiz ? (
                <Badge tone={quiz.score / quiz.total >= 0.5 ? 'success' : 'warn'}>
                  Best: {quiz.score}/{quiz.total}
                </Badge>
              ) : (
                <Badge tone="muted">Not taken</Badge>
              )}
            </div>
            <p className="mt-3 text-sm text-body">
              Take the quiz once you've finished the lessons. Your best score is saved to your learner record.
            </p>
            <div className="mt-4">
              <Link to={`/portal/student/learn/${course.slug}/quiz`} className="c-button c-button--secondary !py-2.5">
                {quiz ? 'Retake quiz' : 'Take quiz'}
                <Icon name="award" className="c-icon--sm" />
              </Link>
            </div>
          </Card>

          {/* Assignments card */}
          <Card>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="grid size-10 place-items-center rounded-md bg-pill/20 text-pill-ink">
                    <Icon name="clipboard" className="c-icon--sm" />
                  </span>
                  <div>
                    <h3 className="h5 text-heading">Assignments</h3>
                    <p className="text-xs text-body/70">{course.assignments.length} pieces of work · graded by {course.teacher}</p>
                  </div>
                </div>
              </div>
              <Badge tone="muted">{course.assignments.length} open</Badge>
            </div>
            <p className="mt-3 text-sm text-body">
              Submit your work for instructor feedback. Assignments build your portfolio and contribute to your record.
            </p>
            <div className="mt-4">
              <Link to={`/portal/student/learn/${course.slug}/assignments`} className="c-button c-button--secondary !py-2.5">
                View assignments
                <Icon name="clipboard" className="c-icon--sm" />
              </Link>
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-4">
          <Card className="sticky top-8">
            <h3 className="h5 text-heading">At a glance</h3>
            <dl className="mt-4 flex flex-col divide-y divide-line">
              {[
                ['Branch', branch.label],
                ['Level', levelLabel(course)],
                ['Instructor', course.teacher],
                ['Lessons', `${lessons.length}`],
                ['Modules', `${course.modules.length}`],
                ['Quiz questions', `${course.quiz.questions.length}`],
                ['Assignments', `${course.assignments.length}`],
                ['Duration', course.duration],
              ].map(([k, v]) => (
                <div key={k} className="flex items-center justify-between gap-2 py-3 text-sm">
                  <dt className="text-body/80">{k}</dt>
                  <dd className="text-right font-semibold text-heading">{v}</dd>
                </div>
              ))}
            </dl>
          </Card>
        </div>
      </div>
    </div>
  );
}