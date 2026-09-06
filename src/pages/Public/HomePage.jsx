import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CTA, Button, Carousel, CardDivider, Icon, LazyImg, OverlayCard, Section, SectionHeader, TeaserCard } from '../../components/ui/Kit.jsx';
import { IMG, VIDEO, brand, home, news } from '../../data/seed.js';

const HERO_PROMOS = [
  { title: 'Undergraduate admissions, outreach and open days', href: '/admissions', img: IMG.studentsGroup },
  { title: 'Graduate admissions and research degrees', href: '/admissions', img: IMG.library },
  { title: 'Browse the full course listing A–Z', href: '/courses', img: IMG.studyOutdoor },
];

const MAKE_IT = [
  {
    title: 'Courses',
    href: '/courses',
    img: IMG.hall,
    copy: 'Do you already know what you want to study? Take time to explore your options and look beyond the obvious — the most inspiring course might be one you didn’t know existed.',
  },
  {
    title: 'College life',
    href: '/student-life',
    img: IMG.campusLawn,
    copy: 'Small, friendly academic communities make Brightwell the special place it is. Our halls and colleges support you while you focus on study, friendship and opportunity.',
  },
  {
    title: 'Applying',
    href: '/admissions',
    img: IMG.writing,
    copy: 'Considering an application can feel like a big step, but the only thing our students have in common is academic ability and intellectual curiosity — they come from all over the world.',
  },
  {
    title: 'Access Brightwell',
    href: '/admissions',
    img: IMG.tutoring,
    copy: 'Deciding whether and where to study is a big step. Our free in-person and online events give you the knowledge, confidence and support to make the choice that’s right for you.',
  },
];

const GRAD_CARDS = [
  { title: 'Where do I start?', copy: 'If you’re considering graduate study at Brightwell, this step-by-step guide will get you started.' },
  { title: 'Find your postgraduate course', copy: 'Search our comprehensive A–Z of graduate courses. Filter by type and search by keyword.' },
  { title: 'Departments offering courses', copy: 'A wide range of departments offer graduate courses across all four academic divisions.' },
  { title: 'Funding your graduate study', copy: 'Find out more about funding including scholarships, research councils and studentships.' },
];

const EXCELLENCE = [
  { title: 'The Brightwell Excellence campaign', copy: 'Together, let’s turn today’s biggest challenges into tomorrow’s boldest breakthroughs.', img: IMG.conference },
  { title: 'Climate change and the environment', copy: 'When the planet calls, we always answer.', img: IMG.field },
  { title: 'Improving health: living longer, healthier lives', copy: 'We’re putting better health into everyone’s hands.', img: IMG.microscope },
  { title: 'Society, community and citizenship', copy: 'While others step aside, we step up.', img: IMG.studentsWalking },
];

const EXPLORE = [
  { title: 'Colleges and halls', copy: 'Links to all Brightwell colleges, halls and graduate houses.', img: IMG.hall, href: '/about' },
  { title: 'Divisions and departments', copy: 'List of our academic divisions and departments.', img: IMG.city, href: '/about' },
  { title: 'The Ogun libraries', copy: 'One of West Africa’s great manuscript collections, and 13 million items more.', img: IMG.library, href: '/about' },
  { title: 'Jobs at Brightwell', copy: 'Build a career in an organisation that changes lives.', img: IMG.conference, href: '/about#staff' },
];

const STUDYING = [
  { title: 'Undergraduate admissions and outreach', copy: 'Do you love to question, have an appetite for knowledge and consistently achieve top grades? Brightwell might be the place for you.', href: '/admissions' },
  { title: 'Graduate admissions', copy: 'A unique experience, including the opportunity to work with leading academics and world-class laboratories and collections.', href: '/admissions' },
  { title: 'Lifelong learning', copy: 'Part-time short courses, online and in person, bring a Brightwell education within reach of anyone with the motivation.', href: '/courses' },
  { title: 'Brightwell students', copy: 'Welcome to the students’ site — accommodation, clubs, wellbeing and everything in between.', href: '/student-life' },
];

export default function HomePage() {
  const [level, setLevel] = useState('undergraduate');
  const [q, setQ] = useState('');
  const navigate = useNavigate();

  function searchCourses(e) {
    e.preventDefault();
    const term = q.trim();
    navigate(`/courses${term || level ? `?level=${level}${term ? `&q=${encodeURIComponent(term)}` : ''}` : ''}`);
  }

  return (
    <>
      {/* ========================================================= HERO */}
      <section className="dark relative overflow-hidden bg-brand pb-0 text-white" data-component-theme="dark">
        <div className="relative">
          <video
            className="h-[62vh] w-full object-cover md:h-[74vh]"
            muted
            loop
            autoPlay
            playsInline
            poster={IMG.hero}
            aria-hidden
          >
            <source src="/video/campus.webm" type="video/webm" />
            <source src={VIDEO.ambient} type="video/quicktime" />
            <source src={VIDEO.hd} type="video/webm" />
          </video>
          <div aria-hidden className="absolute inset-0 hero-scrim" />
          <div className="c-container relative z-10 -mt-44 pb-6 pt-40 md:-mt-56 md:pb-8">
            <div className="max-w-4xl">
              <h1 className="h1 text-heading md:whitespace-nowrap" style={{ fontSize: 'clamp(2.6rem, 1.6rem + 4.4vw, 4.5rem)' }}>
                {brand.name}
              </h1>
              <p className="mt-5 max-w-[48ch] text-lg leading-relaxed text-navy-body">{brand.tagline}</p>
            </div>
          </div>
        </div>

        {/* Course search panel */}
        <div className="c-container pb-0">
          <form onSubmit={searchCourses} className="relative z-10 rounded-lg bg-brand p-6 text-white shadow-2xl ring-1 ring-white/10 md:p-8">
            <div className="md:flex md:flex-wrap md:items-center md:gap-10">
              <div className="max-w-xl flex-1">
                <h2 className="h3 text-heading md:mb-0">Start your Brightwell journey; search our courses now.</h2>
              </div>
              <div className="mt-4 flex-1 md:mt-0">
                <fieldset className="flex flex-wrap gap-x-8 p-0">
                  <legend className="sr-only">Course type</legend>
                  {[
                    ['undergraduate', 'Undergraduate'],
                    ['graduate', 'Graduate'],
                  ].map(([val, label]) => (
                    <label key={val} className="group flex cursor-pointer items-center gap-2 text-sm">
                      <input
                        type="radio"
                        name="course-type"
                        value={val}
                        checked={level === val}
                        onChange={() => setLevel(val)}
                        className="sr-only"
                      />
                      <span className="flex h-4 w-4 items-center justify-center rounded-full border border-cyan/60 transition-colors group-has-[:checked]:border-cyan">
                        <span className="hidden h-2 w-2 rounded-full bg-cyan group-has-[:checked]:block" />
                      </span>
                      {label}
                    </label>
                  ))}
                </fieldset>
                <div className="mt-3 flex flex-col gap-2 md:flex-row">
                  <label htmlFor="course-search" className="sr-only">
                    Search for a course
                  </label>
                  <input
                    id="course-search"
                    type="search"
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder="Search for a course, e.g. medicine, physics, law…"
                    className="w-full flex-1 rounded-md border border-cyan/40 bg-white px-4 py-3 text-sm text-royal outline-none placeholder:text-body/60 focus:border-cyan"
                  />
                  <Button>Search courses</Button>
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Hero promo cards */}
        <div className="c-container py-10 md:py-12">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            {HERO_PROMOS.map((p) => (
              <OverlayCard key={p.title} item={p} imgSrc={p.img} aspect="aspect-[16/10] lg:aspect-[4/5]" />
            ))}
          </div>
        </div>
      </section>

      {/* ========================================= SHORT COURSES CTA */}
      <CTA
        image={IMG.classroom}
        eyebrow="Short courses for curious minds"
        title="Learning for everyone"
        cta={{ to: '/courses', label: 'Browse short courses' }}
      >
        <p>
          Explore the Brightwell Lifelong Learning programme of online and in-person short courses — from a
          weekend on African economic history to a summer school in planetary science.
        </p>
      </CTA>

      {/* ========================================= LATEST NEWS */}
      <Section>
        <div className="c-container">
          <SectionHeader title="Latest news" cta={{ to: '/news', label: 'View all news' }} />
          <div className="grid grid-cols-1 gap-x-4 gap-y-10 sm:grid-cols-2 xl:grid-cols-4">
            {news.slice(0, 4).map((n) => (
              <TeaserCard key={n.id} item={n} imgSrc={n.img} />
            ))}
          </div>
        </div>
      </Section>

      {/* ========================================= WHAT YOU MAKE IT */}
      <Section>
        <div className="c-container">
          <SectionHeader title="Brightwell is what you make it" cta={{ to: '/admissions', label: 'Undergraduate admissions' }} />
          <div className="grid grid-cols-1 gap-x-6 gap-y-10 md:grid-cols-2 xl:grid-cols-4">
            {MAKE_IT.map((c, i) => (
              <article key={c.title} data-component-id="teaser" className="group/teaser">
                <div className="max-xl:flex-col md:flex md:flex-col xl:block">
                  <div className="mb-3 max-md:flex-none">
                    <LazyImg src={c.img} className="tile-radius" />
                  </div>
                  <div className="flex flex-col gap-3">
                    <h3 className="h5 text-heading">
                      <a href={c.href} className="animated-underline animated-underline--off group-hover/teaser:animated-underline--on">
                        {c.title}
                      </a>
                    </h3>
                    <p className="text-sm leading-relaxed">{c.copy}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </Section>

      {/* ========================================= THE TUTORIAL */}
      <CTA
        image={IMG.hall}
        flip
        eyebrow="The Brightwell Tutorial"
        title="Teaching that transforms how you think"
        cta={{ href: 'https://www.youtube.com', label: 'Watch the video' }}
      >
        <p>
          Tutorials are central to learning at Brightwell and offer a very rare level of personalised attention
          from academic experts — typically two or three students meeting a world-leading academic each week.
        </p>
      </CTA>

      {/* ========================================= GRADUATE ADMISSIONS */}
      <Section band>
        <div className="c-container">
          <SectionHeader title="Applying to Brightwell as a graduate student" cta={{ to: '/admissions', label: 'Graduate admissions' }} />
          <div className="grid grid-cols-1 gap-x-6 gap-y-4 lg:grid-cols-4">
            {GRAD_CARDS.map((c, i) => (
              <article key={c.title}>
                {i > 0 && <CardDivider />}
                <h3 className="h5 mb-2 text-heading">{c.title}</h3>
                <p className="text-sm leading-relaxed">{c.copy}</p>
              </article>
            ))}
          </div>
        </div>
      </Section>

      {/* ========================================= MEETING MINDS */}
      <CTA
        image={IMG.conference}
        eyebrow="Alumni weekend"
        title="Join us on 18–20 September when Meeting Minds returns"
        cta={{ href: '/events', label: 'View the programme' }}
      >
        <p>A weekend of discovery, connection and celebration across our colleges and halls.</p>
      </CTA>

      {/* ========================================= DISCOVER MORE */}
      <Section band>
        <div className="c-container">
          <SectionHeader title="Discover more from Brightwell" />
          <Carousel items={home.carousel} />
        </div>
      </Section>

      {/* ========================================= SPOTLIGHT */}
      <Section>
        <div className="c-container">
          <SectionHeader title="Spotlight on humanity in an age of global change" cta={{ to: '/news', label: 'More features' }} />
          <div className="grid grid-cols-1 gap-x-4 gap-y-10 sm:grid-cols-2 xl:grid-cols-4">
            {news.slice(4, 8).map((n) => (
              <TeaserCard key={n.id} item={n} imgSrc={n.img} />
            ))}
          </div>
        </div>
      </Section>

      {/* ========================================= EXCELLENCE */}
      <Section band>
        <div className="c-container">
          <SectionHeader title="Brightwell Excellence" cta={{ to: '/about#giving', label: 'Discover more' }} />
          <div className="grid grid-cols-1 gap-x-6 gap-y-4 md:grid-cols-2 lg:grid-cols-4">
            {EXCELLENCE.map((c, i) => (
              <article key={c.title} className="group/teaser">
                {i > 0 && <CardDivider />}
                <div className="mb-3">
                  <LazyImg src={c.img} className="tile-radius" />
                </div>
                <h3 className="h5 mb-2 text-heading">
                  <span className="animated-underline animated-underline--off group-hover/teaser:animated-underline--on">{c.title}</span>
                </h3>
                <p className="text-sm leading-relaxed">{c.copy}</p>
              </article>
            ))}
          </div>
        </div>
      </Section>

      {/* ========================================= EXPLORE */}
      <Section>
        <div className="c-container">
          <SectionHeader title="Explore the University" cta={{ to: '/about', label: 'More about the University' }} />
          <div className="grid grid-cols-1 gap-x-6 gap-y-10 md:grid-cols-2 xl:grid-cols-4">
            {EXPLORE.map((c) => (
              <article key={c.title} data-component-id="teaser" className="group/teaser">
                <div className="mb-3">
                  <LazyImg src={c.img} className="tile-radius" />
                </div>
                <h3 className="h5 text-heading">
                  <a href={c.href} className="animated-underline animated-underline--off group-hover/teaser:animated-underline--on">
                    {c.title}
                  </a>
                </h3>
                <div className="c-wysiwyg mt-3 text-sm leading-relaxed">
                  <p>{c.copy}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </Section>

      {/* ========================================= STUDYING AT BRIGHTWELL */}
      <Section band>
        <div className="c-container">
          <SectionHeader title="Studying at Brightwell" />
          <div className="grid grid-cols-1 gap-x-6 gap-y-4 lg:grid-cols-4">
            {STUDYING.map((c, i) => (
              <article key={c.title}>
                {i > 0 && <CardDivider />}
                <h3 className="h5 mb-2 text-heading">
                  <a href={c.href} className="animated-underline animated-underline--off hover:animated-underline--on">
                    {c.title}
                  </a>
                </h3>
                <p className="text-sm leading-relaxed">{c.copy}</p>
              </article>
            ))}
          </div>
        </div>
      </Section>
    </>
  );
}