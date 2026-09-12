import React from 'react';
import { Link } from 'react-router-dom';
import { Icon, Section, SectionHeader } from '../../components/ui/Kit.jsx';
import { IMG, stats, home } from '../../data/seed.js';
import { learningCourses, courseDuration, BRANCHES, levelLabel } from '../../data/learning.js';
import { getPortalUser } from '../../lib/portalAuth.js';

const FEATURED_CARDS = [
  {
    title: 'Self-paced video lessons',
    copy: 'Bite-sized lessons taught by subject experts — pause, rewind, and learn at the speed that suits you.',
    icon: 'play',
    accent: 'bg-cyan/15 text-cyan-deep',
  },
  {
    title: 'End-of-course quizzes',
    copy: 'Each course ends with a multi-question quiz. Your best score is saved to your learner record.',
    icon: 'award',
    accent: 'bg-pill/20 text-pill-ink',
  },
  {
    title: 'Portfolio assignments',
    copy: 'Submit short pieces of work for every course. Instructors mark and respond to your portfolio.',
    icon: 'clipboard',
    accent: 'bg-emerald-500/15 text-emerald-700',
  },
];

const HOW_IT_WORKS = [
  { step: '01', title: 'Browse the catalogue', copy: 'Pick from secondary-school or university courses across sciences, humanities and more.' },
  { step: '02', title: 'Sign in & enrol', copy: 'Create a free account, then enrol in as many courses as you like with one click.' },
  { step: '03', title: 'Learn at your pace', copy: 'Watch the video lesson, review the notes, mark complete and take the quiz.' },
  { step: '04', title: 'Submit & progress', copy: 'Complete assignments, track your progress on a personal dashboard and earn a record.' },
];

export default function HomePage() {
  const user = getPortalUser();
  const featured = [...learningCourses]
    .sort((a, b) => b.modules.reduce((acc, m) => acc + m.lessons.length, 0) - a.modules.reduce((acc, m) => acc + m.lessons.length, 0))
    .slice(0, 3);

  return (
    <>
      {/* ========================================================= HERO */}
      <section className="dark relative isolate flex h-svh w-full flex-col overflow-hidden bg-brand text-white">
        <img
          src={IMG.heroOverlay}
          alt=""
          className="absolute inset-0 size-full object-cover object-center"
        />

        <div className="c-container relative z-10 flex flex-1 flex-col items-center justify-center py-24 text-center md:py-32">
          <div className="px-6 py-8 md:px-10 md:py-12">
            <h1
              className="h1 text-heading drop-shadow-[0_2px_18px_rgba(0,0,0,0.35)]"
              style={{ fontSize: 'clamp(2.8rem, 1.6rem + 5vw, 5.25rem)' }}
            >
              Learn what you love,
              <br />
              at a pace that fits.
            </h1>
            <p className="mx-auto px-8 py-4 mt-6 max-w-[52ch] text-xl leading-relaxed rounded bg-cyan/10 backdrop-blur-2xl md:text-xl font-medium">
              Brightwell Academy is a focused online learning platform for secondary-school and university study.
              Watch video lessons, take quizzes and submit assignments all in one place.
            </p>
            <div className="mt-8 lg:mt-20 flex flex-wrap items-center justify-center gap-3">
              <Link to="/courses" className="c-button c-button--primary text-lg">
                Browse courses
                <Icon name="arrow" className="c-icon--sm" />
              </Link>
              <Link to="/portal/login" className="c-button c-button--secondary text-lg">
                {user ? 'Go to your dashboard' : 'Sign in'}
              </Link>
            </div>
          </div>
        </div>

        {/* Stats pinned to bottom edge */}
        <dl className="relative z-10 mx-auto w-full max-w-6xl border-t border-white/15 bg-brand/60 px-6 py-5 backdrop-blur-sm">
          <div className="grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-5">
            {stats.map((s) => (
              <div key={s.label} className="border-l border-white/20 pl-4 text-left">
                <dt className="text-sm text-white/75">{s.label}</dt>
                <dd className="mt-1 font-heading text-2xl text-heading">{s.value}</dd>
              </div>
            ))}
          </div>
        </dl>
      </section>

      {/* ========================================================= PILLARS */}
      <Section band>
        <div className="c-container">
          <SectionHeader title="Built for focused learning" />
          <div className="grid gap-6 md:grid-cols-3">
            {FEATURED_CARDS.map((c) => (
              <article key={c.title} className="rounded-xl bg-paper p-6 ring-1 ring-line">
                <span className={`inline-grid size-12 place-items-center rounded-lg ${c.accent}`}>
                  <Icon name={c.icon} className="c-icon--md" />
                </span>
                <h3 className="h5 mt-5 text-heading">{c.title}</h3>
                <p className="mt-2 text-sm leading-relaxed">{c.copy}</p>
              </article>
            ))}
          </div>
        </div>
      </Section>

      {/* ========================================================= BRANCHES */}
      <Section>
        <div className="c-container">
          <SectionHeader
            title="Pick the path that fits"
            cta={{ to: '/courses', label: 'See all courses' }}
          />
          <div className="grid gap-6 lg:grid-cols-2">
            {BRANCHES.map((b) => {
              const count = learningCourses.filter((c) => c.branch === b.id).length;
              return (
                <Link
                  key={b.id}
                  to={`/courses?branch=${b.id}`}
                  className="group relative overflow-hidden rounded-xl bg-paper p-7 ring-1 ring-line transition-shadow hover:shadow-lg"
                >
                  <div className="flex items-start gap-4">
                    <span className={cn(
                      'grid size-12 shrink-0 place-items-center rounded-lg',
                      b.id === 'university' ? 'bg-cyan/15 text-cyan-deep' : 'bg-pill/20 text-pill-ink'
                    )}>
                      <Icon name={b.id === 'university' ? 'graduation-cap' : 'book-open'} className="c-icon--md" />
                    </span>
                    <div className="flex-1">
                      <h3 className="h4 text-heading">
                        <span className="animated-underline animated-underline--off group-hover:animated-underline--on">{b.label}</span>
                      </h3>
                      <p className="mt-1 text-sm text-body">{b.tagline}</p>
                      <p className="mt-3 text-xs font-semibold text-accent">{count} courses available</p>
                    </div>
                    <Icon name="arrow" className="c-icon--sm fill-accent transition-transform group-hover:translate-x-1" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </Section>

      {/* ========================================================= FEATURED COURSES */}
      <Section band>
        <div className="c-container">
          <SectionHeader
            title="Featured courses"
            cta={{ to: '/courses', label: 'Browse the catalogue' }}
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((c) => (
              <Link
                key={c.slug}
                to={`/courses/${c.slug}`}
                className="group flex flex-col overflow-hidden rounded-xl bg-paper ring-1 ring-line transition-shadow hover:shadow-lg"
              >
                <div className="relative overflow-hidden">
                  <img src={c.img} alt="" className="aspect-video w-full object-cover transition-transform duration-300 group-hover:scale-105" />
                  <span className="absolute left-3 top-3 rounded-md bg-brand px-2 py-1 text-[11px] font-semibold text-cyan">
                    {c.subject}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <p className="text-xs font-semibold text-accent">{c.branch === 'university' ? 'University' : 'Secondary School'} · {levelLabel(c)}</p>
                  <h3 className="h5 mt-1 text-heading">
                    <span className="animated-underline animated-underline--off group-hover:animated-underline--on">{c.title}</span>
                  </h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-body">{c.blurb}</p>
                  <dl className="mt-4 flex items-center gap-4 text-xs text-body/80">
                    <div className="flex items-center gap-1">
                      <Icon name="play" className="c-icon--xs fill-accent" />
                      {c.modules.reduce((acc, m) => acc + m.lessons.length, 0)} lessons
                    </div>
                    <div className="flex items-center gap-1">
                      <Icon name="clock" className="c-icon--xs fill-accent" />
                      {Math.round(courseDuration(c) / 60)} hrs
                    </div>
                    <div className="ml-auto">{c.teacher.split(' ').slice(-1)[0]}</div>
                  </dl>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </Section>

      {/* ========================================================= HOW IT WORKS */}
      <Section>
        <div className="c-container">
          <SectionHeader title="How Brightwell works" />
          <ol className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {HOW_IT_WORKS.map((s) => (
              <li key={s.step} className="rounded-xl bg-band/40 p-6 ring-1 ring-line">
                <span className="font-heading text-3xl text-accent">{s.step}</span>
                <h3 className="h5 mt-3 text-heading">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed">{s.copy}</p>
              </li>
            ))}
          </ol>
        </div>
      </Section>

      {/* ========================================================= CTA */}
      <Section band>
        <div className="c-container">
          <div className="dark overflow-hidden rounded-2xl bg-brand text-white">
            <div className="grid items-center gap-8 p-8 md:grid-cols-2 md:p-12">
              <div>
                <p className="text-sm font-semibold uppercase tracking-widest text-cyan">Start today</p>
                <h2 className="h2 mt-3 text-heading">Ready when you are.</h2>
                <p className="mt-4 max-w-[44ch] text-base leading-relaxed text-navy-body">
                  Sign in to track your progress across every course. Your lessons, quizzes and assignments
                  wait where you left them.
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link to="/portal/login" className="c-button c-button--primary">
                    {user ? 'Open your dashboard' : 'Sign in to learn'}
                    <Icon name="arrow" className="c-icon--sm" />
                  </Link>
                  <Link to="/courses" className="c-button c-button--secondary">
                    Browse courses
                  </Link>
                </div>
              </div>
              <div className="relative hidden md:block">
                <img src={IMG.classroom} alt="" className="aspect-[4/3] w-full rounded-xl object-cover" />
              </div>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}

function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}