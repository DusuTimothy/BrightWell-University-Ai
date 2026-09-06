import React, { useState } from 'react';
import PageHeader from '../../components/ui/PageHeader.jsx';
import { Section, TeaserCard } from '../../components/ui/Kit.jsx';
import { news } from '../../data/seed.js';

const CATEGORIES = ['All', ...Array.from(new Set(news.map((n) => n.category)))];

export default function NewsPage() {
  const [cat, setCat] = useState('All');
  const items = cat === 'All' ? news : news.filter((n) => n.category === cat);

  return (
    <>
      <PageHeader
        title="News"
        lead="The latest news, features and research stories from across the University."
        crumbs={[{ to: '/', label: 'Home' }, { label: 'News' }]}
      />

      <Section>
        <div className="c-container">
          <ul className="flex flex-wrap gap-x-6 gap-y-3 pb-6">
            {CATEGORIES.map((c) => (
              <li key={c}>
                <button
                  type="button"
                  onClick={() => setCat(c)}
                  className={
                    cat === c
                      ? 'animated-underline--on animated-underline pb-1 text-sm font-semibold text-accent'
                      : 'animated-underline animated-underline--off hover:animated-underline--on pb-1 text-sm font-medium text-body hover:text-accent'
                  }
                >
                  {c}
                </button>
              </li>
            ))}
          </ul>

          <div className="grid grid-cols-1 gap-x-4 gap-y-10 sm:grid-cols-2 xl:grid-cols-3">
            {items.map((n) => (
              <TeaserCard key={n.id} item={n} imgSrc={n.img} />
            ))}
          </div>
        </div>
      </Section>
    </>
  );
}