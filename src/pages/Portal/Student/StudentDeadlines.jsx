import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { PageHeading, Card, Badge } from '../../../components/portal/PortalKit.jsx';
import { Icon } from '../../../components/ui/Kit.jsx';
import { learningCourses, coursesByBranch, getLearningBranch } from '../../../data/learning.js';
import cn from '../../../lib/cn.js';

export default function StudentDeadlines() {
  const branch = getLearningBranch() || 'secondary';
  const enrolled = coursesByBranch(branch);
  const items = useMemo(() => {
    return enrolled.flatMap((c) =>
      c.assignments.map((a, i) => ({
        id: `${c.slug}-${a.id}`,
        course: c.title,
        title: a.title,
        kind: a.kind,
        due: `In ${i * 3 + 2} days`,
        urgent: i === 0,
        href: `/portal/student/courses/${c.slug}/assignments`,
      }))
    );
  }, [enrolled]);

  return (
    <div className="flex flex-col gap-6">
      <PageHeading
        title="Upcoming deadlines"
        subtitle="The next 14 days — sorted by what's due soonest."
        actions={
          <Link to="/portal/student/courses" className="c-button c-button--secondary !py-2.5">
            My courses
          </Link>
        }
      />
      <Card>
        <ul className="divide-y divide-line">
          {items.map((it) => (
            <li key={it.id}>
              <Link to={it.href} className="group flex items-center gap-3 py-3">
                <span className={cn('grid size-10 shrink-0 place-items-center rounded-lg', it.urgent ? 'bg-red-50 text-red-700' : 'bg-band text-accent')}>
                  <Icon name="clock-alert" className="c-icon--sm" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-heading">{it.title}</p>
                  <p className="text-xs text-body/70">{it.course} · {it.kind}</p>
                </div>
                <Badge tone={it.urgent ? 'warn' : 'muted'}>{it.due}</Badge>
                <Icon name="chevron-right" className="c-icon--xs text-body/40" />
              </Link>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}