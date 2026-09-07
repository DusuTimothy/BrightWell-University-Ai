import React, { useState } from 'react';
import { Link, useNavigate, useParams, Navigate } from 'react-router-dom';
import { Card, Bar } from '../../../components/portal/PortalKit.jsx';
import { LessonPlayer, LessonTree } from '../../../components/portal/LearningKit.jsx';
import { Icon } from '../../../components/ui/Kit.jsx';
import { getLearningCourse, allLessons, getProgressFor, toggleLessonCompleted, courseProgressPct } from '../../../data/learning.js';
import cn from '../../../lib/cn.js';

export default function StudentLessonPlayer() {
  const { slug, lessonId } = useParams();
  const navigate = useNavigate();
  const course = getLearningCourse(slug);
  const [done, setDone] = useState(getProgressFor(slug));
  if (!course) return <Navigate to="/portal/student/learn" replace />;

  const lessons = allLessons(course);
  const lesson = lessons.find((l) => l.id === lessonId);
  if (!lesson) return <Navigate to={`/portal/student/learn/${slug}`} replace />;

  const idx = lessons.findIndex((l) => l.id === lessonId);
  const next = lessons[idx + 1] ?? null;
  const prev = lessons[idx - 1] ?? null;
  const completed = done.includes(lesson.id);
  const totalDone = done.length;
  const pct = courseProgressPct(slug);

  function toggle() {
    setDone(toggleLessonCompleted(course.slug, lesson.id));
  }

  function goNext() {
    if (next) navigate(`/portal/student/learn/${course.slug}/${next.id}`);
    else navigate(`/portal/student/learn/${course.slug}`);
  }

  function goPrev() {
    if (prev) navigate(`/portal/student/learn/${course.slug}/${prev.id}`);
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Top breadcrumb */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link to={`/portal/student/learn/${course.slug}`} className="flex items-center gap-2 text-sm font-medium text-accent hover:underline">
          <Icon name="chevron-left" className="c-icon--sm" />
          {course.title}
        </Link>
        <div className="flex items-center gap-2 text-xs text-body/80">
          <span>Lesson {idx + 1} of {lessons.length}</span>
          <span className="size-1 rounded-full bg-body/40" />
          <span>{totalDone}/{lessons.length} complete</span>
        </div>
      </div>

      {/* Progress bar */}
      <Card className="p-4">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-semibold text-heading">Course progress</p>
          <p className="text-sm font-semibold text-heading">{pct}%</p>
        </div>
        <div className="mt-2">
          <Bar pct={pct} />
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <LessonPlayer
            lesson={lesson}
            completed={completed}
            onToggle={toggle}
            onNext={goNext}
            isLast={idx === lessons.length - 1}
          />

          <Card className="mt-4 flex flex-wrap items-center justify-between gap-3 sm:mt-6">
            <div className="flex items-center gap-2 text-sm text-body">
              <Icon
                name="check-circle"
                className={cn('c-icon--sm', completed ? 'fill-emerald-500' : 'fill-line')}
              />
              {completed
                ? 'Lesson marked complete — saved to your progress.'
                : 'Mark this lesson complete to update your progress.'}
            </div>
            <div className="flex gap-2">
              {prev && (
                <button
                  type="button"
                  onClick={goPrev}
                  className="c-button c-button--secondary !py-2.5"
                >
                  <Icon name="chevron-left" className="c-icon--sm" />
                  Previous
                </button>
              )}
              {next && (
                <button
                  type="button"
                  onClick={() => navigate(`/portal/student/learn/${course.slug}/${next.id}`)}
                  className="c-button c-button--primary !py-2.5"
                >
                  Next lesson
                  <Icon name="chevron-right" className="c-icon--sm" />
                </button>
              )}
            </div>
          </Card>
        </div>

        <aside className="lg:col-span-4">
          <Card className="sticky top-8">
            <h3 className="h5 mb-3 text-heading">Course contents</h3>
            <LessonTree course={course} currentLessonId={lesson.id} base="/portal/student/learn" />
          </Card>
        </aside>
      </div>
    </div>
  );
}