import React, { useMemo, useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, Badge } from '../../../components/portal/PortalKit.jsx';
import { Icon } from '../../../components/ui/Kit.jsx';
import { learningCourses, courseDuration, levelLabel, BRANCHES } from '../../../data/learning.js';
import { getPortalUser } from '../../../lib/portalAuth.js';
import { setLearningBranch, getLearningBranch } from '../../../data/learning.js';
import cn from '../../../lib/cn.js';

export default function StudentBrowse() {
  const { id: branchParam } = useParams();
  const user = getPortalUser();
  const [branch, setBranch] = useState(() => branchParam || getLearningBranch() || 'all');
  const [level, setLevel] = useState('all');
  const [q, setQ] = useState('');

  useEffect(() => {
    if (branchParam) setBranch(branchParam);
  }, [branchParam]);

  useEffect(() => {
    if (branch !== 'all') setLearningBranch(branch);
  }, [branch]);

  const filtered = useMemo(() => {
    let list = learningCourses;
    if (branch !== 'all') list = list.filter((c) => c.branch === branch);
    if (level !== 'all') list = list.filter((c) => c.level === level);
    if (q) list = list.filter((c) => `${c.title} ${c.subject}`.toLowerCase().includes(q.toLowerCase()));
    return list;
  }, [branch, level, q]);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="h2 text-heading">Browse courses</h1>
        <p className="mt-1 text-sm text-body">Enrol in any course with a single tap — progress is saved automatically.</p>
      </div>

      <Card className="p-4">
        <div className="flex flex-wrap gap-2">
          <Pill active={branch === 'all'} onClick={() => setBranch('all')}>All</Pill>
          {BRANCHES.map((b) => (
            <Pill key={b.id} active={branch === b.id} onClick={() => setBranch(b.id)}>{b.label}</Pill>
          ))}
        </div>
        <div className="mt-3 flex flex-col gap-2 sm:flex-row">
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search courses…"
            className="flex-1 rounded-md border border-line bg-paper px-3 py-2 text-sm outline-none focus:border-accent"
          />
          <select value={level} onChange={(e) => setLevel(e.target.value)} className="rounded-md border border-line bg-paper px-3 py-2 text-sm outline-none focus:border-accent">
            <option value="all">All levels</option>
            <option value="JSS">Junior Secondary</option>
            <option value="SSS">Senior Secondary</option>
            <option value="Undergraduate">Undergraduate</option>
            <option value="Graduate">Graduate</option>
          </select>
        </div>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((c) => (
          <Card key={c.slug} className="flex flex-col overflow-hidden">
            <img src={c.img} alt="" className="-mx-5 -mt-5 mb-3 aspect-video w-[calc(100%+2.5rem)] object-cover" />
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone="cyan">{c.subject}</Badge>
              <Badge tone="muted">{levelLabel(c)}</Badge>
            </div>
            <h3 className="h5 mt-2 text-heading">{c.title}</h3>
            <p className="mt-1 flex-1 text-sm text-body">{c.blurb}</p>
            <p className="mt-2 text-xs text-body/70">{Math.round(courseDuration(c) / 60)} hrs · {c.modules.reduce((a, m) => a + m.lessons.length, 0)} lessons</p>
            <div className="mt-3 flex gap-2">
              <Link to={`/portal/student/courses/${c.slug}`} className="flex-1 c-button c-button--primary !py-2 text-center">
                Enrol
              </Link>
              <Link to={`/learn/${c.slug}`} className="c-button c-button--secondary !py-2">
                Preview
              </Link>
            </div>
          </Card>
        ))}
        {filtered.length === 0 && (
          <Card>
            <p className="py-8 text-center text-sm text-body">No courses match.</p>
          </Card>
        )}
      </div>
    </div>
  );
}

function Pill({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'rounded-md px-4 py-2 text-sm font-semibold transition-colors',
        active ? 'bg-brand text-cyan' : 'bg-paper text-body ring-1 ring-line hover:text-accent'
      )}
    >
      {children}
    </button>
  );
}