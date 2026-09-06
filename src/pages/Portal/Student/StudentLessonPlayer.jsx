import React, { useState } from 'react';
import { Link, useNavigate, useParams, Navigate } from 'react-router-dom';
import { PageHeading, Card, Badge } from '../../../components/portal/PortalKit.jsx';
import { LessonPlayer, LessonTree } from '../../../components/portal/LearningKit.jsx';
import { Icon } from '../../../components/ui/Kit.jsx';
import { getLearningCourse, allLessons, getProgressFor, toggleLessonCompleted } from '../../../data/learning.js';
import cn from '../../../lib/cn.js';

export default function StudentLessonPlayer() {
  const { slug, lessonId } = useParams();
  const navigate = useNavigate();
  const course = getLearningCourse(slug);
  const [done, setDone] = useState(getProgressFor(slug));
  if (!course) return <Navigate to="/portal/learn" replace />;

  const lessons = allLessons(course);
  const lesson = lessons.find((l) => l.id === lessonId);
  if (!lesson) return <Navigate to={`/portal/learn/${slug}`} replace />;

  const idx = lessons.findIndex((l) => l.id === lessonId);
  const next = lessons[idx + 1] ?? null;
  const completed = done.includes(lesson.id);

  function toggle() {
    setDone(toggleLessonCompleted(course.slug, lesson.id));
  }

  function goNext() {
    if (next) navigate(`/portal/learn/${course.slug}/${next.id}`);
    else navigate(`/portal/learn/${course.slug}`);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <Link to={`/portal/learn/${course.slug}`} className="flex items-center gap-2 text-sm font-medium text-accent hover:underline">
          <Icon name="chevron-left" className="c-icon--sm" />
          {course.title}
        </Link>
        <Badge tone="cyan">{course.subject} · {lesson.minutes} min</Badge>
      </div>

      <PageHeading title={lesson.title} subtitle="Watch the lesson, review the notes, then mark it complete." />

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
              <Icon name="check-circle" className={cn('c-icon--sm', completed ? 'fill-emerald-500' : 'fill-line')} />
              {completed ? 'Lesson marked complete — recorded in your progress.' : 'Not yet complete.'}
            </div>
            {idx > 0 && (
              <button
                type="button"
                onClick={() => navigate(`/portal/learn/${course.slug}/${lessons[idx - 1].id}`)}
                className="c-button c-button--secondary !py-2.5"
              >
                <Icon name="chevron-left" className="c-icon--sm" />
                Previous lesson
              </button>
            )}
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