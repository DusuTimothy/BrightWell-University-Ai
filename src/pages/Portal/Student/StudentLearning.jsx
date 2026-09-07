import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { getPortalUser } from '../../../lib/portalAuth.js';
import { PageHeading, Card, Stat, Badge, EmptyState } from '../../../components/portal/PortalKit.jsx';
import { CourseRow, ProgressPct, LevelBadge, BranchBadge } from '../../../components/portal/LearningKit.jsx';
import { Icon } from '../../../components/ui/Kit.jsx';
import {
  learningCourses, getLearningCourse, getQuizScore, courseProgressPct,
  BRANCHES, coursesByBranch, getLearningBranch, setLearningBranch, allLessons,
} from '../../../data/learning.js';
import cn from '../../../lib/cn.js';

export default function StudentLearning() {
  const user = getPortalUser();
  const [branch, setBranch] = useState(() => getLearningBranch() || 'secondary');

  const chooseBranch = (id) => { setLearningBranch(id); setBranch(id); };
  const enrolled = coursesByBranch(branch);

  const stats = useMemo(() => {
    const total = enrolled.length;
    const completed = enrolled.filter((c) => courseProgressPct(c.slug) === 100).length;
    const avgProgress = total ? Math.round(enrolled.reduce((a, c) => a + courseProgressPct(c.slug), 0) / total) : 0;
    const quizzesTaken = enrolled.filter((c) => getQuizScore(c.slug)).length;
    const totalLessons = enrolled.reduce((a, c) => a + allLessons(c).length, 0);
    const lessonsDone = enrolled.reduce((a, c) => {
      const lessons = allLessons(c);
      const pct = courseProgressPct(c.slug);
      return a + Math.round((pct / 100) * lessons.length);
    }, 0);
    return { total, completed, avgProgress, quizzesTaken, totalLessons, lessonsDone };
  }, [enrolled]);

  const activeBranch = BRANCHES.find((b) => b.id === branch);

  return (
    <div className="flex flex-col gap-6">
      <PageHeading
        title="My courses"
        subtitle={`${user.name} · choose the school branch you belong to, then learn at your own pace`}
        actions={
          <Link to="/courses" className="c-button c-button--secondary !py-2.5">
            Browse catalogue
            <Icon name="arrow" className="c-icon--sm" />
          </Link>
        }
      />

      {/* Branch selector */}
      <Card className="p-5">
        <p className="mb-4 flex items-center gap-2 text-sm font-semibold text-heading">
          <Icon name="school" className="c-icon--sm fill-accent" />
          Which branch are you enrolled in?
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          {BRANCHES.map((b) => (
            <button
              key={b.id}
              type="button"
              onClick={() => chooseBranch(b.id)}
              className={cn(
                'flex items-center gap-3 rounded-lg border-2 p-4 text-left transition-colors',
                branch === b.id ? 'border-accent bg-accent/10' : 'border-line bg-paper hover:border-accent/60'
              )}
            >
              <span className={cn(
                'flex h-11 w-11 shrink-0 items-center justify-center rounded-full',
                branch === b.id ? 'bg-brand text-cyan' : 'bg-band text-body'
              )}>
                <Icon name={b.id === 'university' ? 'graduation-cap' : 'book-open'} className="c-icon--sm" />
              </span>
              <span className="flex-1">
                <span className="block text-sm font-semibold text-heading">{b.label}</span>
                <span className="block text-xs text-body/70">{b.tagline}</span>
                <span className="mt-1 block text-[11px] font-semibold text-accent">{coursesByBranch(b.id).length} courses</span>
              </span>
              {branch === b.id && (
                <Icon name="check-circle" className="c-icon--md fill-emerald-600" />
              )}
            </button>
          ))}
        </div>
      </Card>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="Enrolled courses" value={stats.total} sub={activeBranch.label} icon={<Icon name="book-open" className="c-icon--sm" />} />
        <Stat label="Average progress" value={`${stats.avgProgress}%`} sub="Across your courses" icon={<Icon name="target" className="c-icon--sm" />} />
        <Stat label="Lessons completed" value={stats.lessonsDone} sub={`of ${stats.totalLessons} lessons`} icon={<Icon name="check-circle" className="c-icon--sm" />} />
        <Stat label="Quizzes taken" value={stats.quizzesTaken} sub={`of ${stats.total} courses`} icon={<Icon name="award" className="c-icon--sm" />} />
      </div>

      {/* Course list */}
      {enrolled.length === 0 ? (
        <EmptyState
          title="No courses in this branch yet"
          copy="Browse the catalogue and enrol in your first course. Your progress will appear here."
        />
      ) : (
        <div className="flex flex-col gap-3">
          {enrolled.map((c) => (
            <CourseRow key={c.slug} course={c} compact />
          ))}
        </div>
      )}
    </div>
  );
}