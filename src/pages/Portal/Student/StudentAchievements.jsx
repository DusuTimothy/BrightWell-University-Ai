import React from 'react';
import { Link } from 'react-router-dom';
import { PageHeading, Card } from '../../../components/portal/PortalKit.jsx';
import { Icon } from '../../../components/ui/Kit.jsx';
import cn from '../../../lib/cn.js';

const ACHIEVEMENTS = [
  { id: 'first-lesson', icon: 'play', label: 'First lesson complete', desc: 'You finished your very first lesson.', earned: true },
  { id: 'streak-7', icon: 'trophy', label: '7-day streak', desc: 'Learn 7 days in a row.', earned: false },
  { id: 'first-quiz', icon: 'award', label: 'First quiz pass', desc: 'Score 50%+ on any quiz.', earned: true },
  { id: 'perfect', icon: 'sparkles', label: 'Perfect score', desc: 'Score 100% on a quiz.', earned: false },
  { id: 'three-courses', icon: 'book-open', label: 'Triple enrol', desc: 'Enrol in three courses at once.', earned: true },
  { id: 'submit-assignment', icon: 'file-check', label: 'First submission', desc: 'Submit your first assignment.', earned: false },
];

export default function StudentAchievements() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeading title="Achievements" subtitle="Badges and streaks — keep the momentum going." />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {ACHIEVEMENTS.map((a) => (
          <Card key={a.id} className={cn('flex items-start gap-4', !a.earned && 'opacity-60')}>
            <span className={cn(
              'grid size-12 shrink-0 place-items-center rounded-lg',
              a.earned ? 'bg-pill/20 text-pill-ink' : 'bg-band text-body/60'
            )}>
              <Icon name={a.icon} className="c-icon--md" />
            </span>
            <div className="flex-1">
              <p className="text-sm font-semibold text-heading">{a.label}</p>
              <p className="mt-0.5 text-xs text-body/80">{a.desc}</p>
              <p className="mt-2 text-[11px] font-semibold uppercase tracking-wide">
                {a.earned ? <span className="text-emerald-700">Earned</span> : <span className="text-body/60">Locked</span>}
              </p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}