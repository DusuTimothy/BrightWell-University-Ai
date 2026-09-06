import React from 'react';
import PageHeader from '../../components/ui/PageHeader.jsx';
import { Button, CardDivider, CTA, Section, SectionHeader, TeaserCard } from '../../components/ui/Kit.jsx';
import { IMG, news, researchInstitutes } from '../../data/seed.js';

export default function ResearchPage() {
  const researchNews = news.filter((n) => n.tags?.includes('Research')).slice(0, 4);

  return (
    <>
      <PageHeader
        title="Research at Brightwell"
        lead="The world’s greatest challenges demand new thinking. Our researchers work across everything from malaria control to machine reasoning, from river restoration to the quantum world."
        crumbs={[{ to: '/', label: 'Home' }, { label: 'Research' }]}
      />

      <Section>
        <div className="c-container">
          <SectionHeader title="Our research institutes and centres" cta={{ to: '/news', label: 'All research news' }} />
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {researchInstitutes.map((r) => (
              <article key={r.name} className="group/teaser flex flex-col rounded-xl bg-paper p-6 ring-1 ring-line">
                <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-accent">{r.focus}</p>
                <h3 className="h5 text-heading">
                  <a href="/research" className="animated-underline animated-underline--off group-hover/teaser:animated-underline--on">
                    {r.name}
                  </a>
                </h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed">{r.blurb}</p>
              </article>
            ))}
            <article className="flex flex-col justify-center rounded-xl bg-brand p-6 text-white">
              <h3 className="h5 text-heading">Short courses for curious minds</h3>
              <p className="mt-3 text-sm leading-relaxed text-navy-body">
                Part-time research-led short courses, online and in person, bring a Brightwell education within reach.
              </p>
              <div className="mt-4">
                <Button to="/courses">Browse short courses</Button>
              </div>
            </article>
          </div>
        </div>
      </Section>

      <Section band>
        <div className="c-container">
          <SectionHeader title="Research news" cta={{ to: '/news', label: 'More news' }} />
          <div className="grid grid-cols-1 gap-x-4 gap-y-10 sm:grid-cols-2 xl:grid-cols-4">
            {researchNews.map((n) => (
              <TeaserCard key={n.id} item={n} imgSrc={n.img} />
            ))}
          </div>
        </div>
      </Section>

      <Section>
        <div className="c-container">
          <div className="grid grid-cols-12 items-center gap-8">
            <div className="col-span-full lg:col-span-7">
              <h2 className="h2 mb-4 text-heading">Research with impact</h2>
              <div className="space-y-4 text-base leading-relaxed">
                <p>
                  Brightwell researchers publish more than three thousand papers a year and hold partnerships with
                  institutes on every continent. Our impact strategy is simple: ask hard questions, share the data,
                  and let the work be judged by what it changes in practice.
                </p>
                <p>
                  Each of our four academic divisions — Humanities, Medical Sciences, Mathematical, Physical and Life
                  Sciences, and Social Sciences — runs its own seminars, funding rounds and doctoral programmes.
                </p>
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button to="/courses">Find a research degree</Button>
                <Button variant="secondary" href="/about#staff">
                  Work with us
                </Button>
              </div>
            </div>
            <div className="col-span-full lg:col-span-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-xl bg-paper p-6 text-center ring-1 ring-line">
                  <p className="h3 text-brand">3,000+</p>
                  <p className="mt-1 text-sm text-body">papers published each year</p>
                </div>
                <div className="rounded-xl bg-paper p-6 text-center ring-1 ring-line">
                  <p className="h3 text-brand">120+</p>
                  <p className="mt-1 text-sm text-body">countries in our research network</p>
                </div>
                <div className="rounded-xl bg-paper p-6 text-center ring-1 ring-line">
                  <p className="h3 text-brand">40%</p>
                  <p className="mt-1 text-sm text-body">of research is internationally co-authored</p>
                </div>
                <div className="rounded-xl bg-paper p-6 text-center ring-1 ring-line">
                  <p className="h3 text-brand">18</p>
                  <p className="mt-1 text-sm text-body">spin-out companies founded since 2015</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>

      <CTA
        image={IMG.microscope}
        flip
        eyebrow="Postgraduate research"
        title="Join us as a DPhil candidate"
        cta={{ to: '/admissions', label: 'Explore graduate courses' }}
      >
        <p>
          Funded studentships are available in every institute. Supervisors welcome enquiries from candidates across Africa and
          the world, and support them from first proposal to final viva.
        </p>
      </CTA>
    </>
  );
}