import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import PageHeader from '../../components/ui/PageHeader.jsx';
import { Button, Icon, Section } from '../../components/ui/Kit.jsx';
import { courses, graduateCourses } from '../../data/seed.js';

const STEP_OUTLINE = [
  'Course overview',
  'Structure and content',
  'Entry requirements',
  'Fees and funding',
  'How your application is assessed',
  'Life after the degree',
];

export default function CourseDetailPage() {
  const { code } = useParams();
  const pool = [...courses, ...graduateCourses];
  const course = pool.find((c) => c.code === code) ?? pool[0];

  const isGrad = graduateCourses.some((c) => c.code === course.code);
  const facts = [
    ['Course code', course.code],
    ['Degree type', course.degree],
    ['Length', `${course.years} years`],
    ['Division', course.faculty],
    ['Subject area', course.area],
    ['Mode of study', 'Full time'],
  ];

  const related = pool.filter((c) => c.area === course.area && c.code !== course.code).slice(0, 3);
  const backLabel = isGrad ? 'Graduate courses' : 'Undergraduate courses';
  const backHref = isGrad ? '/courses?level=graduate' : '/courses?level=undergraduate';

  const [applyOpen, setApplyOpen] = useState(false);
  const [applied, setApplied] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', country: '', personalStatement: '' });

  useEffect(() => {
    if (!applyOpen) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') setApplyOpen(false);
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [applyOpen]);

  function openApply() {
    setApplied(false);
    setForm({ name: '', email: '', phone: '', country: '', personalStatement: '' });
    setApplyOpen(true);
  }

  function submitApplication(e) {
    e.preventDefault();
    setApplied(true);
  }

  return (
    <>
      <PageHeader
        title={course.title}
        lead={course.blurb}
        crumbs={[
          { to: '/', label: 'Home' },
          { to: '/courses', label: 'Courses A–Z' },
          { to: backHref, label: backLabel },
          { label: course.title },
        ]}
      />

      <Section>
        <div className="c-container">
          <div className="grid grid-cols-12 gap-8">
            <article className="col-span-full lg:col-span-8">
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center rounded-md bg-brand px-2 py-1 text-xs font-semibold text-cyan">
                  {course.code}
                </span>
                <span className="tag-pill">{course.area}</span>
                <span className="tag-pill">{course.degree}</span>
              </div>

              <h2 className="h3 mt-6 text-heading">About the course</h2>
              <p className="mt-3 text-[1.05rem] leading-relaxed">
                {course.title} is a discipline with a proud history and a fast-changing future. Built on a foundation
                of rigorous small-group teaching, the course lets you move from a broad, well-evidenced base to
                increasingly specialist interests of your own choosing.
              </p>
              <div className="mt-5 space-y-4 text-[1.02rem] leading-relaxed">
                <p>
                  In the early years you take core modules that establish the fundamentals. You are taught in
                  tutorial groups of two or three, supported by lectures, laboratory and fieldwork classes, and a
                  personal tutor who follows your progress from week one. This structure — uncommon elsewhere — is
                  the reason Brightwell graduates are known for thinking clearly under pressure.
                </p>
                <p>
                  Later years open into options. Many students design a course of study that leans towards the parts
                  of the subject that excite them most, whether that is a specialised subfield, an applied
                  professional route or a longer independent research project in the final year.
                </p>
                <p>
                  Teaching across the {course.faculty} brings together researchers, clinicians and practitioners.
                  You will be taught by people who are at the very edge of their fields — which is also why employers
                  value a Brightwell degree so highly.
                </p>
              </div>

              <h2 className="h3 mt-10 text-heading">Course structure</h2>
              <ol className="mt-5 space-y-0">
                {[
                  `Years 1–2: core modules and methods — ${course.title} foundations, with regular tutorials and written work.`,
                  `Optional papers: choose from the full range of ${course.area.toLowerCase()} electives on offer to undergraduates.`,
                  `Final years: advanced options plus an extended project or dissertation drawing on primary sources and original work.`,
                ].map((t, i) => (
                  <li key={i} className="flex items-start gap-4 border-b border-line py-4">
                    <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand text-sm font-semibold text-white">
                      {i + 1}
                    </span>
                    <p className="text-[1.02rem] leading-relaxed">{t}</p>
                  </li>
                ))}
              </ol>

              <h2 className="h3 mt-10 text-heading">Entry requirements</h2>
              <p className="mt-3 text-[1.02rem] leading-relaxed">
                Offers are made on merit and predicted attainment. Typical offers for {course.degree} range between
                three A*s and three As at A-level (or the equivalent in other qualifications), plus any subject
                prerequisites set by the department.
              </p>
              <ul className="mt-4 space-y-2.5">
                {[
                  'A-level results (or equivalent) in relevant subjects, including prerequisites where required',
                  'Achievement in a written assessment for most candidates',
                  'Subject-focused interview with academic tutors',
                  'Evidence of intellectual curiosity beyond the syllabus',
                ].map((t, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-[1.02rem] leading-relaxed">
                    <Icon name="check-circle" className="c-icon--sm mt-0.5 fill-accent" />
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </article>

            <aside className="col-span-full lg:col-span-4">
              <div className="sticky top-28 space-y-6">
                <div className="rounded-xl bg-paper ring-1 ring-line">
                  <div className="border-b border-line p-6">
                    <h2 className="h5 text-heading">Key facts</h2>
                  </div>
                  <dl className="divide-y divide-line">
                    {facts.map(([k, v]) => (
                      <div key={k} className="flex items-center justify-between gap-4 px-6 py-3.5 text-sm">
                        <dt className="text-body/80">{k}</dt>
                        <dd className="text-right font-semibold text-heading">{v}</dd>
                      </div>
                    ))}
                  </dl>
                  <div className="p-6">
                    <Button onClick={openApply}>Apply now</Button>
                  </div>
                </div>

                <div className="rounded-xl bg-band p-6">
                  <h3 className="h5 text-heading">How applications are assessed</h3>
                  <p className="mt-2 text-sm text-body">
                    We look for strong prior attainment, aptitude for the subject and genuine engagement with ideas.
                  </p>
                  <ul className="mt-3 space-y-2">
                    {STEP_OUTLINE.map((s, i) => (
                      <li key={s} className="flex items-center gap-2.5 text-sm">
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand text-[10px] font-bold text-white">
                          {i + 1}
                        </span>
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-xl bg-paper p-6 ring-1 ring-line">
                  <h3 className="h5 text-heading">Related courses</h3>
                  <ul className="mt-3 divide-y divide-line">
                    {related.length === 0 && <li className="py-3 text-sm text-body">No related {course.area} courses listed.</li>}
                    {related.map((c) => (
                      <li key={c.code}>
                        <Link
                          to={`/courses/${c.code}`}
                          className="animated-underline animated-underline--off hover:animated-underline--on flex items-center justify-between gap-2 py-3 text-sm font-medium text-heading"
                        >
                          <span>{c.title}</span>
                          <Icon name="chevron-right" className="c-icon--xs shrink-0 fill-accent" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </Section>

      <Section band>
        <div className="c-container flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div>
            <h3 className="h4 text-heading">Ready to take the next step?</h3>
            <p className="mt-1 max-w-[56ch] text-sm text-body">
              Book an appointment with our admissions team, or visit an open day to meet tutors and current students.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button to="/admissions">Book an appointment</Button>
            <Button variant="secondary" to={backHref}>Back to {backLabel.toLowerCase()}</Button>
          </div>
        </div>
      </Section>

      {applyOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Apply to ${course.title}`}
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 p-4"
          onClick={() => setApplyOpen(false)}
        >
          <div
            className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl md:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            {applied ? (
              <div className="text-center">
                <Icon name="check-circle" className="c-icon--lg mx-auto fill-accent" />
                <h3 className="h3 mt-4 text-heading">Application submitted</h3>
                <p className="mt-2 text-sm leading-relaxed text-body">
                  Thank you, {form.name || 'candidate'}. Your application for {course.title} ({course.code}) has been
                  recorded. In a real deployment this would be sent to our admissions team.
                </p>
                <div className="mt-6">
                  <Button onClick={() => setApplyOpen(false)}>Close</Button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="h3 text-heading">Apply to {course.title}</h3>
                    <p className="mt-1 text-sm text-body">
                      {course.code} · {course.degree} · {course.years} years · {course.faculty}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setApplyOpen(false)}
                    aria-label="Close application form"
                    className="rounded-md p-2 text-body hover:bg-band hover:text-heading"
                  >
                    <Icon name="cross" className="c-icon--sm" />
                  </button>
                </div>

                <form onSubmit={submitApplication} className="mt-6 grid grid-cols-2 gap-4">
                  <label className="col-span-2 block text-sm md:col-span-1">
                    <span className="mb-1 block font-medium text-heading">Full name</span>
                    <input
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full rounded-md border border-line bg-white px-3 py-2.5 text-sm outline-none focus:border-accent"
                    />
                  </label>
                  <label className="col-span-2 block text-sm md:col-span-1">
                    <span className="mb-1 block font-medium text-heading">Email address</span>
                    <input
                      required
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full rounded-md border border-line bg-white px-3 py-2.5 text-sm outline-none focus:border-accent"
                    />
                  </label>
                  <label className="col-span-2 block text-sm md:col-span-1">
                    <span className="mb-1 block font-medium text-heading">Phone number</span>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="w-full rounded-md border border-line bg-white px-3 py-2.5 text-sm outline-none focus:border-accent"
                    />
                  </label>
                  <label className="col-span-2 block text-sm md:col-span-1">
                    <span className="mb-1 block font-medium text-heading">Country of residence</span>
                    <input
                      value={form.country}
                      onChange={(e) => setForm({ ...form, country: e.target.value })}
                      className="w-full rounded-md border border-line bg-white px-3 py-2.5 text-sm outline-none focus:border-accent"
                    />
                  </label>
                  <label className="col-span-2 block text-sm">
                    <span className="mb-1 block font-medium text-heading">Personal statement</span>
                    <textarea
                      rows={5}
                      value={form.personalStatement}
                      onChange={(e) => setForm({ ...form, personalStatement: e.target.value })}
                      placeholder="Tell us why you are interested in this course."
                      className="w-full rounded-md border border-line bg-white px-3 py-2.5 text-sm outline-none focus:border-accent"
                    />
                  </label>
                  <div className="col-span-2">
                    <Button icon="arrow">Submit application</Button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
