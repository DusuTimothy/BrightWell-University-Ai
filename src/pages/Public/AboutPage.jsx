import React from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../../components/ui/PageHeader.jsx';
import { Icon, Section, SectionHeader } from '../../components/ui/Kit.jsx';
import { IMG, brand, stats } from '../../data/seed.js';

const PILLARS = [
  {
    icon: 'play',
    title: 'Video-first lessons',
    copy: 'Each lesson is a short video paired with structured notes. Pause, rewind and review at the speed that fits you.',
  },
  {
    icon: 'target',
    title: 'Progress you can see',
    copy: 'Every lesson, quiz and assignment updates your personal progress bar and learner record.',
  },
  {
    icon: 'award',
    title: 'Quizzes & assignments',
    copy: 'Finish the lessons, take the end-of-course quiz, and submit short assignments for instructor feedback.',
  },
  {
    icon: 'users',
    title: 'Instructor-led',
    copy: 'Courses are taught by subject-matter instructors. Their names, photos and qualifications are on every course page.',
  },
];

const ROLES = [
  {
    title: 'Learners',
    copy: 'Pick a course, watch the lessons, take the quiz and submit assignments. Your progress is saved automatically.',
    cta: 'Browse courses',
    to: '/courses',
  },
  {
    title: 'Instructors',
    copy: 'Manage your own courses — review learner grades, respond to submissions and keep the catalogue up to date.',
    cta: 'Sign in as instructor',
    to: '/portal/login',
  },
  {
    title: 'Administrators',
    copy: 'See the platform at a glance — courses live, learners enrolled, quiz pass rates and platform health.',
    cta: 'Sign in as administrator',
    to: '/portal/login',
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHeader
        title="How Brightwell works"
        lead="Brightwell Academy is an e-learning platform built around short video lessons, structured notes, quizzes and assignments. Here's what to expect when you sign in."
        crumbs={[{ to: '/', label: 'Home' }, { label: 'About' }]}
      />

      <Section>
        <div className="c-container">
          <SectionHeader title="The platform in numbers" />
          <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
            {stats.map((s) => (
              <div key={s.label} className="rounded-xl bg-band/40 p-5 text-center ring-1 ring-line">
                <p className="font-heading text-2xl text-heading">{s.value}</p>
                <p className="mt-1 text-xs text-body/80">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Section band>
        <div className="c-container">
          <SectionHeader title="What makes Brightwell different" />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {PILLARS.map((p) => (
              <article key={p.title} className="rounded-xl bg-paper p-6 ring-1 ring-line">
                <span className="inline-grid size-12 place-items-center rounded-lg bg-accent/10 text-accent">
                  <Icon name={p.icon} className="c-icon--md" />
                </span>
                <h3 className="h5 mt-4 text-heading">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed">{p.copy}</p>
              </article>
            ))}
          </div>
        </div>
      </Section>

      <Section>
        <div className="c-container">
          <SectionHeader title="Built for three roles" />
          <div className="grid gap-6 lg:grid-cols-3">
            {ROLES.map((r) => (
              <div key={r.title} className="flex flex-col rounded-xl bg-paper p-6 ring-1 ring-line">
                <h3 className="h4 text-heading">{r.title}</h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed">{r.copy}</p>
                <div className="mt-5">
                  <Link to={r.to} className="c-button c-button--secondary !py-2.5">
                    {r.cta}
                    <Icon name="arrow" className="c-icon--sm" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Section band>
        <div className="c-container">
          <div className="dark overflow-hidden rounded-2xl bg-brand text-white">
            <div className="grid items-center gap-8 p-8 md:grid-cols-2 md:p-12">
              <div>
                <p className="text-sm font-semibold uppercase tracking-widest text-cyan">Questions?</p>
                <h2 className="h2 mt-3 text-heading">We're here to help.</h2>
                <p className="mt-4 max-w-[44ch] text-base leading-relaxed text-navy-body">
                  Reach the team at <a className="font-semibold text-cyan hover:text-white" href={`mailto:${brand.email}`}>{brand.email}</a> — we reply within one working day.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link to="/courses" className="c-button c-button--primary">Browse courses</Link>
                  <Link to="/portal/login" className="c-button c-button--secondary">Sign in</Link>
                </div>
              </div>
              <div className="relative hidden md:block">
                <img src={IMG.tutoring} alt="" className="aspect-[4/3] w-full rounded-xl object-cover" />
              </div>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}