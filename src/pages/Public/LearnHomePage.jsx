import React, { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import PageHeader from '../../components/ui/PageHeader.jsx';
import { Section, Icon } from '../../components/ui/Kit.jsx';
import { learningCourses, courseDuration, BRANCHES, levelLabel } from '../../data/learning.js';
import cn from '../../lib/cn.js';

export default function LearnHomePage() {
  const [searchParams] = useSearchParams();
  const branchParam = searchParams.get('branch');
  const initialBranch = BRANCHES.some((b) => b.id === branchParam) ? branchParam : 'secondary';
  const [branch, setBranch] = useState(initialBranch);
  const [level, setLevel] = useState('All');
  const [q, setQ] = useState('');

  useEffect(() => {
    if (BRANCHES.some((b) => b.id === branchParam)) setBranch(branchParam);
  }, [branchParam]);

  const active = BRANCHES.find((b) => b.id === branch);

  const filtered = useMemo(() => {
    return learningCourses.filter((c) => {
      if (c.branch !== branch) return false;
      if (level !== 'All' && c.level !== level) return false;
      if (q && !`${c.title} ${c.subject} ${c.blurb}`.toLowerCase().includes(q.toLowerCase())) return false;
      return true;
    });
  }, [branch, level, q]);

  const counts = (branchId) => learningCourses.filter((c) => c.branch === branchId).length;

  return (
    <>
      <PageHeader
        title="Brightwell E-Learning"
        lead="One learning platform for the whole Brightwell community — university and secondary school. Pick the system you belong to, browse its courses, and sign in to the portal to enrol."
        crumbs={[{ to: '/', label: 'Home' }, { label: 'E-Learning' }]}
      />

      <Section>
        <div className="c-container">
          <div className="flex flex-wrap gap-2" role="group" aria-label="Choose your school branch">
            {BRANCHES.map((b) => (
              <button
                key={b.id}
                type="button"
                onClick={() => { setBranch(b.id); setLevel('All'); }}
                className={cn(
                  'rounded-md px-5 py-3 text-left transition-colors',
                  branch === b.id ? 'bg-brand text-cyan ring-2 ring-accent' : 'bg-paper text-body ring-1 ring-line hover:text-accent'
                )}
              >
                <span className="block text-sm font-semibold">{b.label}</span>
                <span className={cn('block text-xs', branch === b.id ? 'text-cyan/70' : 'text-body/60')}>
                  {b.tagline} · {counts(b.id)} courses
                </span>
              </button>
            ))}
          </div>

          <div className="mt-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by level">
              {['All', ...active.levels].map((l) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => setLevel(l)}
                  className={cn(
                    'rounded-md px-4 py-2 text-sm font-semibold transition-colors',
                    level === l ? 'bg-brand text-cyan' : 'bg-paper text-body ring-1 ring-line hover:text-accent'
                  )}
                >
                  {l === 'All' ? 'All levels' : l === 'JSS' ? 'Junior Secondary' : l === 'SSS' ? 'Senior Secondary' : l}
                </button>
              ))}
            </div>
            <div className="sm:max-w-xs sm:flex-1">
              <label htmlFor="learn-search" className="sr-only">Search courses</label>
              <div className="relative">
                <Icon name="search" className="c-icon--sm absolute left-3 top-1/2 -translate-y-1/2 text-body/60" />
                <input
                  id="learn-search"
                  type="search"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search courses…"
                  className="w-full rounded-md border border-line bg-paper py-2.5 pl-9 pr-4 text-sm outline-none focus:border-accent"
                />
              </div>
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="mt-10 rounded-md bg-paper px-6 py-16 text-center ring-1 ring-line">
              <p className="h4 text-heading">No courses match your search</p>
              <p className="mt-2 text-sm text-body">Try a different keyword or level.</p>
            </div>
          ) : (
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((c) => (
                <Link
                  key={c.slug}
                  to={`/learn/${c.slug}`}
                  className="group flex flex-col overflow-hidden rounded-md bg-paper ring-1 ring-line transition-shadow hover:shadow-lg"
                >
                  <div className="relative overflow-hidden">
                    <img src={c.img} alt="" className="aspect-video w-full object-cover transition-transform duration-300 group-hover:scale-105" />
                    <span className="absolute left-2.5 top-2.5 rounded-md bg-brand px-2 py-1 text-xs font-semibold text-cyan">
                      {c.subject}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <div className="flex items-center gap-2">
                      <span className="rounded bg-cyan/15 px-2 py-0.5 text-[11px] font-semibold text-cyan-800">
                        {branch === 'university' ? 'University' : 'Secondary School'}
                      </span>
                      <h3 className="h5 text-heading">
                        <span className="animated-underline animated-underline--off group-hover:animated-underline--on">{c.title}</span>
                      </h3>
                    </div>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-body">{c.blurb}</p>
                    <dl className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-body/80">
                      <div className="flex items-center gap-1">
                        <Icon name="graduation-cap" className="c-icon--xs" />
                        {levelLabel(c)}
                      </div>
                      <div className="flex items-center gap-1">
                        <Icon name="play" className="c-icon--xs" />
                        {c.lessons} lessons
                      </div>
                      <div className="flex items-center gap-1">
                        <Icon name="clock" className="c-icon--xs" />
                        {Math.round(courseDuration(c) / 60)} hrs
                      </div>
                      <div className="flex items-center gap-1">
                        <Icon name="users" className="c-icon--xs" />
                        {c.teacher.split(' ').slice(-1)[0]}
                      </div>
                    </dl>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </Section>

      <Section band>
        <div className="c-container flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div>
            <h3 className="h4 text-heading">Ready to start learning?</h3>
            <p className="mt-1 max-w-[56ch] text-sm text-body">
              Sign in to the student portal, choose your school branch and enrol in a course — complete lessons, take quizzes and submit assignments. Progress is saved automatically.
            </p>
          </div>
          <Link to="/portal/login" className="c-button c-button--primary">Sign in to the portal</Link>
        </div>
      </Section>
    </>
  );
}
