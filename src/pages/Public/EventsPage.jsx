import React from 'react';
import PageHeader from '../../components/ui/PageHeader.jsx';
import { CardDivider, Section, SectionHeader } from '../../components/ui/Kit.jsx';
import { events } from '../../data/seed.js';

const TERM_DATES = [
  { term: 'Michaelmas Term', start: '11 Oct', end: '6 Dec' },
  { term: 'Hilary Term', start: '18 Jan', end: '14 Mar' },
  { term: 'Trinity Term', start: '26 Apr', end: '21 Jun' },
];

export default function EventsPage() {
  return (
    <>
      <PageHeader
        title="Events and term dates"
        lead="Open days, public lectures, graduation weekends and the key dates of the academic year."
        crumbs={[{ to: '/', label: 'Home' }, { label: 'Events' }]}
      />

      <Section>
        <div className="c-container">
          <SectionHeader title="What’s on" />
          <div className="space-y-4">
            {events.map((e) => (
              <article key={e.title} className="group/teaser flex flex-col gap-4 rounded-xl bg-paper p-6 ring-1 ring-line md:flex-row md:items-center">
                <div className="flex h-20 w-20 shrink-0 flex-col items-center justify-center rounded-xl bg-brand text-white">
                  <span className="text-[11px] font-semibold uppercase tracking-wide text-cyan">
                    {e.date.split(' ')[1] ?? e.date.split(' ')[0]}
                  </span>
                  <span className="h5">{e.date.split(' ')[0]}</span>
                </div>
                <div className="flex-1">
                  <h3 className="h5 text-heading">{e.title}</h3>
                  <p className="mt-1 text-sm text-body">{e.blurb}</p>
                  <p className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-body/80">
                    <span>{e.place}</span>
                    <span>·</span>
                    <span>{e.time}</span>
                  </p>
                </div>
                <span className="hidden shrink-0 text-accent md:block">
                  <svg className="c-icon c-icon--md" viewBox="0 0 24 24" aria-hidden focusable="false" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="m7.888 21.887-1.775-1.774 8.224-8.226-8.224-8.225 1.775-1.775 10 10z" />
                  </svg>
                </span>
              </article>
            ))}
          </div>
        </div>
      </Section>

      <Section band>
        <div className="c-container">
          <SectionHeader title="Academic year 2026–27" />
          <div className="grid grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-3">
            {TERM_DATES.map((t, i) => (
              <article key={t.term}>
                {i > 0 && <CardDivider />}
                <h3 className="h5 mb-1 text-heading">{t.term}</h3>
                <p className="text-sm text-body">
                  {t.start} – {t.end}
                </p>
              </article>
            ))}
          </div>
        </div>
      </Section>
    </>
  );
}