import React from 'react';
import { Link, useNavigate, useParams, Navigate } from 'react-router-dom';
import { Card, Badge } from '../../../components/portal/PortalKit.jsx';
import { QuizRunner, LessonTree } from '../../../components/portal/LearningKit.jsx';
import { Icon } from '../../../components/ui/Kit.jsx';
import { getLearningCourse, getQuizScore } from '../../../data/learning.js';

export default function StudentQuiz() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const course = getLearningCourse(slug);
  if (!course) return <Navigate to="/portal/learn" replace />;
  const prev = getQuizScore(course.slug);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <Link to={`/portal/learn/${course.slug}`} className="flex items-center gap-2 text-sm font-medium text-accent hover:underline">
          <Icon name="chevron-left" className="c-icon--sm" />
          {course.title}
        </Link>
        {prev && <Badge tone={prev.score / prev.total >= 0.5 ? 'success' : 'warn'}>{prev.score}/{prev.total}</Badge>}
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <QuizRunner course={course} onReset={() => navigate(`/portal/learn/${course.slug}`)} />
        </div>
        <aside className="lg:col-span-4">
          <Card className="sticky top-8">
            <h3 className="h5 mb-3 text-heading">Course contents</h3>
            <LessonTree course={course} base="/portal/student/learn" />
          </Card>
        </aside>
      </div>
    </div>
  );
}