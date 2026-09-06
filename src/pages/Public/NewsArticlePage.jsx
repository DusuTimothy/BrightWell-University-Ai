import React from 'react';
import { Link, useParams } from 'react-router-dom';
import PageHeader from '../../components/ui/PageHeader.jsx';
import { Button, LazyImg, MetaPill, Section, SectionHeader, TeaserCard } from '../../components/ui/Kit.jsx';
import { news } from '../../data/seed.js';

const BODY = [
  'Brightwell University — A long-form feature for the digital magazine. ',
  'Far from the noise of the weekly news cycle, our academic community publishes more than three thousand research papers each year, and its members give testimony, write opinions and shape policy on every continent. This story is part of a series profiling the people behind that work — the questions they ask, the tools they build and the debates they provoke.',
  'Beginnings. What begins as a footnote in a textbook can end as a whole field. The research notebook of one junior academic, filled during a sabbatical, eventually became the syllabus of an entire generation of students. Colleagues remember the same story differently, which is a useful reminder that history is rarely tidy.',
  'The work. The project started small, with two doctoral students and a shared bench. Twelve months later the first dataset arrived; a further eighteen months of careful analysis followed. Funding came from a mix of university seed money, a philanthropist with a personal stake in the disease and — eventually — a national research council award that let the team go further than they had dared.',
  'What it means. None of this would matter if it changed nothing. The early results are already being used by clinicians, by city planners and by schoolteachers, depending on the discipline. Replication and open data mean other teams can check, correct and build on what our researchers found.',
  'What’s next. The team is already planning the next phase. There is a grant application in preparation, a conference in July, and — in the longer term — a hope that the work becomes so routine that nobody remembers when the field did not exist.',
];

export default function NewsArticlePage() {
  const { slug } = useParams();
  const item = news.find((n) => n.id === slug) ?? news[0];
  const related = news.filter((n) => n.id !== item.id).slice(0, 3);

  return (
    <>
      <PageHeader title={item.title} crumbs={[{ to: '/', label: 'Home' }, { to: '/news', label: 'News' }, { label: item.category }]} />

      <Section>
        <div className="c-container">
          <div className="grid grid-cols-12 gap-8">
            <article className="col-span-full lg:col-span-8">
              <div className="mb-5 flex items-center justify-between gap-4">
                <MetaPill date={item.date} readTime={item.readTime} />
                <p className="text-sm font-medium text-accent">{item.category}</p>
              </div>
              <LazyImg src={item.img} ratio="aspect-[16/9]" />
              <p className="mt-6 text-lg leading-relaxed font-medium text-heading">{item.excerpt}</p>
              <div className="mt-5 space-y-5 text-[1.05rem] leading-relaxed">
                {BODY.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
              <div className="mt-8 flex flex-wrap gap-2">
                {item.tags.map((t) => (
                  <span key={t} className="tag-pill">
                    {t}
                  </span>
                ))}
              </div>
              <div className="mt-8 border-t border-line pt-6">
                <p className="text-sm text-body">
                  Last updated <time>{item.date}</time>. If you have a question about this article, contact the Communications Office.
                </p>
              </div>
            </article>

            <aside className="col-span-full lg:col-span-4">
              <div className="sticky top-28">
                <h3 className="h4 mb-4 text-heading">You may also like</h3>
                <div className="space-y-6">
                  {related.map((n) => (
                    <TeaserCard key={n.id} item={n} imgSrc={n.img} layout="horizontal" />
                  ))}
                </div>
                <div className="mt-8 rounded-xl bg-band p-6">
                  <h4 className="h5 text-heading">Receive Brightwell news</h4>
                  <p className="mt-2 text-sm text-body">A monthly digest of research and university news.</p>
                  <div className="mt-4">
                    <Button to="/contact">Subscribe by email</Button>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </Section>
    </>
  );
}