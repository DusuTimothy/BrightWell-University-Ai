import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { getPortalUser } from '../../../lib/portalAuth.js';
import { PageHeading, Card, Stat, Badge } from '../../../components/portal/PortalKit.jsx';
import { CourseRow, ProgressPct, LevelBadge, BranchBadge } from '../../../components/portal/LearningKit.jsx';
import { Icon } from '../../../components/ui/Kit.jsx';
import {
  learningCourses, getLearningCourse, getQuizScore, courseProgressPct,
  BRANCHES, coursesByBranch, getLearningBranch, setLearningBranch,
} from '../../../data/learning.js';
import cn from '../../../lib/cn.js';

export default function StudentLearning() {
  const user = getPortalUser();
  const [branch, setBranch] = useState(() => getLearningBranch() || 'secondary');

  const chooseBranch = (id) => { setLearningBranch(id); setBranch(id); };
  const enrolled = coursesByBranch(branch).map((c) => getLearningCourse(c.slug)).filter(Boolean);

  const avgProgress = Math.round(enrolled.reduce((a, c) => a + courseProgressPct(c.slug), 0) / (enrolled.length || 1));
  const completed = enrolled.filter((c) => courseProgressPct(c.slug) === 100).length;
  const quizzesTaken = enrolled.filter((c) => getQuizScore(c.slug)).length;
  const activeBranch = BRANCHES.find((b) => b.id === branch);

  return (
    <div className="flex flex-col gap-6">
      <PageHeading
        title="My learning"
        subtitle={`${user.name} · choose the school branch you belong to, then learn at your own pace`}
        actions={<Link to="/learn" className="c-button c-button--secondary !py-2.5">Browse all courses</Link>}
      />

      <Card className="p-4">
        <p className="mb-3 flex items-center gap-2 text-sm font-semibold text-heading">
          <Icon name="school" className="c-icon--sm" />
          I study at the…
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
                'flex h-10 w-10 shrink-0 items-center justify-center rounded-full',
                branch === b.id ? 'bg-brand text-cyan' : 'bg-band text-body'
              )}>
                <Icon name={b.id === 'university' ? 'graduation-cap' : 'school'} className="c-icon--sm" />
              </span>
              <span>
                <span className="block text-sm font-semibold text-heading">{b.label}</span>
                <span className="block text-xs text-body/70">{b.tagline} · {coursesByBranch(b.id).length} courses</span>
              </span>
              {branch === b.id && <Icon name="check-circle" className="c-icon--md ml-auto fill-emerald-600" />}
            </button>
          ))}
        </div>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="Enrolled courses" value={enrolled.length} sub={activeBranch.label} icon={<Icon name="book-open" className="c-icon--sm" />} />
        <Stat label="Average progress" value={`${avgProgress}%`} sub="Across your courses" icon={<Icon name="target" className="c-icon--sm" />} />
        <Stat label="Courses completed" value={completed} sub={completed === enrolled.length ? 'Excellent work!' : 'Keep going'} icon={<Icon name="check-circle" className="c-icon--sm" />} />
        <Stat label="Quizzes taken" value={quizzesTaken} sub={`of ${enrolled.length} courses`} icon={<Icon name="award" className="c-icon--sm" />} />
      </div>

      <div className="flex flex-col gap-4">
        {enrolled.map((c) => (
          <CourseRow key={c.slug} course={c} compact />
        ))}
      </div>

      <Card className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <h3 className="h4 text-heading">Need a study plan?</h3>
          <p className="mt-1 max-w-2xl text-sm text-body">
            We recommend completing one module per week. Once you finish the lessons, the end-of-course quiz counts
            towards your record, and assignments build your portfolio.
          </p>
        </div>
        <Link to="/learn" className="text-sm font-semibold text-accent hover:underline">Browse the full catalogue →</Link>
      </Card>
    </div>
  );
}