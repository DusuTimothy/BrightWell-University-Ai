import React from 'react';
import { Link } from 'react-router-dom';
import { Icon } from './Kit.jsx';

export default function PageHeader({ title, lead, crumbs = [] }) {
  return (
    <section className="dark relative overflow-hidden bg-brand text-white">
      <div aria-hidden className="absolute inset-0 hero-grid-bg" />
      <div aria-hidden className="absolute -right-40 -top-24 opacity-25">
        <img src="/crest.svg" alt="" className="w-[36rem] max-w-none" />
      </div>
      <div className="c-container relative py-12 md:py-16">
        {crumbs.length > 0 && (
          <nav aria-label="Breadcrumb" className="mb-5">
            <ol className="flex flex-wrap items-center gap-1 text-sm text-white/60">
              {crumbs.map((c, i) => (
                <li key={i} className="flex items-center gap-1">
                  {i > 0 && <Icon name="chevron-right" className="c-icon--xs fill-white/40" />}
                  {c.to ? (
                    <Link to={c.to} className="hover:text-white">
                      {c.label}
                    </Link>
                  ) : (
                    <span aria-current="page" className="font-medium text-white">
                      {c.label}
                    </span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        )}
        <h1 className="h1 max-w-[20ch] text-heading">{title}</h1>
        {lead && <div className="mt-4 max-w-[62ch] text-lg leading-relaxed text-navy-body">{lead}</div>}
      </div>
    </section>
  );
}