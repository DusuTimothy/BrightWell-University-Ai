import React, { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import PageHeader from '../../components/ui/PageHeader.jsx';
import { Section, Icon } from '../../components/ui/Kit.jsx';
import { learningCourses, courseDuration, BRANCHES, levelLabel } from '../../data/learning.js';
import cn from '../../lib/cn.js';

const SUBJECTS = Array.from(new Set(learningCourses.map((c) => c.subject))).sort();

export default function CoursesPage() {
  const [params, setParams] = useSearchParams();
  const branchParam = params.get('branch');
  const levelParam = params.get('level');
  const subjectParam = params.get('subject');
  const qParam = params.get('q') || '';

  const [branch, setBranch] = useState(BRANCHES.some((b) => b.id === branchParam) ? branchParam : 'all');
  const [level, setLevel] = useState(levelParam || 'all');
  const [subject, setSubject] = useState(subjectParam || 'all');
  const [q, setQ] = useState(qParam);
  const [sort, setSort] = useState('popular');

  useEffect(() => {
    setQ(qParam);
  }, [qParam]);

  useEffect(() => {
    const next = {};
    if (branch !== 'all') next.branch = branch;
    if (level !== 'all') next.level = level;
    if (subject !== 'all') next.subject = subject;
    if (q.trim()) next.q = q.trim();
    setParams(next, { replace: true });
  }, [branch, level, subject, q, setParams]);

  const active = BRANCHES.find((b) => b.id === branch) || { levels: ['JSS', 'SSS', 'Undergraduate', 'Graduate'] };
  const counts = (branchId) => learningCourses.filter((c) => c.branch === branchId).length;

  const filtered = useMemo(() => {
    let list = learningCourses;
    if (branch !== 'all') list = list.filter((c) => c.branch === branch);
    if (level !== 'all') list = list.filter((c) => c.level === level);
    if (subject !== 'all') list = list.filter((c) => c.subject === subject);
    if (q.trim()) {
      const t = q.toLowerCase();
      list = list.filter((c) =>
        `${c.title} ${c.subject} ${c.teacher} ${c.blurb}`.toLowerCase().includes(t)
      );
    }
    const sorted = [...list];
    if (sort === 'short') sorted.sort((a, b) => courseDuration(a) - courseDuration(b));
    if (sort === 'long') sorted.sort((a, b) => courseDuration(b) - courseDuration(a));
    if (sort === 'title') sorted.sort((a, b) => a.title.localeCompare(b.title));
    return sorted;
  }, [branch, level, subject, q, sort]);

  const reset = () => {
    setBranch('all');
    setLevel('all');
    setSubject('all');
    setQ('');
    setSort('popular');
  };

  return (
    <>
      <PageHeader
        title="Course catalogue"
        lead="Browse every course on the platform — secondary school and university. Sign in to enrol and start learning."
        crumbs={[{ to: '/', label: 'Home' }, { label: 'Courses' }]}
      />

      <Section>
        <div className="c-container">
          {/* Branch selector */}
          <div className="flex flex-wrap gap-2" role="group" aria-label="Choose your school branch">
            <button
              type="button"
              onClick={() => { setBranch('all'); setLevel('all'); }}
              className={cn(
                'rounded-md px-5 py-3 text-left transition-colors',
                branch === 'all' ? 'bg-brand text-cyan ring-2 ring-accent' : 'bg-paper text-body ring-1 ring-line hover:text-accent'
              )}
            >
              <span className="block text-sm font-semibold">All courses</span>
              <span className={cn('block text-xs', branch === 'all' ? 'text-cyan/70' : 'text-body/60')}>
                {learningCourses.length} courses
              </span>
            </button>
            {BRANCHES.map((b) => (
              <button
                key={b.id}
                type="button"
                onClick={() => { setBranch(b.id); setLevel('all'); }}
                className={cn(
'rounded-sm px-5 py-3 text-left transition-colors',
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

          {/* Filter bar */}
          <div className="mt-8 grid gap-4 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-7">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-body/70">Level</p>
              <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by level">
                {['all', ...active.levels].map((l) => (
                  <button
                    key={l}
                    type="button"
                    onClick={() => setLevel(l)}
                    className={cn(
'rounded-sm px-4 py-2 text-sm font-semibold transition-colors',
                    level === l ? 'bg-brand text-cyan' : 'bg-paper text-body ring-1 ring-line hover:text-accent'
                    )}
                  >
                    {l === 'all' ? 'All levels' : l === 'JSS' ? 'Junior Secondary' : l === 'SSS' ? 'Senior Secondary' : l}
                  </button>
                ))}
              </div>
            </div>

            <div className="lg:col-span-3">
              <label htmlFor="course-subject" className="mb-2 block text-xs font-semibold uppercase tracking-wide text-body/70">Subject</label>
              <select
                id="course-subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full rounded-md border border-line bg-paper px-3 py-2 text-sm outline-none focus:border-accent"
              >
                <option value="all">All subjects</option>
                {SUBJECTS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div className="lg:col-span-2">
              <label htmlFor="course-sort" className="mb-2 block text-xs font-semibold uppercase tracking-wide text-body/70">Sort by</label>
              <select
                id="course-sort"
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="w-full rounded-md border border-line bg-paper px-3 py-2 text-sm outline-none focus:border-accent"
              >
                <option value="popular">Popularity</option>
                <option value="short">Shortest first</option>
                <option value="long">Longest first</option>
                <option value="title">Title (A–Z)</option>
              </select>
            </div>
          </div>

          {/* Search row */}
          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Icon name="search" className="c-icon--sm absolute left-3 top-1/2 -translate-y-1/2 text-body/60" />
              <input
                id="course-search"
                type="search"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search by course title, subject or instructor…"
                className="w-full rounded-md border border-line bg-paper py-2.5 pl-9 pr-4 text-sm outline-none focus:border-accent"
              />
            </div>
            <button
              type="button"
              onClick={reset}
              className="text-sm font-semibold text-accent hover:underline"
            >
              Reset filters
            </button>
          </div>

          {/* Results */}
          <p className="mt-6 text-sm text-body/80">
            Showing <strong className="text-heading">{filtered.length}</strong> of {learningCourses.length} courses
          </p>

          {filtered.length === 0 ? (
            <div className="mt-8 rounded-xl bg-paper px-6 py-16 text-center ring-1 ring-line">
              <Icon name="search" className="c-icon--md mx-auto fill-body/40" />
              <p className="h4 mt-4 text-heading">No courses match your filters</p>
              <p className="mt-2 text-sm text-body">Try a different keyword, subject or level.</p>
              <button onClick={reset} className="mt-6 text-sm font-semibold text-accent hover:underline">
                Reset all filters
              </button>
            </div>
          ) : (
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((c) => (
                <Link
                  key={c.slug}
                  to={`/courses/${c.slug}`}
                  className="group flex flex-col overflow-hidden rounded-xl bg-paper ring-1 ring-line transition-shadow hover:shadow-lg"
                >
                  <div className="relative overflow-hidden">
                    <img src={c.img} alt="" className="aspect-video w-full object-cover transition-transform duration-300 group-hover:scale-105" />
                    <span className="absolute left-3 top-3 rounded-md bg-brand px-2 py-1 text-[11px] font-semibold text-cyan">
                      {c.subject}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-accent">
                      {c.branch === 'university' ? 'University' : 'Secondary School'} · {levelLabel(c)}
                    </p>
                    <h3 className="h5 mt-1 text-heading">
                      <span className="animated-underline animated-underline--off group-hover:animated-underline--on">{c.title}</span>
                    </h3>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-body">{c.blurb}</p>
                    <dl className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-body/80">
                      <div className="flex items-center gap-1">
                        <Icon name="graduation-cap" className="c-icon--xs fill-accent" />
                        {levelLabel(c)}
                      </div>
                      <div className="flex items-center gap-1">
                        <Icon name="play" className="c-icon--xs fill-accent" />
                        {c.modules.reduce((a, m) => a + m.lessons.length, 0)} lessons
                      </div>
                      <div className="flex items-center gap-1">
                        <Icon name="clock" className="c-icon--xs fill-accent" />
                        {Math.round(courseDuration(c) / 60)} hrs
                      </div>
                      <div className="ml-auto flex items-center gap-1">
                        <Icon name="users" className="c-icon--xs fill-accent" />
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
            <h3 className="h4 text-heading">Ready to enrol?</h3>
            <p className="mt-1 max-w-[56ch] text-sm text-body">
              Sign in to the learner portal, enrol in any course, and start with lesson one. Progress saves automatically.
            </p>
          </div>
          <Link to="/portal/login" className="c-button c-button--primary">Sign in to the portal</Link>
        </div>
      </Section>
    </>
  );
}