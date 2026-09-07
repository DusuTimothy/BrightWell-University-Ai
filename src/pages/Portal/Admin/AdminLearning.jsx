import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { PageHeading, Card, Badge, SearchInput } from '../../../components/portal/PortalKit.jsx';
import { Icon } from '../../../components/ui/Kit.jsx';
import { learningCourses, allLessons, courseProgressPct, levelLabel, branchById, BRANCHES } from '../../../data/learning.js';

export default function AdminLearning() {
  const [q, setQ] = useState('');
  const [branch, setBranch] = useState('all');

  const filtered = useMemo(() => {
    return learningCourses.filter((c) => {
      if (branch !== 'all' && c.branch !== branch) return false;
      if (q && !`${c.title} ${c.subject} ${c.teacher}`.toLowerCase().includes(q.toLowerCase())) return false;
      return true;
    });
  }, [q, branch]);

  return (
    <div className="flex flex-col gap-6">
      <PageHeading
        title="Course catalogue"
        subtitle="Every course live on the Brightwell Academy platform"
        actions={
          <Link to="/courses" className="c-button c-button--secondary !py-2.5">
            View public catalogue
            <Icon name="arrow" className="c-icon--sm" />
          </Link>
        }
      />

      <Card className="p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex-1">
            <SearchInput value={q} onChange={setQ} placeholder="Search by title, subject or instructor…" />
          </div>
          <div className="flex flex-wrap gap-1 rounded-lg bg-off-white-50 p-1">
            {['all', ...BRANCHES.map((b) => b.id)].map((id) => (
              <button
                key={id}
                type="button"
                onClick={() => setBranch(id)}
                className={
                  'rounded-md px-3 py-1.5 text-sm font-semibold capitalize transition-colors ' +
                  (branch === id ? 'bg-accent text-white' : 'text-body hover:text-heading')
                }
              >
                {id === 'all' ? 'All branches' : BRANCHES.find((b) => b.id === id)?.label}
              </button>
            ))}
          </div>
        </div>
      </Card>

      <div className="flex flex-col gap-3">
        {filtered.length === 0 ? (
          <Card>
            <p className="text-sm text-body">No courses match your search.</p>
          </Card>
        ) : (
          filtered.map((c, i) => {
            const lessons = allLessons(c);
            const pct = courseProgressPct(c.slug);
            return (
              <Card key={c.slug}>
                <div className="flex flex-wrap items-center gap-4">
                  <span className="w-8 shrink-0 font-semibold text-accent">{String(i + 1).padStart(2, '0')}</span>
                  <img src={c.img} alt="" className="h-12 w-16 shrink-0 rounded object-cover" />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge tone="cyan">{c.subject}</Badge>
                      <Badge tone="muted">{levelLabel(c)}</Badge>
                      <Badge tone="warn">{branchById(c.branch)?.label}</Badge>
                    </div>
                    <Link
                      to={`/portal/admin/learn/${c.slug}`}
                      className="mt-1 block text-sm font-semibold text-heading hover:text-accent"
                    >
                      {c.title}
                    </Link>
                    <p className="text-xs text-body/70">{c.teacher}</p>
                  </div>
                  <div className="hidden gap-6 text-xs text-body/80 md:flex">
                    <span><strong className="text-heading">{lessons.length}</strong> lessons</span>
                    <span><strong className="text-heading">{c.modules.length}</strong> modules</span>
                    <span><strong className="text-heading">{c.assignments.length}</strong> assignments</span>
                  </div>
                  <div className="hidden w-32 sm:block">
                    <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
                      <div className="h-full rounded-full bg-accent" style={{ width: `${pct}%` }} />
                    </div>
                    <p className="mt-1 text-right text-xs font-semibold text-heading">{pct}%</p>
                  </div>
                  <Link
                    to={`/portal/admin/learn/${c.slug}`}
                    className="text-sm font-semibold text-accent hover:underline"
                  >
                    Manage →
                  </Link>
                </div>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}