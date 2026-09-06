import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import cn from '../../lib/cn.js';
import { Badge, Card, Bar } from './PortalKit.jsx';
import { Icon } from '../ui/Kit.jsx';
import { allLessons, getProgressFor, saveQuizScore, getQuizScore, levelLabel } from '../../data/learning.js';

/* ---------- course progress ---------- */

export function ProgressPct({ pct, tone = 'accent' }) {
  return (
    <div className="flex items-center gap-3">
      <Bar pct={pct} tone={tone} />
      <span className="w-12 shrink-0 text-right text-sm font-semibold tabular-nums text-heading">{pct}%</span>
    </div>
  );
}

export function LevelBadge({ course }) {
  return (
    <span className={cn(
      'rounded px-2 py-0.5 text-[11px] font-semibold',
      course.branch === 'university' ? 'bg-cyan/15 text-cyan-800' : 'bg-band text-ink'
    )}>
      {levelLabel(course)}
    </span>
  );
}

export function BranchBadge({ branch }) {
  return (
    <span className="inline-flex items-center gap-1 rounded bg-brand px-2 py-0.5 text-[11px] font-semibold text-cyan">
      <Icon name="graduation-cap" className="c-icon--xs" />
      {branch === 'university' ? 'University' : 'Secondary School'}
    </span>
  );
}

export function CourseRow({ course, studentId = null, compact = false }) {
  const lessons = allLessons(course);
  const done = getProgressFor(course.slug).length;
  const pct = Math.round((done / lessons.length) * 100);
  return (
    <Card className={cn('group', compact ? 'p-4' : '')}>
      <div className="flex gap-4">
        <Link to={`/portal/learn/${course.slug}`} className="block shrink-0 overflow-hidden rounded-md">
          <img src={course.img} alt="" className="h-20 w-28 object-cover transition-transform duration-300 group-hover:scale-105" />
        </Link>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone="cyan">{course.subject}</Badge>
            <LevelBadge course={course} />
          </div>
          <h3 className="h5 mt-1 text-heading">
            <Link to={`/portal/learn/${course.slug}`} className="hover:underline">{course.title}</Link>
          </h3>
          <p className="mt-0.5 text-xs text-body/70">
            {done}/{lessons.length} lessons complete · {course.teacher}
          </p>
        </div>
      </div>
      <div className="mt-3">
        <ProgressPct pct={pct} />
      </div>
    </Card>
  );
}

/* ---------- lesson content & completion ---------- */

export function LessonPlayer({ lesson, onNext, onToggle, completed, isLast = false }) {
  return (
    <Card className="flex flex-col gap-5">
      <div>
        <p className="flex items-center gap-2 text-sm text-body">
          <Icon name="play" className="c-icon--sm fill-accent" />
          {lesson.minutes} min lesson
        </p>
        <h2 className="h3 mt-1 text-heading">{lesson.title}</h2>
      </div>

      <div className="overflow-hidden rounded-lg bg-black">
        <iframe
          src={lesson.video}
          title={lesson.title}
          className="aspect-video w-full"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>

      <div className="rounded-lg bg-band/60 p-4 leading-relaxed text-ink">
        <p>{lesson.body}</p>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4">
        <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-heading">
          <input
            type="checkbox"
            checked={completed}
            onChange={onToggle}
            className="size-4 accent-[#1d42a6]"
          />
          Mark as complete
        </label>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onNext}
            className="c-button c-button--secondary !py-2.5"
          >
            {isLast ? 'Finish course' : 'Next lesson'}
            {!isLast && <Icon name="chevron-right" className="c-icon--sm" />}
          </button>
        </div>
      </div>
    </Card>
  );
}

/* ---------- quiz ---------- */

export function QuizRunner({ course, onReset }) {
  const quiz = course.quiz;
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const q = quiz.questions[current];
  const answered = answers[current] != null;
  const allAnswered = quiz.questions.every((_, i) => answers[i] != null);

  function choose(i) {
    setAnswers((a) => ({ ...a, [current]: i }));
  }

  function submit() {
    const score = quiz.questions.filter((qq, i) => answers[i] === qq.answer).length;
    saveQuizScore(course.slug, score, quiz.questions.length);
    setSubmitted(true);
  }

  if (submitted) {
    const prev = getQuizScore(course.slug);
    return (
      <Card className="text-center">
        <Icon name="check-circle" className="c-icon--md mx-auto fill-emerald-600" />
        <h3 className="h3 mt-4 text-heading">Quiz submitted</h3>
        <p className="mt-2 text-body">
          You scored <strong className="text-accent">{prev.score} / {prev.total}</strong>
        </p>
        <p className="mt-1 text-sm text-body/70">Your best result is saved to your course progress.</p>
        <div className="mt-5 flex justify-center gap-2">
          <button type="button" onClick={() => { setAnswers({}); setCurrent(0); setSubmitted(false); }} className="c-button c-button--secondary !py-2.5">Try again</button>
          <button type="button" onClick={onReset} className="c-button c-button--secondary !py-2.5">Close quiz</button>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <div className="mb-5 flex items-center justify-between">
        <h3 className="h5 text-heading">{quiz.title}</h3>
        <Badge tone="accent">{current + 1} / {quiz.questions.length}</Badge>
      </div>

      <Bar pct={((current + (answered ? 1 : 0)) / quiz.questions.length) * 100} />

      <div className="mt-6">
        <p className="text-lg font-medium text-heading">{q.q}</p>
        <ul className="mt-4 flex flex-col gap-2">
          {q.options.map((opt, i) => (
            <li key={i}>
              <button
                type="button"
                onClick={() => choose(i)}
                className={cn(
                  'flex w-full items-center gap-3 rounded-lg border px-4 py-3 text-left text-sm transition-colors',
                  answers[current] === i
                    ? 'border-accent bg-accent/10 font-semibold text-accent'
                    : 'border-line bg-paper hover:bg-band/50'
                )}
              >
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand text-xs font-bold text-white">
                  {String.fromCharCode(65 + i)}
                </span>
                {opt}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          disabled={current === 0}
          onClick={() => setCurrent((c) => c - 1)}
          className="c-button c-button--secondary !py-2.5 disabled:opacity-40"
        >
          <Icon name="chevron-left" className="c-icon--sm" />
          Previous
        </button>
        {current < quiz.questions.length - 1 ? (
          <button
            type="button"
            disabled={!answered}
            onClick={() => setCurrent((c) => c + 1)}
            className="c-button c-button--primary !py-2.5 disabled:opacity-40"
          >
            Next
          </button>
        ) : (
          <button
            type="button"
            disabled={!allAnswered}
            onClick={submit}
            className="c-button c-button--primary !py-2.5 disabled:opacity-40"
          >
            Submit quiz
          </button>
        )}
      </div>
    </Card>
  );
}

/* ---------- assignments ---------- */

export function AssignmentCard({ course, assignment, studentId }) {
  return (
    <Card className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <Badge tone="warn">{assignment.kind}</Badge>
        <Badge tone="muted">{assignment.points} pts</Badge>
      </div>
      <h4 className="h5 text-heading">{assignment.title}</h4>
      <p className="text-sm leading-relaxed text-body">{assignment.prompt}</p>
    </Card>
  );
}

/* ---------- lesson tree nav (used on course page) ---------- */

export function LessonTree({ course, currentLessonId, base = '/portal/learn', actions = {} }) {
  const done = getProgressFor(course.slug);
  return (
    <div className="flex flex-col gap-1">
      {course.modules.map((m) => (
        <div key={m.id} className="mb-1">
          <p className="px-2 py-1.5 text-xs font-semibold uppercase tracking-wide text-body/70">{m.title}</p>
          {m.lessons.map((l) => {
            const active = l.id === currentLessonId;
            const complete = done.includes(l.id);
            return (
              <div key={l.id}>
                {active && actions.render?.(l) ? (
                  actions.render(l)
                ) : (
                  <Link
                    to={`${base}/${course.slug}/${l.id}`}
                    className={cn(
                      'group flex items-center gap-2 rounded-md px-2 py-2 text-sm transition-colors',
                      active ? 'bg-accent text-white' : 'text-body hover:bg-band hover:text-heading'
                    )}
                  >
                    <Icon
                      name={complete ? 'check-circle' : 'play'}
                      className={cn('c-icon--sm shrink-0', complete ? 'fill-emerald-500' : active ? 'fill-white' : 'fill-accent/60')}
                    />
                    <span className={cn('flex-1 truncate', active && 'font-medium')}>{l.title}</span>
                    <span className={cn('text-[10px] tabular-nums', active ? 'text-white/70' : 'text-body/50')}>{l.minutes}m</span>
                  </Link>
                )}
              </div>
            );
          })}
        </div>
      ))}

      <div className="mt-1 border-t border-line pt-2">
        <Link
          to={`${base}/${course.slug}/quiz`}
          className="group flex items-center gap-2 rounded-md px-2 py-2 text-sm text-body transition-colors hover:bg-band hover:text-heading"
        >
          <Icon name="award" className="c-icon--sm shrink-0 fill-accent/60" />
          Course quiz
        </Link>
        <Link
          to={`${base}/${course.slug}/assignments`}
          className="group flex items-center gap-2 rounded-md px-2 py-2 text-sm text-body transition-colors hover:bg-band hover:text-heading"
        >
          <Icon name="clipboard" className="c-icon--sm shrink-0 fill-accent/60" />
          Assignments
        </Link>
      </div>
    </div>
  );
}
