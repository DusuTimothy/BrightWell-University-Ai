import React, { useMemo, useState } from 'react';
import PageHeader from '../../components/ui/PageHeader.jsx';
import { Icon, LazyImg, Section, SectionHeader } from '../../components/ui/Kit.jsx';
import { IMG } from '../../data/seed.js';

const FILTERS = ['All', 'Lecture notes', 'Past papers', 'Reading lists', 'Videos', 'Software'];

const RESOURCES = [
  { title: 'Introduction to Cell Biology — Lecture Notes', cat: 'Lecture notes', format: 'PDF', size: '4.2 MB', updated: '02 Sep 2026', img: IMG.studyOutdoor },
  { title: 'Mathematics: Calculus I — Problem Sheets', cat: 'Lecture notes', format: 'PDF', size: '1.8 MB', updated: '28 Aug 2026', img: IMG.studyOutdoor },
  { title: 'Physics: Mechanics — Past Papers (2020–2025)', cat: 'Past papers', format: 'PDF', size: '6.6 MB', updated: '15 Aug 2026', img: IMG.library },
  { title: 'History of Medicine — Summer Reading List', cat: 'Reading lists', format: 'PDF', size: '0.9 MB', updated: '01 Sep 2026', img: IMG.library },
  { title: 'Introduction to Microeconomics — Video Lectures', cat: 'Videos', format: 'Stream', size: '12 sessions', updated: '20 Aug 2026', img: IMG.classroom },
  { title: 'Python for Data Science — Notebooks & Code', cat: 'Software', format: 'ZIP', size: '28 MB', updated: '17 Aug 2026', img: IMG.classroom },
  { title: 'Inorganic Chemistry — Practical Manual', cat: 'Lecture notes', format: 'PDF', size: '3.4 MB', updated: '25 Aug 2026', img: IMG.studyOutdoor },
  { title: 'English Literature: Shakespeare — Seminar Papers', cat: 'Past papers', format: 'PDF', size: '2.1 MB', updated: '11 Aug 2026', img: IMG.library },
  { title: 'Anatomy — Video Dissection Series', cat: 'Videos', format: 'Stream', size: '18 sessions', updated: '30 Aug 2026', img: IMG.classroom },
  { title: 'Statistics — Formula Handbook', cat: 'Reading lists', format: 'PDF', size: '0.6 MB', updated: '22 Aug 2026', img: IMG.studyOutdoor },
  { title: 'Thermodynamics — Worked Solutions', cat: 'Lecture notes', format: 'PDF', size: '2.9 MB', updated: '19 Aug 2026', img: IMG.studyOutdoor },
  { title: 'R for Analytics — Practical Exercises', cat: 'Software', format: 'ZIP', size: '14 MB', updated: '14 Aug 2026', img: IMG.classroom },
  { title: 'Jurisprudence — Past Papers (2018–2025)', cat: 'Past papers', format: 'PDF', size: '5.0 MB', updated: '09 Aug 2026', img: IMG.library },
  { title: 'Modern Languages — Grammar Reference', cat: 'Reading lists', format: 'PDF', size: '1.2 MB', updated: '27 Aug 2026', img: IMG.library },
  { title: 'Data Structures — Video Lectures', cat: 'Videos', format: 'Stream', size: '15 sessions', updated: '24 Aug 2026', img: IMG.classroom },
];

function ResourceRow({ r }) {
  return (
    <li className="group">
      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-line py-4">
        <div className="flex min-w-0 flex-1 items-start gap-4">
          <LazyImg src={r.img} className="h-16 w-24 shrink-0 rounded-md object-cover" />
          <div className="min-w-0">
            <span className="tag-pill">{r.cat}</span>
            <h3 className="h5 mt-1.5 text-heading">
              <a href="#download" className="animated-underline animated-underline--off group-hover:animated-underline--on">
                {r.title}
              </a>
            </h3>
            <p className="mt-1 text-xs text-body/80">
              {r.format} · {r.size} · Updated {r.updated}
            </p>
          </div>
        </div>
        <a
          href="#download"
          className="inline-flex items-center gap-2 rounded-md bg-brand px-4 py-2 text-sm font-semibold text-cyan transition-colors hover:bg-accent"
        >
          Download
          <Icon name="arrow" className="c-icon--sm" />
        </a>
      </div>
    </li>
  );
}

export default function ResourcesPage() {
  const [cat, setCat] = useState('All');

  const filtered = useMemo(
    () => (cat === 'All' ? RESOURCES : RESOURCES.filter((r) => r.cat === cat)),
    [cat]
  );

  return (
    <>
      <PageHeader
        title="Study resources"
        lead="Lecture notes, past papers, reading lists, videos and software for Brightwell students — browse, search and download to support your learning."
        crumbs={[{ to: '/', label: 'Home' }, { label: 'Study resources' }]}
      />

      <Section>
        <div className="c-container">
          <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by content type">
            {FILTERS.map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setCat(f)}
                className={
                  cat === f
                    ? 'c-button c-button--primary !py-2.5'
                    : 'c-button c-button--secondary !py-2.5'
                }
              >
                {f}
              </button>
            ))}
          </div>

          <p className="mt-8 text-sm">
            <strong className="font-semibold text-heading">{filtered.length}</strong> resource{filtered.length === 1 ? '' : 's'}{' '}
            {cat !== 'All' ? <>in <strong>{cat}</strong> </> : null}available to download.
          </p>

          {filtered.length === 0 ? (
            <div className="mt-6 rounded-md bg-paper px-6 py-16 text-center">
              <p className="h4 text-heading">No resources in this category yet</p>
              <p className="mt-2 text-sm text-body">Check back soon, or ask your tutor for guidance.</p>
            </div>
          ) : (
            <ul className="mt-2">
              {filtered.map((r) => (
                <ResourceRow key={r.title} r={r} />
              ))}
            </ul>
          )}
        </div>
      </Section>

      <Section band>
        <div className="c-container grid grid-cols-12 items-center gap-8">
          <div className="col-span-full lg:col-span-6">
            <h2 className="h2 mb-4 text-heading">Libraries and collections</h2>
            <p className="text-base leading-relaxed">
              Beyond the online downloads above, every Brightwell student has access to the university’s libraries —
              more than eleven million volumes, rare collections and scholarly databases, all on one card.
            </p>
            <div className="mt-4 flex justify-center gap-8 text-center">
              {[
                ['1.1m', 'e-books'],
                ['38k', 'journals'],
                ['11m', 'volumes'],
              ].map(([n, l]) => (
                <div key={l}>
                  <div className="h2 text-heading">{n}</div>
                  <div className="text-sm text-body">{l}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="col-span-full lg:col-span-6">
            <LazyImg src={IMG.library} ratio="aspect-[16/10]" className="rounded-xl" />
          </div>
        </div>
      </Section>
    </>
  );
}
