import React, { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import PageHeader from '../../components/ui/PageHeader.jsx';
import { Button, Icon, Section } from '../../components/ui/Kit.jsx';
import { colleges, courses, graduateCourses, news } from '../../data/seed.js';

function ResultGroup({ label, to, items, q }) {
  if (items.length === 0) return null;
  return (
    <section className="rounded-xl bg-paper p-6 ring-1 ring-line">
      <div className="flex items-center justify-between">
        <h3 className="h5 text-heading">
          {label} <span className="ml-1 rounded-full bg-band px-2 py-0.5 text-xs font-semibold text-accent">{items.length}</span>
        </h3>
        <a href={to} className="text-sm font-semibold text-accent animated-underline animated-underline--off hover:animated-underline--on">
          See all
        </a>
      </div>
      <ul className="mt-3 divide-y divide-line">
        {items.slice(0, 6).map((it) => (
          <li key={it.id} className="group">
            <a href={it.href} className="flex items-center justify-between gap-4 py-3">
              <span className="min-w-0">
                <span className="block truncate font-semibold text-heading">
                  <span className="animated-underline animated-underline--off group-hover:animated-underline--on">{it.title}</span>
                </span>
                {it.sub && <span className="block truncate text-sm text-body">{it.sub}</span>}
              </span>
              <Icon name="chevron-right" className="c-icon--sm shrink-0 fill-accent" />
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default function SearchPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const q = params.get('q') ?? '';
  const needle = q.trim().toLowerCase();
  const [input, setInput] = useState(q);

  const groups = useMemo(() => {
    if (!needle) return [];
    const hit = (...fields) => fields.some((f) => typeof f === 'string' && f.toLowerCase().includes(needle));

    const courseResults = [...courses, ...graduateCourses]
      .filter((c) => hit(c.title, c.blurb, c.area, c.faculty, c.code))
      .map((c) => ({ id: c.code, title: c.title, sub: `${c.degree} · ${c.years} years · ${c.faculty}`, href: '/courses?q=' + encodeURIComponent(needle) }));


    const newsResults = news
      .filter((n) => hit(n.title, n.excerpt, n.category, ...(n.tags ?? [])))
      .map((n) => ({ id: n.id, title: n.title, sub: `${n.category} · ${n.date}`, href: n.href }));

    const collegeResults = colleges
      .filter((c) => hit(c.name, c.blurb, c.motto))
      .map((c) => ({ id: c.name, title: c.name, sub: `College · est. ${c.founded} · ${c.motto}`, href: '/about' }));

    return [
      { label: 'Courses', to: '/courses', items: courseResults },
      { label: 'News and features', to: '/news', items: newsResults },
      { label: 'Colleges and halls', to: '/about', items: collegeResults },
    ].filter((g) => g.items.length > 0);
  }, [needle]);

  const total = groups.reduce((n, g) => n + g.items.length, 0);

  function go(e) {
    e.preventDefault();
    const t = input.trim();
    navigate(t ? `/search?q=${encodeURIComponent(t)}` : '/search');
  }

  return (
    <>
      <PageHeader
        title="Search"
        lead="Search courses, news and college pages across the University of Brightwell."
        crumbs={[{ to: '/', label: 'Home' }, { label: 'Search' }]}
      />
      <Section>
        <div className="c-container">
          <form onSubmit={go} className="flex flex-col gap-2 md:flex-row">
            <label htmlFor="q" className="sr-only">
              Search
            </label>
            <input
              id="q"
              type="search"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Try “medicine”, “physics”, “the Ogun library”…"
              className="w-full flex-1 rounded-md border border-line bg-paper px-4 py-3 text-sm outline-none focus:border-accent"
            />
            <Button>Search</Button>
          </form>

          {!needle ? (
            <p className="mt-8 text-sm text-body">Type a keyword above to search the site.</p>
          ) : groups.length === 0 ? (
            <div className="mt-8 rounded-xl bg-paper p-12 text-center ring-1 ring-line">
              <p className="h4 text-heading">No results for “{q.trim()}”</p>
              <p className="mt-2 text-sm text-body">Try a different keyword, or browse the course A–Z.</p>
            </div>
          ) : (
            <>
              <p className="mt-8 text-sm">
                <strong className="font-semibold text-heading">{total}</strong> result{total === 1 ? '' : 's'} for “{q.trim()}”
              </p>
              <div className="mt-4 grid gap-4 lg:grid-cols-2">
                {groups.map((g) => (
                  <ResultGroup key={g.label} {...g} />
                ))}
              </div>
            </>
          )}
        </div>
      </Section>
    </>
  );
}