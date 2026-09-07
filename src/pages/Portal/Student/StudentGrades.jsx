import React from 'react';
import { Link } from 'react-router-dom';
import { PageHeading, Card, Stat } from '../../../components/portal/PortalKit.jsx';
import { Icon } from '../../../components/ui/Kit.jsx';
import { listAttemptsByUser } from '../../../data/quizzes.js';
import { coursesByBranch, getLearningBranch, courseProgressPct } from '../../../data/learning.js';

export default function StudentGrades() {
  const branch = getLearningBranch() || 'secondary';
  const enrolled = coursesByBranch(branch);
  const attempts = listAttemptsByUser();

  return (
    <div className="flex flex-col gap-6">
      <PageHeading title="My grades" subtitle="Progress and best quiz scores across your courses." />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="Enrolled courses" value={enrolled.length} icon={<Icon name="book-open" className="c-icon--sm" />} />
        <Stat label="Average progress" value={`${Math.round(enrolled.reduce((a, c) => a + courseProgressPct(c.slug), 0) / (enrolled.length || 1))}%`} icon={<Icon name="target" className="c-icon--sm" />} />
        <Stat label="Quizzes taken" value={attempts.length} icon={<Icon name="award" className="c-icon--sm" />} />
        <Stat label="Best score" value={`${Math.round(Math.max(0, ...attempts.map((a) => a.maxScore ? (a.totalScore / a.maxScore) * 100 : 0)))}%`} icon={<Icon name="trophy" className="c-icon--sm" />} />
      </div>

      <Card>
        <h3 className="h4 mb-3 text-heading">Per-course progress</h3>
        <ul className="divide-y divide-line">
          {enrolled.map((c) => {
            const pct = courseProgressPct(c.slug);
            return (
              <li key={c.slug} className="flex items-center gap-4 py-3">
                <img src={c.img} alt="" className="h-10 w-14 shrink-0 rounded object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-heading">{c.title}</p>
                  <p className="text-xs text-body/70">{c.subject}</p>
                </div>
                <div className="hidden w-40 sm:block">
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-line">
                    <div className="h-full rounded-full bg-accent" style={{ width: `${pct}%` }} />
                  </div>
                </div>
                <span className="w-12 text-right text-sm font-semibold text-heading">{pct}%</span>
                <Link to={`/portal/student/courses/${c.slug}`} className="text-sm font-semibold text-accent hover:underline">
                  Open →
                </Link>
              </li>
            );
          })}
        </ul>
      </Card>
    </div>
  );
}