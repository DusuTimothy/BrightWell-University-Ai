import React from 'react';
import PageHeader from '../../components/ui/PageHeader.jsx';
import { Button, CardDivider, CTA, LazyImg, Section } from '../../components/ui/Kit.jsx';
import { IMG } from '../../data/seed.js';

const COLUMNS = [
  {
    title: 'Undergraduate admissions',
    href: '/courses',
    body: 'Do you love to question and have an appetite for knowledge? Do you consistently achieve top grades in your class? Are you looking for an exceptional education in an environment which values individuals for who they are? Brightwell might be the place for you.',
    cta: 'Explore undergraduate courses',
    img: IMG.studentsGroup,
  },
  {
    title: 'Graduate admissions',
    href: '/courses',
    body: 'We offer a unique experience to our graduate students, including the opportunity to work with leading academics and with world-class libraries, laboratories, museums and collections.',
    cta: 'Explore graduate courses',
    img: IMG.library,
  },
  {
    title: 'Fees and funding',
    href: '/admissions',
    body: 'Most Nigerian undergraduates pay a government-regulated fee, with generous scholarships, bursaries and interest-free loans available through the Brightwell access programme.',
    cta: 'Read about fees and funding',
    img: IMG.campusLawn,
  },
  {
    title: 'Access Brightwell',
    href: '/admissions',
    body: 'Deciding whether — and where — to go to university is a big step. Our free in-person and online events give you the knowledge, confidence and support to make the choice that’s right for you.',
    cta: 'Visit the access hub',
    img: IMG.tutoring,
  },
];

export default function AdmissionsPage() {
  return (
    <>
      <PageHeader
        title="Admissions"
        lead="Start your Brightwell journey. Explore our courses, meet our tutors and discover what life here is really like."
        crumbs={[{ to: '/', label: 'Home' }, { label: 'Admissions' }]}
      />

      <Section>
        <div className="c-container">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {COLUMNS.map((c) => (
              <article key={c.title} className="group/teaser overflow-hidden rounded-xl bg-paper ring-1 ring-line">
                <LazyImg src={c.img} ratio="aspect-[16/8]" />
                <div className="p-6">
                  <h3 className="h4 text-heading">
                    <a href={c.href} className="animated-underline animated-underline--off group-hover/teaser:animated-underline--on">
                      {c.title}
                    </a>
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed">{c.body}</p>
                  <div className="mt-5">
                    <Button variant="secondary" to="/courses" icon="arrow">
                      {c.cta}
                    </Button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </Section>

      <CTA
        image={IMG.hero}
        eyebrow="Key dates for 2027 entry"
        title="Apply by 15 October 2026"
        cta={{ to: '/events', label: 'See key dates' }}
      >
        <p>
          Applications open in June. Completion of our written assessment and interview are part of the process for most
          courses — your teachers and our access team can help you prepare.
        </p>
      </CTA>

      <Section band>
        <div className="c-container">
          <h2 className="h2 mb-8 text-heading">The steps to a Brightwell offer</h2>
          <div className="grid grid-cols-1 gap-x-6 gap-y-4 lg:grid-cols-4">
            {[
              ['1', 'Choose your course', 'Browse the A–Z, read the course pages and check the entrance requirements with your teachers.'],
              ['2', 'Submit your application', 'Applications open in June on the national portal; most deadlines are 15 October.'],
              ['3', 'Assessments and interviews', 'Many courses ask for a written assessment; most candidates are then invited to an interview.'],
              ['4', 'Offers and open days', 'Offers are made from January. Come to a college open day and decide where you’d like to live and learn.'],
            ].map(([n, t, body], i) => (
              <article key={n}>
                {i > 0 && <CardDivider />}
                <p className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-brand text-lg font-semibold text-cyan">{n}</p>
                <h3 className="h5 mb-1 text-heading">{t}</h3>
                <p className="text-sm leading-relaxed">{body}</p>
              </article>
            ))}
          </div>
        </div>
      </Section>
    </>
  );
}