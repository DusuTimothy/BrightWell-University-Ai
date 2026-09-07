import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { PageHeading, Card, Stat, Badge, Bar } from '../../../components/portal/PortalKit.jsx';
import { CourseRow, ProgressPct, LevelBadge, BranchBadge } from '../../../components/portal/LearningKit.jsx';
import { Icon } from '../../../components/ui/Kit.jsx';
import {
  learningCourses, courseProgressPct, getQuizScore, allLessons, BRANCHES,
  coursesByBranch, getLearningBranch, levelLabel,
} from '../../../data/learning.js';
import { getPortalUser } from '../../../lib/portalAuth.js';
import cn from '../../../lib/cn.js';

export default function StudentDashboard() {
  const user = getPortalUser();
  const branch = getLearningBranch() || 'secondary';
  const enrolled = coursesByBranch(branch);
  const branchLabel = BRANCHES.find((b) => b.id === branch)?.label;

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

  const inProgress = enrolled.filter((c) => {
    const pct = courseProgressPct(c.slug);
    return pct > 0 && pct < 100;
  });
  const continueLearning = inProgress[0] || enrolled[0] || null;

  return (
    <div className="flex flex-col gap-6">
      <PageHeading
        title={`Welcome back, ${user.name.split(' ')[0]}`}
        subtitle="Pick up where you left off, or browse the catalogue to start something new."
        actions={
          <Link to="/courses" className="c-button c-button--secondary !py-2.5">
            Browse courses
            <Icon name="arrow" className="c-icon--sm" />
          </Link>
        }
      />

      {/* Stats row */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="Courses enrolled" value={stats.total} sub={branchLabel} icon={<Icon name="book-open" className="c-icon--sm" />} />
        <Stat label="Average progress" value={`${stats.avgProgress}%`} sub="Across your courses" icon={<Icon name="target" className="c-icon--sm" />} />
        <Stat label="Lessons completed" value={stats.lessonsDone} sub={`of ${stats.totalLessons} lessons`} icon={<Icon name="check-circle" className="c-icon--sm" />} />
        <Stat label="Quizzes taken" value={stats.quizzesTaken} sub={`of ${stats.total} courses`} icon={<Icon name="award" className="c-icon--sm" />} />
      </div>

      {/* Continue learning */}
      {continueLearning && (
        <Card className="overflow-hidden p-0">
          <div className="grid items-stretch gap-0 md:grid-cols-[18rem_1fr]">
            <div className="relative">
              <img src={continueLearning.img} alt="" className="aspect-video h-full w-full object-cover" />
              <span className="absolute left-3 top-3 rounded-md bg-brand px-2 py-1 text-[11px] font-semibold text-cyan">
                Continue learning
              </span>
            </div>
            <div className="flex flex-col justify-between gap-4 p-5">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge tone="cyan">{continueLearning.subject}</Badge>
                  <LevelBadge course={continueLearning} />
                  <BranchBadge branch={continueLearning.branch} />
                </div>
                <h3 className="h3 mt-2 text-heading">{continueLearning.title}</h3>
                <p className="mt-1 text-sm text-body">{continueLearning.blurb}</p>
              </div>
              <div>
                <ProgressPct pct={courseProgressPct(continueLearning.slug)} />
                <div className="mt-4 flex flex-wrap gap-2">
                  <Link to={`/portal/student/learn/${continueLearning.slug}`} className="c-button c-button--primary !py-2.5">
                    {courseProgressPct(continueLearning.slug) > 0 ? 'Resume course' : 'Start course'}
                    <Icon name="arrow" className="c-icon--sm" />
                  </Link>
                  <Link to="/portal/student/learn" className="c-button c-button--secondary !py-2.5">
                    All my courses
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* In progress */}
      <div>
        <h3 className="h4 mb-3 text-heading">In progress</h3>
        {inProgress.length === 0 ? (
          <Card>
            <p className="text-sm text-body">
              You haven't started any courses yet. Browse the catalogue and enrol in your first course to begin.
            </p>
            <div className="mt-3">
              <Link to="/courses" className="text-sm font-semibold text-accent hover:underline">
                Browse the catalogue →
              </Link>
            </div>
          </Card>
        ) : (
          <div className="flex flex-col gap-3">
            {inProgress.slice(0, 4).map((c) => (
              <CourseRow key={c.slug} course={c} compact />
            ))}
          </div>
        )}
      </div>

      {/* Available quizzes */}
      <Card className="p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="flex items-center gap-2 text-sm font-semibold text-heading">
              <Icon name="check-square" className="c-icon--sm fill-accent" />
              Quiz history
            </p>
            <p className="mt-1 text-sm text-body">
              Review past attempts, see integrity flags and retake quizzes when allowed.
            </p>
          </div>
          <Link to="/portal/student/quizzes" className="c-button c-button--secondary !py-2.5">
            View history
            <Icon name="arrow" className="c-icon--sm" />
          </Link>
        </div>
      </Card>

      {/* Branch switcher */}
      <Card className="p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="flex items-center gap-2 text-sm font-semibold text-heading">
              <Icon name="school" className="c-icon--sm fill-accent" />
              Currently viewing
            </p>
            <p className="mt-1 text-sm text-body">
              You're enrolled in the <strong className="text-heading">{branchLabel}</strong> branch. Switch to see other branches.
            </p>
          </div>
          <Link to="/portal/student/learn" className="text-sm font-semibold text-accent hover:underline">
            Change branch →
          </Link>
        </div>
      </Card>
    </div>
  );
}