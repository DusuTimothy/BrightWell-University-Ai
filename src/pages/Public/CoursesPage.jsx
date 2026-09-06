import React, { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import PageHeader from '../../components/ui/PageHeader.jsx';
import { Button, Icon, Section } from '../../components/ui/Kit.jsx';
import { courses, graduateCourses } from '../../data/seed.js';

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

function CourseRow({ c }) {
  return (
    <li className="group">
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line py-4">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex w-[4.5rem] shrink-0 items-center justify-center rounded-md bg-brand px-2 py-1 text-center text-xs font-semibold text-cyan">
              {c.code}
            </span>
            <h3 className="h5 text-heading">
              <span className="animated-underline animated-underline--off group-hover:animated-underline--on">{c.title}</span>
            </h3>
          </div>
          <p className="mt-1 max-w-[70ch] text-sm leading-relaxed">{c.blurb}</p>
        </div>
        <div className="flex shrink-0 items-center gap-5 text-sm text-body/80">
          <span className="whitespace-nowrap">{c.degree}</span>
          <span className="whitespace-nowrap">{c.years} years</span>
          <span className="flex items-center gap-1 font-medium text-accent">
            <a href="/admissions" className="animated-underline animated-underline--off hover:animated-underline--on block">
              Find out more
            </a>
            <Icon name="chevron-right" className="c-icon--sm" />
          </span>
        </div>
      </div>
    </li>
  );
}

export default function CoursesPage() {
  const [params] = useSearchParams();
  const level = params.get('level') === 'graduate' ? 'graduate' : 'undergraduate';
  const q = (params.get('q') ?? '').trim().toLowerCase();
  const [letter, setLetter] = useState('All');

  const pool = level === 'graduate' ? graduateCourses : courses;

  const filtered = useMemo(() => {
    return pool.filter((c) => {
      if (letter !== 'All' && !c.title.toUpperCase().startsWith(letter)) return false;
      if (q && !`${c.title} ${c.blurb} ${c.area} ${c.faculty}`.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [pool, q, letter]);

  const grouped = useMemo(() => {
    const letters = new Set(filtered.map((c) => c.title[0].toUpperCase()));
    const byLetter = {};
    for (const c of filtered) {
      const L = c.title[0].toUpperCase();
      byLetter[L] = byLetter[L] ?? [];
      byLetter[L].push(c);
    }
    return { letters: [...letters].sort(), byLetter };
  }, [filtered]);

  return (
    <>
      <PageHeader
        title="Courses A–Z"
        lead="Browse the full A–Z of Brightwell courses — filter by type, subject or search by keyword."
        crumbs={[{ to: '/', label: 'Home' }, { label: 'Courses A–Z' }]}
      />

      <Section>
        <div className="c-container">
          {/* level toggle */}
          <div className="flex flex-wrap gap-2" role="group" aria-label="Course type">
            {[
              ['undergraduate', 'Undergraduate courses'],
              ['graduate', 'Graduate courses'],
            ].map(([v, label]) => (
              <a
                key={v}
                href={`/courses?level=${v}`}
                className={
                  level === v
                    ? 'c-button c-button--primary !py-2.5'
                    : 'c-button c-button--secondary !py-2.5'
                }
              >
                {label}
              </a>
            ))}
            {q && (
              <a href={`/courses?level=${level}`} className="c-button c-button--secondary !py-2.5">
                Clear search “{q}”
              </a>
            )}
          </div>

          {/* alphabet */}
          <div className="mt-8 flex flex-wrap gap-1.5">
            {['All', ...ALPHABET].map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => setLetter(l)}
                className={
                  letter === l
                    ? 'h-9 w-9 rounded-md bg-brand text-sm font-semibold text-cyan'
                    : 'h-9 w-9 rounded-md bg-paper text-sm font-medium text-body transition-colors hover:bg-band hover:text-accent'
                }
              >
                {l}
              </button>
            ))}
          </div>

          <p className="mt-6 text-sm">
            <strong className="font-semibold text-heading">{filtered.length}</strong> course{filtered.length === 1 ? '' : 's'}{' '}
            {q ? <>matching “<strong>{q}</strong>” </> : null}
            {letter !== 'All' ? <>beginning with <strong>{letter}</strong> </> : null}
          </p>

          {grouped.letters.length === 0 ? (
            <div className="mt-6 rounded-md bg-paper px-6 py-16 text-center">
              <p className="h4 text-heading">No courses match your search</p>
              <p className="mt-2 text-sm text-body">Try a different keyword, or browse the full listing.</p>
            </div>
          ) : (
            grouped.letters.map((L) => (
              <div key={L} className="mt-8">
                <h3 className="h4 mb-2 flex items-center gap-3 text-heading" id={`letter-${L}`}>
                  <span className="flex h-10 w-10 items-center justify-center rounded-md bg-brand text-white">{L}</span>
                  {L}
                </h3>
                <ul>
                  {grouped.byLetter[L].map((c) => (
                    <CourseRow key={c.code} c={c} />
                  ))}
                </ul>
              </div>
            ))
          )}
        </div>
      </Section>

      <Section band>
        <div className="c-container flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div>
            <h3 className="h4 text-heading">Not sure where to start?</h3>
            <p className="mt-1 max-w-[56ch] text-sm text-body">
              Book a free appointment with our admissions team, or visit an open day to meet tutors and students.
            </p>
          </div>
          <Button to="/admissions">Book an appointment</Button>
        </div>
      </Section>
    </>
  );
}