import React from 'react';
import PageHeader from '../../components/ui/PageHeader.jsx';
import { Button, CTA, Icon, Section, SectionHeader } from '../../components/ui/Kit.jsx';
import { IMG, brand, colleges, stats } from '../../data/seed.js';

const SECTIONS = [
  {
    id: 'giving',
    title: 'Brightwell Excellence',
    body: 'Together, let’s turn today’s biggest challenges into tomorrow’s boldest breakthroughs. Gifts of every size power scholarships, research and our access programme.',
    cta: 'Make a gift',
  },
  {
    id: 'staff',
    title: 'For staff',
    body: 'People are the foundation of this University’s success. Explore careers, staff benefits, development programmes and the staff intranet.',
    cta: 'Explore careers',
  },
  {
    id: 'history',
    title: 'Our history',
    body: `Founded in ${brand.founded}, Brightwell began as a single hall of residence. Today it is a collegiate community of twenty-four thousand students and more than a hundred researchers drawn from across the world.`,
    cta: 'Read our history',
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHeader
        title="About Brightwell"
        lead="Brightwell University is one of the continent’s leading academic institutions — a collegiate community of scholars, students and staff pursuing knowledge that benefits society."
        crumbs={[{ to: '/', label: 'Home' }, { label: 'About' }]}
      />

      {/* Stats band */}
      <Section band>
        <div className="c-container">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <p className="h3 text-brand">{s.value}</p>
                <p className="mt-1 text-sm leading-snug text-body">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Section>
        <div className="c-container grid grid-cols-12 gap-8">
          <div className="col-span-full lg:col-span-7">
            <h2 className="h2 mb-4 text-heading">A collegiate University</h2>
            <div className="space-y-4 text-base leading-relaxed">
              <p>
                Brightwell’s thirty-six colleges and halls are home to students at every stage of their journey. They are
                where you eat, sleep, study and make friends for life — each with its own library, its own character and
                its own traditions.
              </p>
              <p>
                The University itself provides lectures, laboratories, libraries and examinations, and supports the world-class
                research for which Brightwell is known. Applicants are considered by the University after first declaring a
                college preference.
              </p>
            </div>
            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
              {[
                ['Colleges and halls', '36'],
                ['Undergraduate places', '9,600'],
                ['International students', '44%'],
              ].map(([l, v]) => (
                <div key={l} className="rounded-xl bg-paper p-5 ring-1 ring-line">
                  <p className="text-sm text-body">{l}</p>
                  <p className="mt-1 h3 text-brand">{v}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="col-span-full lg:col-span-5">
            <div className="rounded-xl bg-band p-8">
              <h3 className="h4 mb-4 text-heading">Colleges and halls at a glance</h3>
              <ul className="space-y-4">
                {colleges.map((c) => (
                  <li key={c.name} className="flex items-start gap-3">
                    <span aria-hidden className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-accent" />
                    <div>
                      <p className="font-semibold text-heading">
                        {c.name} <span className="font-normal text-body/80">· est. {c.founded}</span>
                      </p>
                      <p className="text-sm leading-relaxed">{c.blurb}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </Section>

      <Section>
        <div className="c-container">
          <SectionHeader title="Discover more about the University" cta={{ to: '/contact', label: 'Contact and visiting' }} />
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {SECTIONS.map((s) => (
              <article key={s.id} id={s.id} className="flex flex-col rounded-xl bg-paper p-6 ring-1 ring-line">
                <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-accent">{s.id}</p>
                <h3 className="h5 text-heading">{s.title}</h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed">{s.body}</p>
                <div className="mt-5">
                  <Button variant="secondary" to="/about" icon="arrow">
                    {s.cta}
                  </Button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </Section>

      <CTA
        image={IMG.campusLawn}
        flip
        eyebrow="Visiting the University"
        title="Everyone is welcome on campus"
        cta={{ to: '/events', label: 'See open days' }}
      >
        <p>
          The Broad Court is open to all. Come for a college tour, a museum visit or a coffee — and if you are planning
          a research collaboration, our welcome team can connect you with the right department.
        </p>
      </CTA>
    </>
  );
}