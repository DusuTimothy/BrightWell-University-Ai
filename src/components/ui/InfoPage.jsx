import React from 'react';
import { Link } from 'react-router-dom';
import PageHeader from './PageHeader.jsx';
import { Section } from './Kit.jsx';

/* --------------------------------------------------------------------------
   InfoPage — standard content page for footer / policy / service links.
   Sections alternate white and the pale band (Oxford rhythm). Each section
   may carry a right-hand aside (contact panel, quick facts or links).
   -------------------------------------------------------------------------- */
export default function InfoPage({ title, lead, crumbs = [], sections = [], after }) {
  return (
    <>
      <PageHeader title={title} lead={lead} crumbs={crumbs} />

      {sections.map((s, i) => {
        const band = i % 2 === 1;
        return (
          <Section key={s.heading || i} band={band}>
            <div className="c-container grid grid-cols-12 gap-8">
              <div className="col-span-full lg:col-span-7">
                {s.heading && <h2 className="h2 mb-3 text-heading">{s.heading}</h2>}
                {s.intro && <p className="mb-4 leading-relaxed">{s.intro}</p>}
                <div className="space-y-4 leading-relaxed">
                  {(s.body || []).map((p, j) => (
                    <p key={j}>{p}</p>
                  ))}
                  {s.list && (
                    <>
                      {s.list.title && (
                        <h3 className="pt-2 font-heading text-lg text-heading">{s.list.title}</h3>
                      )}
                      <ul className="mt-3 list-disc space-y-2 pl-5 marker:text-accent">
                        {s.list.items.map((x, k) => (
                          <li key={k}>{x}</li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>
              </div>

              {s.aside && (
                <div className="col-span-full lg:col-span-5">
                  <div className="h-full rounded-xl bg-band p-8">
                    <h3 className="h4 mb-4 text-heading">{s.aside.title}</h3>
                    {s.aside.rows && (
                      <dl className="space-y-3">
                        {s.aside.rows.map(([t, v], k) => (
                          <div
                            key={k}
                            className="flex items-baseline justify-between gap-4 border-b border-brand/10 pb-2 text-sm last:border-0 last:pb-0"
                          >
                            <dt className="text-body">{t}</dt>
                            <dd className="text-right font-medium text-heading">{v}</dd>
                          </div>
                        ))}
                      </dl>
                    )}
                    {s.aside.body && <p className="mt-4 text-sm leading-relaxed">{s.aside.body}</p>}
                    {s.aside.links && (
                      <ul className="mt-4 space-y-2 text-sm">
                        {s.aside.links.map(([to, label], k) => (
                          <li key={k}>
                            <Link to={to} className="animated-underline animated-underline--off font-medium hover:animated-underline--on">
                              {label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              )}
            </div>
          </Section>
        );
      })}

      {after}
    </>
  );
}